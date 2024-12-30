import { IconButton, Typography } from "@mui/material";
import { Tablature as TablatureType, Tuning } from "guitar-dashboard-types";
import { TUNINGS } from "../../../../../../contstants";
import { UG1 } from "./components/ug1/UG1";
import { UG2 } from "./components/ug2/UG2";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { ZoomControls } from "./Tablature.styles";

export type TablatureProps = {
  tablature: TablatureType;
};

const Tablature = ({ tablature: { tuning, uri, format } }: TablatureProps) => {
  const [zoom, setZoom] = useState(100);

  const decreaseZoom = useCallback(() => {
    zoom > 50 && setZoom(zoom - 10);
  }, [zoom]);

  const increaseZoom = useCallback(() => {
    zoom < 150 && setZoom(zoom + 10);
  }, [zoom]);

  return (
    <div>
      {uri ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {tuning && tuning !== Tuning.E ? (
              <Typography variant="subtitle2">
                Tuning:{" "}
                <span style={{ fontFamily: "system-ui" }}>
                  {TUNINGS[tuning]}
                </span>
              </Typography>
            ) : (
              <div />
            )}

            <ZoomControls>
              <IconButton size="xsmall" onClick={decreaseZoom}>
                <RemoveCircleOutline />
              </IconButton>
              <div>{zoom}%</div>
              <IconButton size="xsmall" onClick={increaseZoom}>
                <AddCircleOutline />
              </IconButton>
            </ZoomControls>
          </div>
          <>
            {format === "ug1" && <UG1 uri={uri} zoom={zoom} />}
            {format === "ug2" && <UG2 uri={uri} zoom={zoom} />}
          </>
        </div>
      ) : (
        "No tab found"
      )}
    </div>
  );
};

export default Tablature;
