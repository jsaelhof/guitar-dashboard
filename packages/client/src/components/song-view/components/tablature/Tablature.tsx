import { Typography } from "@mui/material";
import { UriTablature } from "./Tablature.styles";
import { Tablature as TablatureType, Tuning } from "guitar-dashboard-types";

export type TablatureProps = {
  tablature: TablatureType;
};

const Tablature = ({ tablature: { tuning, uri } }: TablatureProps) => (
  <div>
    {uri ? (
      <div>
        {tuning && tuning !== Tuning.E && (
          <Typography variant="subtitle2">
            Tuning: <span style={{ fontFamily: "system-ui" }}>{tuning}</span>
          </Typography>
        )}
        <div>
          {uri.map((imageUri, i) => (
            <UriTablature key={i} src={imageUri} />
          ))}
        </div>
      </div>
    ) : (
      "No tab found"
    )}
  </div>
);

export default Tablature;
