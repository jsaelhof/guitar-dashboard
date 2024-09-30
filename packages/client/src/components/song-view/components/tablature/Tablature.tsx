import { Tab } from "../../../../types";
import { UriTablature } from "./Tablature.styles";

export type TablatureProps = {
  uris: Tab["uri"];
};

const Tablature = ({ uris }: TablatureProps) => (
  <div>
    {uris
      ? uris.map((imageUri, i) => <UriTablature key={i} src={imageUri} />)
      : "No tab found"}
  </div>
);

export default Tablature;
