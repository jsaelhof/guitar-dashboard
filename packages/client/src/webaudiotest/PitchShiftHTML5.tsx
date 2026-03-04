import { useState, useRef, useEffect } from "react";
import { SoundTouch, SimpleFilter } from "soundtouch-js";

export type PitchShiftHTMLProps = {
  file: string;
};

export default function PitchShiftHTML5({ file }: PitchShiftHTMLProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(0); // in semitones
  const [tempo, setTempo] = useState(1.0); // 1.0 is normal speed
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const soundTouchRef = useRef<SoundTouch | null>(null);
  const filterRef = useRef<SimpleFilter | null>(null);

  // Initialize Web Audio API and SoundTouch on component mount
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Create audio context
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // Create source node from audio element
    const sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNodeRef.current = sourceNode;

    // Initialize SoundTouch
    const soundTouch = new SoundTouch();
    soundTouchRef.current = soundTouch;

    // Create filter
    const filter = new SimpleFilter(sourceNode, soundTouch);
    filterRef.current = filter;

    // Connect filter to audio context destination
    filter.connect(audioContext.destination);

    // Return cleanup function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlayback = async () => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioContextRef.current) return;

    try {
      // Start the audio context if it's suspended
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        audioElement.pause();
      } else {
        await audioElement.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const updatePitch = (newPitch: number) => {
    if (soundTouchRef.current) {
      soundTouchRef.current.pitch = newPitch;
      setPitch(newPitch);
    }
  };

  const updateTempo = (newTempo: number) => {
    if (soundTouchRef.current) {
      soundTouchRef.current.tempo = newTempo;
      setTempo(newTempo);
    }
  };

  return (
    <div className="p-4">
      <audio
        ref={audioRef}
        src={file}
        className="mb-4 w-full"
        crossOrigin="anonymous"
      />
      <div className="space-y-4">
        <div className="space-x-4">
          <button
            onClick={togglePlayback}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
        <div className="space-y-2">
          <label className="block">
            Pitch (semitones):
            <input
              type="range"
              min="-12"
              max="12"
              step="0.1"
              value={pitch}
              onChange={(e) => updatePitch(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="ml-2">{pitch.toFixed(1)}</span>
          </label>
          <label className="block">
            Tempo:
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={tempo}
              onChange={(e) => updateTempo(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="ml-2">{tempo.toFixed(1)}x</span>
          </label>
        </div>
      </div>
    </div>
  );
}
