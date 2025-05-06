import { AmpKnob, AmpKnobBarrel } from "./SwitchButton.styles";

const SwitchButton = ({
  on,
  size = "large",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  on: boolean;
  size?: "small" | "large";
}) => {
  return (
    <AmpKnob {...props} $size={size}>
      <AmpKnobBarrel $on={on} />
    </AmpKnob>
  );
};

export default SwitchButton;
