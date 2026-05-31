import {
  ArrowCircleDown,
  ArrowCircleUp,
  Check,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Song, Tablature, Tuning } from "guitar-dashboard-types";
import { Fragment, useCallback, useState } from "react";
import { SongAction } from "../../../../hooks/use-song";
import { TUNINGS } from "../../../../../../../../contstants";

export type TablatureSettingsProps = {
  tablature: Song["tablature"];
  dispatchSong: (
    action: Extract<SongAction, { type: "ordertablature" | "updatetablature" }>,
  ) => void;
};

export const TablatureSettings = ({
  tablature,
  dispatchSong,
}: TablatureSettingsProps) => {
  const [editedTablatureData, setEditedTablatureData] =
    useState<Omit<Extract<SongAction, { type: "updatetablature" }>, "type">>();

  const onTablatureOrderChange = useCallback(
    (tablatureId: string, order: number) => {
      dispatchSong({
        type: "ordertablature",
        tablatureId,
        order,
      });
    },
    [],
  );

  const onTablatureEdit = useCallback(() => {
    if (editedTablatureData) {
      dispatchSong({
        type: "updatetablature",
        ...editedTablatureData,
      });

      setEditedTablatureData(undefined);
    }
  }, [editedTablatureData]);

  return (
    <Stack gap={1}>
      <Typography color="primary" fontWeight="bold">
        Tablature
      </Typography>

      {(tablature ?? []).length === 0 && (
        <FormHelperText>No tablature</FormHelperText>
      )}

      <Stack
        sx={{
          width: "fit-content",
          minWidth: 400,
          display: "grid",
          gridTemplateColumns: "auto 1fr 100px max-content",
          alignItems: "center",
          borderRadius: 1,
          border: "1px solid",
          borderColor: ({ palette }) => palette.divider,
          rowGap: 2,
          columnGap: 1,
          p: 1,
        }}
      >
        {(tablature ?? []).map(({ id, label, tuning }, i, arr) => {
          const isEditing = editedTablatureData?.id === id;

          return (
            <Fragment key={id}>
              {!isEditing && (
                <IconButton
                  size="small"
                  onClick={() => setEditedTablatureData({ id, label, tuning })}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}

              {isEditing && (
                <IconButton size="small" onClick={onTablatureEdit}>
                  <Check fontSize="small" />
                </IconButton>
              )}

              <Stack
                sx={{
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                {isEditing ? (
                  <TextField
                    value={editedTablatureData.label}
                    size="small"
                    onChange={({ target }) =>
                      setEditedTablatureData((prev) => {
                        if (prev) {
                          return {
                            ...prev,
                            label: target.value,
                          };
                        }
                      })
                    }
                  />
                ) : (
                  <Typography variant="body2">{label}</Typography>
                )}
              </Stack>

              {isEditing ? (
                <FormControl fullWidth>
                  <Select
                    // id="demo-simple-select"
                    displayEmpty
                    value={editedTablatureData.tuning}
                    label="Tuning"
                    size="small"
                    renderValue={(val) => (val ? TUNINGS[val] : "-")}
                    onChange={({ target }) => {
                      setEditedTablatureData((prev) => {
                        if (prev)
                          return {
                            ...prev,
                            tuning: target.value as Tuning,
                          };
                      });
                    }}
                  >
                    {Object.keys(TUNINGS).map((val) => (
                      <MenuItem key={val} value={val}>
                        {TUNINGS[val as keyof typeof TUNINGS]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography variant="body2">
                  {tuning ? TUNINGS[tuning] : "-"}
                </Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {i > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => onTablatureOrderChange(id, i - 1)}
                  >
                    <ArrowCircleUp />
                  </IconButton>
                )}

                {i < arr.length - 1 && (
                  <IconButton
                    size="small"
                    onClick={() => onTablatureOrderChange(id, i + 1)}
                  >
                    <ArrowCircleDown />
                  </IconButton>
                )}
              </Box>
            </Fragment>
          );
        })}
      </Stack>
    </Stack>
  );
};
