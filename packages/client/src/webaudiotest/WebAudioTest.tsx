import PitchShifter from "./PitchShifter";
import PitchShiftHTML5 from "./PitchShiftHTML5";

const WebAudioTest = () => {
  return (
    <div>
      <div>Web Audio Test</div>
      <PitchShifter
        audioFilePath={`${
          import.meta.env.VITE_SERVER_URL
        }/A/ACDC/ACDC - [1979] Highway to Hell (Remastered)/03 - Walk All Over You.mp3`}
      />

      <PitchShiftHTML5
        file={`${
          import.meta.env.VITE_SERVER_URL
        }/A/ACDC/ACDC - [1979] Highway to Hell (Remastered)/03 - Walk All Over You.mp3`}
      />
    </div>
  );
};

export default WebAudioTest;
