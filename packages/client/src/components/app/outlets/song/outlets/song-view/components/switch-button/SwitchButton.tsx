import { SwitchLayout, SwitchBase } from "./SwitchButton.styles";

const SwitchButton = ({
  on,
  size = "large",
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  on: boolean;
  size?: "small" | "large";
  disabled?: boolean;
}) => {
  return (
    <SwitchLayout {...props} $disabled={disabled} $size={size}>
      <SwitchBase $on={on} />
    </SwitchLayout>
  );
};

export default SwitchButton;
