import { Layout } from "./AddTablature.styles";
import RiffForm, { RiffFormProps } from "../riff-form/RiffForm";
import TablatureEmptyState from "./components/tablature-empty-state/TablatureEmptyState";
import { useState } from "react";
import { Song } from "guitar-dashboard-types";

export type AddTablatureProps = Pick<
  RiffFormProps,
  "mode" | "dispatchSong" | "songIsPending"
> & { song: Song };

const AddTablature = ({ song, ...props }: AddTablatureProps) => {
  const [showRiffForm, setShowRiffForm] = useState(false);

  return (
    <Layout>
      {showRiffForm ? (
        <RiffForm {...props} requireOneRiff />
      ) : (
        <TablatureEmptyState onClick={setShowRiffForm} song={song} />
      )}
    </Layout>
  );
};

export default AddTablature;
