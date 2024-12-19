import { Typography } from "@mui/material";
import { UriTablature } from "./components/ug1/UG1.styles";
import { Tablature as TablatureType, Tuning } from "guitar-dashboard-types";
import { TUNINGS } from "../../../../contstants";
import { useEffect, useMemo, useState } from "react";
import { UG1 } from "./components/ug1/UG1";
import { UG2 } from "./components/ug2/UG2";

export type TablatureProps = {
  tablature: TablatureType;
};

const Tablature = ({ tablature: { tuning, uri } }: TablatureProps) => {
  const [tabFormat, setTabFormat] = useState<"ug1" | "ug2">();

  // Based on the width of the image in the data uri, I can tell if its the old format or the latest format from Ultimate Guitar.
  useEffect(() => {
    const getImageWidth = async (uri: string) => {
      const width = await new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img.width);
        img.onerror = reject;
        img.src = uri;
      });

      switch (width) {
        case 814:
          setTabFormat("ug1");
          break;
        case 1628:
          setTabFormat("ug2");
          break;
      }
    };

    uri && getImageWidth(uri[0]);
  }, [uri]);

  return (
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
            {tabFormat === "ug1" && <UG1 uri={uri} />}
            {tabFormat === "ug2" && <UG2 uri={uri} />}
          </>
        </div>
      ) : (
        "No tab found"
      )}
    </div>
  );
};

export default Tablature;
