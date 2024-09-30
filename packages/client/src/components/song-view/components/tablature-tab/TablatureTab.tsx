import { QueueMusic } from "@mui/icons-material";
import { Tab, Tooltip } from "@mui/material";
import { Label } from "./TablatureTab.styles";

export type TablatureTabProps = {
  label: string;
};

const TablatureTab = ({ label, ...props }: TablatureTabProps) => (
  <Tab
    {...props}
    label={
      <Tooltip title={label} placement="right">
        <div>
          <QueueMusic />
          <Label>{label}</Label>
        </div>
      </Tooltip>
    }
  />
);

export default TablatureTab;
