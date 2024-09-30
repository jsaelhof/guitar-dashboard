import { Layout } from "./AddRiff.styles";
import { useAppContext } from "../../../../context/AppContext";
import RiffForm, { RiffFormProps } from "../riff-form/RiffForm";
import TablatureEmptyState from "./components/tablature-empty-state/TablatureEmptyState";
import { useState } from "react";

export type AddRiffProps = Pick<RiffFormProps, "mode">;

const AddRiff = ({ mode }: AddRiffProps) => {
  const { song } = useAppContext();

  const [showRiffForm, setShowRiffForm] = useState(false);

  return song ? (
    <Layout>
      {showRiffForm ? (
        <RiffForm mode={mode} requireOneRiff />
      ) : (
        <TablatureEmptyState onClick={setShowRiffForm} />
      )}
    </Layout>
  ) : null;
};

export default AddRiff;
