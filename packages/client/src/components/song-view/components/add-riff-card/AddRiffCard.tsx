import { useRef } from "react";
import { Layout } from "./AddRiffCard.styles";
import { useAppContext } from "../../../../context/AppContext";
import RiffForm, { RiffFormProps } from "../riff-form/RiffForm";

export type AddRifCardProps = Pick<RiffFormProps, "mode">;

const AddRiffCard = ({ mode }: AddRifCardProps) => {
  const { song } = useAppContext();

  const scrollRef = useRef<HTMLDivElement>(null);

  return song ? (
    <Layout>
      <RiffForm
        mode={mode}
        onChange={(count: number) => {
          count > 0 &&
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <div ref={scrollRef} />
    </Layout>
  ) : null;
};

export default AddRiffCard;
