import { useActionState, useEffect } from "react";
import { Exercise } from "guitar-dashboard-types";
import { useNavigate } from "react-router-dom";
import { get } from "../../../../../utils/get";

type FetchExercisesResponse = {
  data: { exercises: Exercise[] };
};

export type ExercisesAction = { type: "get" };

export const useExercises = () => {
  const navigate = useNavigate();

  const [{ exercises }, dispatch, isPending] = useActionState<
    {
      exercises: Exercise[];
    },
    ExercisesAction
  >(
    async (prevState, { type, ...body }) => {
      const response = await get("/exercises");

      if (response.status === 401) {
        navigate("/login");
        return {
          exercises: [],
        };
      }

      const { data } = (await response.json()) as FetchExercisesResponse;

      return data;
    },
    {
      exercises: [],
    }
  );

  useEffect(() => dispatch({ type: "get" }), []);

  return { exercises, dispatch };
};
