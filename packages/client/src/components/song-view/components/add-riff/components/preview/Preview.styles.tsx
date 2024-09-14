import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";

export const PreviewTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)({
  [`& .${tooltipClasses.tooltip}`]: {
    background: "unset",
    margin: 0,
    padding: 0,
    color: "black",
    maxWidth: 824, // Image width + left/right paddings
  },
});
