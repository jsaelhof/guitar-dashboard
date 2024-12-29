import { useActionState, useEffect } from "react";
import { Exercise } from "guitar-dashboard-types";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../../utils/post";
import { get } from "../../../../../utils/get";
import { debounce } from "@mui/material";
import deepmerge from "deepmerge";

type FetchExerciseResponse = {
  data: { exercise: Exercise };
};

export type ExerciseAction = { type: "get" } | { type: "speed"; speed: number };

export const useExercise = (exerciseId: string) => {
  const navigate = useNavigate();

  const [exercise, dispatch, isPending] = useActionState<
    Exercise | undefined,
    ExerciseAction
  >(async (currentState, { type, ...body }) => {
    const response =
      type === "get"
        ? await get(`/exercise/${exerciseId}`)
        : await post(`/exercise/${exerciseId}/${type}`, JSON.stringify(body));

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    const { data } = (await response.json()) as FetchExerciseResponse;

    // Return the current state, overlayed with the newest data.
    // I'm doing this because the exercise data is an aggregate from several collections and when updating data, I'm not returning the full aggregate.
    return currentState?.id === data.exercise.id
      ? deepmerge(currentState, data.exercise, {
          // This tells deepmerge how to merge two arrays. Currently, I'm always overwriting the old array (i.e. the loops etc) with the new one.
          arrayMerge: (target, source, options) => source,
        })
      : data.exercise;
  }, undefined);

  useEffect(() => {
    dispatch({ type: "get" });
  }, [exerciseId]);

  return { exercise, dispatch: debounce(dispatch), isPending };
};
