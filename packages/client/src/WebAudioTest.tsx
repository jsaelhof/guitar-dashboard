import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PitchShifter } from "soundtouchjs";

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();
let shifter;

const WebAudioTest = () => {
  const [buffer, setBuffer] = useState<AudioBuffer>();
  useEffect(() => {
    const load = async () => {
      const response = await fetch("04 Rock Believer.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(
        arrayBuffer,
        (buff) => {
          shifter = new PitchShifter(audioContext, buff, 1024);
          shifter.on("play", (detail) => {
            console.log(detail);
            // do something with detail.timePlayed;
            // do something with detail.formattedTimePlayed;
            // do something with detail.percentagePlayed
          });
          shifter.tempo = 1;
          shifter.pitch = 1.1; // This works but I can't figure out yet how to change it after it starts.
        }
      );
      setBuffer(audioBuffer);
    };

    load();
  }, []);

  const play = useCallback((b: AudioBuffer) => {
    // const source = audioContext.createBufferSource();
    // source.buffer = b;
    // source.connect(audioContext.destination);
    // source.start(0);
    shifter.connect(gainNode); // connect it to a GainNode to control the volume
    gainNode.connect(audioContext.destination); // attach the GainNode to the 'destination' to begin playback
    //};
  }, []);

  return (
    <div>
      <div>Test Web Audio API</div>

      {buffer && (
        <>
          <button
            onClick={() => {
              play(buffer);
            }}
          >
            Play
          </button>
        </>
      )}
      {/* <audio
        ref={audioRef}
        src="04 Rock Believer.mp3"
        onCanPlayThrough={() => {
          console.log("can play");
          // get the audio element

          // pass it into the audio context
          const track = audioContext.createMediaElementSource(audioRef.current);
          track.connect(audioContext.destination);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
        }}
        //onPlay={onPlay}
        controls
      />

      <button
        data-playing="false"
        role="switch"
        aria-checked="false"
        onClick={() => {
          // Check if context is in suspended state (autoplay policy)
          if (audioContext.state === "suspended") {
            audioContext.resume();
          }

          console.log(audioRef.current?.paused);

          // Play or pause track depending on state
          if (audioRef.current?.paused) {
            audioRef.current?.play();
          } else {
            audioRef.current?.pause();
          }
        }}
      >
        <span>Play/Pause</span>
      </button>
    */}
    </div>
  );
};

export default WebAudioTest;
