import { Button, Divider, IconButton, TextField } from "@mui/material";
import {
  ActionIconButton,
  Actions,
  Layout,
  LoopTrigger,
  LoopsPopover,
  Time,
} from "./LoopList.styles";
import { ArrowDropDown, Check, Close, Delete, Edit } from "@mui/icons-material";
import { formatSeconds } from "../../../../../../utils/format-seconds";
import { Fragment, MouseEvent, useCallback, useMemo, useState } from "react";
import { NEW_LOOP_ID } from "../../constants";
import { Loop } from "guitar-dashboard-types";

export type LoopListProps = {
  disabled: boolean;
  loops: Loop[];
  appliedLoop?: Omit<Loop, "id" | "label"> &
    Partial<Pick<Loop, "id" | "label">>;
  onSet: (loop: Loop) => void;
  onSave: (loop: Loop) => void;
  onDelete: (loop: Loop) => void;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
};

const LoopList = ({
  disabled,
  loops,
  appliedLoop,
  onSet,
  onSave,
  onDelete,
  onClear,
  onOpenChange,
}: LoopListProps) => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const loopItems = useMemo(
    () => [
      ...loops,
      // If there is an unsaved loop, insert so it can be named and saved.
      // A loop needs an id so we have to give it one temporarily.
      // Based on this id, I'll know whether to dispatch a create or update action onSave.
      ...(appliedLoop && !appliedLoop.id
        ? [
            {
              id: NEW_LOOP_ID,
              label: "New Loop",
              loopA: appliedLoop.loopA,
              loopB: appliedLoop.loopB,
            },
          ]
        : []),
    ],
    [loops, appliedLoop]
  );

  const onLoopListTrigger = useCallback(
    ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
      setAnchor(currentTarget);
      onOpenChange(true);
    },
    []
  );

  const onLoopListClose = () => {
    setAnchor(null);
    setEditedLoop(null);
    onOpenChange(false);
  };

  const [editedLoop, setEditedLoop] = useState<Loop | null>(null);

  const _onDelete = useCallback(
    (loop: Loop) => {
      // If the last loop is being deleted, close the panel.
      loopItems.length === 1 && onLoopListClose();
      onDelete(loop);
    },
    [loopItems]
  );

  const _onClear = useCallback(() => {
    // If the last loop is being cleared, close the panel.
    loopItems.length === 1 && onLoopListClose();
    onClear();
  }, [loopItems]);

  return (
    <>
      <IconButton
        size="small"
        color="blueLights"
        disabled={disabled}
        onClick={onLoopListTrigger}
      >
        <ArrowDropDown />
      </IconButton>

      <LoopsPopover
        open={!!anchor}
        anchorEl={anchor}
        onClose={onLoopListClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Layout>
          {loopItems.map((loop) => {
            const loopIsEditing = editedLoop && loop.id === editedLoop.id;
            const hasError = loopIsEditing && !editedLoop.label;
            const disabled = editedLoop || loop.id === NEW_LOOP_ID;

            return (
              <Fragment key={loop.id}>
                <LoopTrigger
                  disabled={editedLoop || loop.id === NEW_LOOP_ID}
                  onClick={() => !disabled && onSet(loop)}
                >
                  {loopIsEditing ? (
                    <TextField
                      variant="standard"
                      color={hasError ? "error" : "primary"}
                      type="text"
                      size="small"
                      margin="none"
                      required
                      autoFocus
                      defaultValue={loop.label}
                      onChange={({ currentTarget }) =>
                        setEditedLoop({
                          ...editedLoop,
                          label: currentTarget.value,
                        })
                      }
                      inputProps={{
                        style: {
                          color: "white",
                          padding: "2px 0",
                          fontSize: 14,
                        },
                      }}
                    />
                  ) : (
                    loop.label
                  )}
                </LoopTrigger>

                <LoopTrigger
                  disabled={editedLoop || loop.id === NEW_LOOP_ID}
                  onClick={() => !disabled && onSet(loop)}
                >
                  <Time
                    style={{
                      fontFamily: "monospace",
                    }}
                  >
                    {`${formatSeconds(
                      Math.round(loop.loopA)
                    )} - ${formatSeconds(Math.round(loop.loopB))}`}
                  </Time>
                </LoopTrigger>

                <Actions>
                  {loopIsEditing ? (
                    <>
                      <ActionIconButton
                        disabled={hasError}
                        onClick={() => {
                          onSave(editedLoop);
                          setEditedLoop(null);
                        }}
                      >
                        <Check fontSize="small" />
                      </ActionIconButton>
                      <ActionIconButton onClick={() => setEditedLoop(null)}>
                        <Close fontSize="small" />
                      </ActionIconButton>
                    </>
                  ) : (
                    <>
                      <ActionIconButton
                        onClick={() => setEditedLoop(structuredClone(loop))}
                      >
                        <Edit fontSize="small" />
                      </ActionIconButton>
                      <ActionIconButton onClick={() => _onDelete(loop)}>
                        <Delete fontSize="small" />
                      </ActionIconButton>
                    </>
                  )}
                </Actions>
              </Fragment>
            );
          })}
        </Layout>

        {appliedLoop && (
          <>
            <Divider
              style={{
                margin: "16px",
                borderColor: "rgba(255,255,255,0.5)",
              }}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                color="darkSecondary"
                onClick={_onClear}
                size="small"
                disabled={!appliedLoop}
              >
                Clear current loop
              </Button>
            </div>
          </>
        )}
      </LoopsPopover>
    </>
  );
};

export default LoopList;
