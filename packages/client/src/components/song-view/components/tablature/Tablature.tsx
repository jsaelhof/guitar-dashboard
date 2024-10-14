import { Typography } from "@mui/material";
import { Song } from "../../../../types";
import { UriTablature } from "./Tablature.styles";

export type TablatureProps = {
  tablature: NonNullable<Song["tablature"]>[number];
};

const Tablature = ({ tablature: { tuning, uri } }: TablatureProps) => (
  <div>
    {uri ? (
      <div>
        {tuning && tuning !== "E" && (
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
