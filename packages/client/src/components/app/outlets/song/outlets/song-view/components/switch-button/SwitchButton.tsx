import { SwitchLayout, SwitchBase } from "./SwitchButton.styles";

const SwitchButton = ({
  on,
  size = "large",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  on: boolean;
  size?: "small" | "large";
}) => {
  return (
    <SwitchLayout {...props} $size={size}>
      <SwitchBase $on={on} />
    </SwitchLayout>
  );
};

export default SwitchButton;
