import { useCallback, useEffect, useState } from "react";
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
  divisions?: "20" | "10"; // Divide the dial into 5% slices or 10% slices
  onAdjustValue?: (newValue: number) => void;
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
  onAdjustValue,
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

  const [dragReference, setDragReference] = useState<number | null>(null);

  const onMove = useCallback(
    (e: MouseEvent) => {
      const delta = dragReference ? dragReference - e.pageY : 0;
      const factor = divisions === "20" ? 0.05 : 0.1;

      const relativePct = delta / 80; // 40 is an arbitrary number of pixels above and below the dragReference. It just creates an "distance" from the reference point to calculate a percentage. Adjusting it will adjust sensitivity.
      const newVal = Math.max(value + relativePct, factor); // If value is 0, the new value is always 0. In this case, the new value should just be forced to one "notch" on the dial.
      const clampedNewVal = Math.min(Math.max(newVal, 0), 1);
      const roundedNewVal = parseFloat(
        (Math.round(clampedNewVal / factor) * factor).toFixed(2)
      );

      console.log({ value, relativePct, newVal, clampedNewVal, roundedNewVal });
      onAdjustValue && onAdjustValue(roundedNewVal);
    },
    [dragReference]
  );

  const onUp = useCallback((e: MouseEvent) => {
    setDragReference(null);
  }, []);

  useEffect(() => {
    if (dragReference) {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    } else {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragReference]);

  return (
    <AmpKnob
      onMouseDown={(e: MouseEvent) => {
        e.preventDefault(); // Stops selection of elements
        onAdjustValue && setDragReference(e.pageY);
      }}
    >
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
