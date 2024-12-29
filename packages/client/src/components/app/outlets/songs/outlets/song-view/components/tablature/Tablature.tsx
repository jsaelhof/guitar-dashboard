import { Typography } from "@mui/material";
import { Tablature as TablatureType, Tuning } from "guitar-dashboard-types";
import { TUNINGS } from "../../../../../../contstants";
import { UG1 } from "./components/ug1/UG1";
import { UG2 } from "./components/ug2/UG2";

export type TablatureProps = {
  tablature: TablatureType;
};

const Tablature = ({ tablature: { tuning, uri, format } }: TablatureProps) => (
  <div>
    {uri ? (
      <div>
        {tuning && tuning !== Tuning.E && (
          <Typography variant="subtitle2">
            Tuning:{" "}
            <span style={{ fontFamily: "system-ui" }}>{TUNINGS[tuning]}</span>
          </Typography>
        )}
        <>
          {format === "ug1" && <UG1 uri={uri} />}
          {format === "ug2" && <UG2 uri={uri} />}
        </>
      </div>
    ) : (
      "No tab found"
    )}
  </div>
);

export default Tablature;
