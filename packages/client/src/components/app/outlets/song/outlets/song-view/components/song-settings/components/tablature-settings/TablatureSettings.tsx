import {
  ArrowCircleDown,
  ArrowCircleUp,
  Check,
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
    action: Extract<
      SongAction,
      { type: "ordertablature" | "updatetablature" | "deletetablature" }
    >,
  ) => void;
};

export const TablatureSettings = ({
  tablature,
  dispatchSong,
}: TablatureSettingsProps) => {
  const [editedTablatureData, setEditedTablatureData] =
    useState<Omit<Extract<SongAction, { type: "updatetablature" }>, "type">>();

  const onTablatureOrderChange = useCallback(
    (id: string, order: number) => {
      dispatchSong({
        type: "ordertablature",
        id,
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

  const [deleteTablature, setDeleteTablature] =
    useState<Pick<Tablature, "id" | "label">>();
  const onCancelDelete = useCallback(() => setDeleteTablature(undefined), []);
  const onConfirmDelete = useCallback(() => {
    if (deleteTablature) {
      dispatchSong({
        type: "deletetablature",
        id: deleteTablature.id,
      });
      setDeleteTablature(undefined);
    }
  }, [deleteTablature, dispatchSong]);

  return (
    <>
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
            gridTemplateColumns: "1fr 100px auto max-content auto",
            alignItems: "center",
            borderRadius: 1,
            border: "1px solid",
            borderColor: ({ palette }) => palette.divider,
            rowGap: 2,
            columnGap: 1,
            p: 1,
          }}
        >
          <Typography variant="caption" color="textDisabled">
            Name
          </Typography>
          <Typography variant="caption" color="textDisabled">
            Tuning
          </Typography>
          <Typography
            variant="caption"
            color="textDisabled"
            sx={{ gridColumn: "3 / -1", textAlign: "center" }}
          >
            Actions
          </Typography>

          {(tablature ?? []).map(({ id, label, tuning }, i, arr) => {
            const isEditing = editedTablatureData?.id === id;

            return (
              <Fragment key={id}>
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
                      displayEmpty
                      value={editedTablatureData.tuning}
                      label="Tuning"
                      size="small"
                      renderValue={(val) => TUNINGS[val ?? Tuning.E]}
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
                    {TUNINGS[tuning ?? Tuning.E]}
                  </Typography>
                )}

                {!isEditing && (
                  <IconButton
                    size="small"
                    onClick={() =>
                      setEditedTablatureData({ id, label, tuning })
                    }
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                )}

                {isEditing && (
                  <IconButton size="small" onClick={onTablatureEdit}>
                    <Check fontSize="small" />
                  </IconButton>
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

                <IconButton
                  size="small"
                  onClick={() => setDeleteTablature({ id, label })}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Fragment>
            );
          })}
        </Stack>
      </Stack>

      <Dialog maxWidth="xs" open={!!deleteTablature}>
        <DialogContent dividers>
          {`Are you sure you want to delete "${deleteTablature?.label}"`}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onCancelDelete}>
            Cancel
          </Button>
          <Button onClick={onConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
