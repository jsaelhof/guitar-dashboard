import { useRef, useEffect, useMemo, useState } from "react";

interface PitchShifterProps {
  audioFilePath: string;
  pitchCents?: number;
}

const PitchShifter: React.FC<PitchShifterProps> = ({
  audioFilePath = "/path/to/your/audio.mp3",
  pitchCents = 0,
}) => {
  // Refs to store audio objects
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playStartTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  // Initialize audio context and load audio
  useEffect(() => {
    // Create audio context
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Load and decode audio
    const loadAudio = async (): Promise<void> => {
      try {
        const response = await fetch(audioFilePath);
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current!.decodeAudioData(
          arrayBuffer
        );
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();

    // Clean up on unmount
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioFilePath]);

  // Play audio with pitch shift
  const togglePlay = useMemo(
    () => (): void => {
      if (!audioBufferRef.current || !audioContextRef.current) return;

      // Resume context if suspended
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      if (isPlaying) {
        // Pause playback
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
          // Calculate how far we are into the audio
          const elapsedTime =
            audioContextRef.current.currentTime - playStartTimeRef.current;
          pauseTimeRef.current = elapsedTime;
          sourceNodeRef.current = null;
        }
        setIsPlaying(false);
      } else {
        // Stop previous playback if any
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
        }

        // Create new source node
        sourceNodeRef.current = audioContextRef.current.createBufferSource();
        sourceNodeRef.current.buffer = audioBufferRef.current;

        // Apply pitch shift
        sourceNodeRef.current.detune.value = pitchCents;

        // Connect to output and play
        sourceNodeRef.current.connect(audioContextRef.current.destination);

        // Start from the paused position or beginning
        sourceNodeRef.current.start(0, pauseTimeRef.current);
        playStartTimeRef.current = audioContextRef.current.currentTime;
        setIsPlaying(true);

        // Reset playing state when audio ends
        sourceNodeRef.current.onended = () => {
          setIsPlaying(false);
          sourceNodeRef.current = null;
          pauseTimeRef.current = 0;
        };
      }
    },
    [pitchCents, isPlaying]
  );

  const pitchUp = useMemo(
    () => (): void => {
      if (sourceNodeRef.current)
        sourceNodeRef.current.detune.value =
          sourceNodeRef.current.detune.value + 1;
    },
    []
  );

  const pitchDown = useMemo(
    () => (): void => {
      if (sourceNodeRef.current)
        sourceNodeRef.current.detune.value =
          sourceNodeRef.current.detune.value - 1;
    },
    []
  );

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={pitchDown}>-</button>
      <button onClick={pitchUp}>+</button>
      {sourceNodeRef.current?.detune.value}
    </div>
  );
};

export default PitchShifter;
