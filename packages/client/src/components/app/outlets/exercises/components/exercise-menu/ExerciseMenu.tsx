import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MusicNote } from "@mui/icons-material";
import { useExercises } from "./hooks/use-exercises";
import { useCallback, useMemo } from "react";

const ExerciseMenu = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const { exercises, dispatch } = useExercises();

  const exerciseIndex = useMemo(
    () => exercises.findIndex(({ id }) => id === exerciseId),
    [exerciseId, exercises]
  );

  const onPrev = useCallback(
    () => navigate(exercises[exerciseIndex - 1].id),
    [exercises, exerciseIndex]
  );

  const onNext = useCallback(
    () => navigate(exercises[exerciseIndex + 1].id),
    [exercises, exerciseIndex]
  );

  return (
    <>
      <List dense>
        <ListItem sx={{ p: 0, width: 1 }}>
          <ListItemButton
            sx={{ color: "primary.main" }}
            onClick={() => {
              navigate("/song");
            }}
          >
            <ListItemIcon>
              <MusicNote />
            </ListItemIcon>
            <ListItemText primary="Songs" />
          </ListItemButton>
        </ListItem>

        <Divider variant="middle" sx={{ my: 2 }} />

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Button
            startIcon={<ArrowLeft />}
            variant="contained"
            color="blueLights"
            disabled={exercises.at(0)?.id === exerciseId}
            onClick={onPrev}
          >
            Prev
          </Button>
          <Button
            endIcon={<ArrowRight />}
            variant="contained"
            color="blueLights"
            disabled={exercises.at(-1)?.id === exerciseId}
            onClick={onNext}
          >
            Next
          </Button>
        </div>

        <Divider variant="middle" sx={{ my: 2 }} />

        {exercises.map(({ id, title }) => (
          <ListItem key={id} sx={{ p: 0 }}>
            <ListItemButton
              sx={{ py: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/exercise/${id}`);
              }}
              selected={id === exerciseId}
            >
              <ListItemText
                primary={title}
                primaryTypographyProps={{
                  fontSize: 12,
                }}
                sx={{ pl: 1 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ExerciseMenu;
