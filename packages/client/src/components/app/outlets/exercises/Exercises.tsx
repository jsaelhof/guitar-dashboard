import { Outlet, useParams } from "react-router-dom";
import ExerciseMenu from "./components/exercise-menu/ExerciseMenu";
import { LeftColumn, Layout } from "./Exercises.styles";

export const Exercises = () => {
  const { exerciseId } = useParams();

  return (
    <Layout>
      <LeftColumn>
        <ExerciseMenu />
      </LeftColumn>
      <Outlet key={exerciseId} />
    </Layout>
  );
};
