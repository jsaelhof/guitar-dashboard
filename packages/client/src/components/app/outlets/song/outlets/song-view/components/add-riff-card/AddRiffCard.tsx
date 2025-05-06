import { useRef } from "react";
import { Layout } from "./AddRiffCard.styles";
import RiffForm, { RiffFormProps } from "../riff-form/RiffForm";

export type AddRifCardProps = Pick<
  RiffFormProps,
  "mode" | "dispatchSong" | "songIsPending"
>;

const AddRiffCard = (props: AddRifCardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Layout>
      <RiffForm
        {...props}
        onChange={(count: number) => {
          count > 0 &&
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <div ref={scrollRef} />
    </Layout>
  );
};

export default AddRiffCard;
