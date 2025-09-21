import { Song } from "guitar-dashboard-types";
import { RefObject, useCallback, useRef } from "react";
import * as Tone from "tone";

// Audio Processing Types
interface IAudioProcessor {
  audioContext: AudioContext;
  scriptNode: ScriptProcessorNode;
  pitchRatio: number;

  setPitchCents(cents: number): void;
  connect(destination: AudioNode): void;
  disconnect(): void;
  readonly input: ScriptProcessorNode;
}

// This only works well for pitch shifting down. Didn't sound good when pitch shifting up.
// Simple Pitch Shifter for Web Audio API
class AudioProcessor implements IAudioProcessor {
  public audioContext: AudioContext;
  public scriptNode: ScriptProcessorNode;
  public pitchRatio: number;
  private pitchBuffer: number[] = [];
  private pitchReadIndex: number = 0;
  private lastOutput: number = 0;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
    this.pitchRatio = 1.0;
    this.setupProcessor();
  }

  private setupProcessor(): void {
    this.scriptNode.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputData = event.inputBuffer.getChannelData(0);
      const outputData = event.outputBuffer.getChannelData(0);
      this.processAudio(inputData, outputData);
    };
  }

  private processAudio(input: Float32Array, output: Float32Array): void {
    if (this.pitchRatio !== 1.0) {
      this.simplePitchShift(input, output);
      // Apply gentle smoothing to reduce artifacts
      this.smoothOutput(output);
    } else {
      // Pass through normally
      for (let i = 0; i < output.length; i++) {
        output[i] = input[i];
      }
    }
  }

  private smoothOutput(output: Float32Array): void {
    // Simple smoothing filter to reduce artifacts
    for (let i = 1; i < output.length; i++) {
      output[i] = output[i] * 0.95 + output[i - 1] * 0.05;
    }
  }

  private simplePitchShift(input: Float32Array, output: Float32Array): void {
    // Add input to buffer
    for (let i = 0; i < input.length; i++) {
      this.pitchBuffer.push(input[i]);
    }

    // Read from buffer with linear interpolation for smoother sound
    for (let i = 0; i < output.length; i++) {
      const readPos = this.pitchReadIndex;
      const readPosFloor = Math.floor(readPos);
      const readPosCeil = Math.ceil(readPos);
      const fraction = readPos - readPosFloor;

      if (
        readPosFloor < this.pitchBuffer.length &&
        readPosCeil < this.pitchBuffer.length
      ) {
        // Linear interpolation between samples
        const sample1 = this.pitchBuffer[readPosFloor] || 0;
        const sample2 = this.pitchBuffer[readPosCeil] || 0;
        output[i] = sample1 + (sample2 - sample1) * fraction;
      } else if (readPosFloor < this.pitchBuffer.length) {
        output[i] = this.pitchBuffer[readPosFloor] || 0;
      } else {
        output[i] = 0;
      }

      this.pitchReadIndex += this.pitchRatio;
    }

    // Clean up old buffer data more conservatively
    if (this.pitchBuffer.length > 16384) {
      const removeCount = Math.floor(this.pitchReadIndex * 0.5); // Remove only half to prevent glitches
      this.pitchBuffer.splice(0, removeCount);
      this.pitchReadIndex -= removeCount;
    }
  }

  setPitchCents(cents: number): void {
    // Limit pitch shift to reasonable range to reduce artifacts
    const limitedCents = Math.max(-1200, Math.min(1200, cents)); // -1 to +1 octave
    this.pitchRatio = Math.pow(2, limitedCents / 1200);
  }

  connect(destination: AudioNode): void {
    this.scriptNode.connect(destination);
  }

  disconnect(): void {
    this.scriptNode.disconnect();
  }

  get input(): ScriptProcessorNode {
    return this.scriptNode;
  }
}

export const useWebAudioProcessing = (
  htmlAudioElementRef: RefObject<HTMLAudioElement>,
  song: Song
) => {
  const audioContext = new AudioContext();
  const pitchUpRef = useRef<Tone.PitchShift>(null);
  const pitchDownRef = useRef<AudioProcessor | null>(null);

  const connectHTMLAudioToWebAudio = useCallback(async () => {
    // Check if audio element exists
    if (!htmlAudioElementRef.current) return;

    // Create media source connecting the HTML Audio Element to Web Audio API for further processing.
    const source = audioContext.createMediaElementSource(
      htmlAudioElementRef.current
    );

    // ToneJS is used to pith shift -UP- only.
    // This connects the Web Audio API context to ToneJS.
    // Pass true as the second argument to dispose of the previous audio context.
    // Even though the player unmounts and a new context is created for each song, Tone.setContext is static and holds on to the reference to the previous context.
    Tone.setContext(audioContext, true);

    // Create my own processor to handle pitching down
    const pitchShiftDownNode = new AudioProcessor(audioContext);
    pitchDownRef.current = pitchShiftDownNode;

    // Create ToneJS processor to handle pitching up
    const pitchShiftUpNode = new Tone.PitchShift();
    pitchUpRef.current = pitchShiftUpNode;

    // Initialize the pitch
    setPitch(song.settings.pitch ?? 0);

    // Create gain node for volume control
    const gainNode = new Tone.Gain(1);

    // Connect: HTML Audio element output > Gain > PitchShift Down > PitchShift Up > Speakers.
    source.connect(gainNode.input);
    gainNode.connect(pitchShiftUpNode);
    pitchShiftUpNode.connect(pitchShiftDownNode.input);
    pitchShiftDownNode.connect(audioContext.destination);
  }, [audioContext]);

  const setPitch = useCallback((cents: number) => {
    // Pitching down takes cents value.
    // If the value is negative use it. If its positive, this node stays at 0.
    pitchDownRef.current &&
      pitchDownRef.current.setPitchCents(Math.min(cents, 0));

    // Pitching up takes an semitone value so cents needs to be converted to semitones.
    // If the value is positive use it. If its negative, this node stays at 0.
    if (pitchUpRef.current) pitchUpRef.current.pitch = Math.max(0, cents / 100);
  }, []);

  return {
    connectHTMLAudioToWebAudio,
    setPitch,
  };
};
