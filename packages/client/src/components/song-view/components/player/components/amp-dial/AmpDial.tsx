import {
  AmpKnob,
  AmpKnobBarrel,
  AmpKnobMark,
  AmpKnobSurface,
  AmpNumbers,
} from "./AmpDial.styles";

export type AmpDialProps = {
  value: number; // Value is expected to be a float between 0 and 1.
  percent?: boolean;
  displayValues?: [
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?
  ];
};

const AmpDial = ({
  value,
  percent = false,
  displayValues = [
    "0",
    undefined,
    "2",
    undefined,
    "4",
    undefined,
    "6",
    undefined,
    "8",
    undefined,
    "10",
  ],
}: AmpDialProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 1);

  return (
    <AmpKnob>
      {displayValues.map((value, i) => (
        <AmpNumbers key={i} value={i / 10} tick={value == null}>
          {value == null ? "-" : percent ? value * 10 : value}
        </AmpNumbers>
      ))}
      <AmpKnobBarrel />
      <AmpKnobSurface />
      <AmpKnobMark value={clampedValue} />
    </AmpKnob>
  );
};

export default AmpDial;
