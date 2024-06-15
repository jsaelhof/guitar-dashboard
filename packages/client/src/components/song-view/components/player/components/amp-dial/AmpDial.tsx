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
  divisions?: "5" | "10"; // Divide the dial into 5% slices or 10% slices
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
  divisions = "10",
  displayValues = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
}: AmpDialProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 1);

  return (
    <AmpKnob>
      {displayValues.map((value, i) =>
        // If divisions is 10 then don't show any 5% division marks on the dial.
        divisions === "10" && i % 2 === 1 ? null : (
          <AmpNumbers
            key={i}
            value={i / 20}
            tick={value == null}
            on={(i * (0.05 * 10)) / 10 <= clampedValue} // i values are 0 - 20, so multiply by 5% to convert to a 0-1 range.
          >
            {value == null ? "-" : percent ? value * 10 : value}
          </AmpNumbers>
        )
      )}
      <AmpKnobBarrel />
      {/* <AmpKnobSurface /> */}
      <AmpKnobMark value={clampedValue} />
    </AmpKnob>
  );
};

export default AmpDial;
