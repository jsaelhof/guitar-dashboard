import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Tablature as TablatureType, Tuning } from "guitar-dashboard-types";
import { TUNINGS } from "../../../../../../contstants";
import { UG1 } from "./components/ug1/UG1";
import { UG2 } from "./components/ug2/UG2";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { ZoomControls } from "./Tablature.styles";

export type TablatureProps = {
  songId: string;
  tablature: TablatureType;
};

const Tablature = ({
  songId,
  tablature: { id: tabId, tuning, images, format },
}: TablatureProps) => {
  const [zoom, setZoom] = useState(100);

  const decreaseZoom = useCallback(() => {
    zoom > 50 && setZoom(zoom - 10);
  }, [zoom]);

  const increaseZoom = useCallback(() => {
    zoom < 150 && setZoom(zoom + 10);
  }, [zoom]);

  const assetBasePath = useMemo(
    () => `${import.meta.env.VITE_SERVER_URL}/${songId}/tab/${tabId}`,
    [songId, tabId]
  );

  return (
    <div>
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          position="sticky"
          top="0"
          left="0"
          zIndex="1000"
          margin="-16px"
          px={2}
          pb={2}
          sx={{ background: ({ palette }) => palette.darkGrey[860] }}
        >
          <Stack direction="row" alignItems="baseline" gap={1}>
            {tuning && tuning !== Tuning.E && (
              <>
                <Typography variant="subtitle2">Tuning:</Typography>
                <Typography variant="system">{TUNINGS[tuning]}</Typography>
              </>
            )}
          </Stack>

          <ZoomControls>
            <IconButton size="xsmall" onClick={decreaseZoom}>
              <RemoveCircleOutline />
            </IconButton>
            <div>{zoom}%</div>
            <IconButton size="xsmall" onClick={increaseZoom}>
              <AddCircleOutline />
            </IconButton>
          </ZoomControls>
        </Box>

        <Box sx={{ pt: 6, pb: 1 }}>
          {format === "ug1" && (
            <UG1 assetBasePath={assetBasePath} images={images} zoom={zoom} />
          )}
          {format === "ug2" && (
            <UG2 assetBasePath={assetBasePath} images={images} zoom={zoom} />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Tablature;
