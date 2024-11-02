import { Layout } from "./AddRiff.styles";
import RiffForm, { RiffFormProps } from "../riff-form/RiffForm";
import TablatureEmptyState from "./components/tablature-empty-state/TablatureEmptyState";
import { useState } from "react";

export type AddRiffProps = Pick<
  RiffFormProps,
  "mode" | "dispatchSong" | "songIsPending"
>;

const AddRiff = (props: AddRiffProps) => {
  const [showRiffForm, setShowRiffForm] = useState(false);

  return (
    <Layout>
      {showRiffForm ? (
        <RiffForm {...props} requireOneRiff />
      ) : (
        <TablatureEmptyState onClick={setShowRiffForm} />
      )}
    </Layout>
  );
};

export default AddRiff;
