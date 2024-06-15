import { AmpKnob, AmpKnobBarrel } from "./SwitchButton.styles";

const SwitchButton = ({
  on,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { on: boolean }) => {
  return (
    <AmpKnob {...props}>
      <AmpKnobBarrel $on={on} />
    </AmpKnob>
  );
};

export default SwitchButton;
