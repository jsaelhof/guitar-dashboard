import { UriTablature } from "./UG2.styles";

export type UG2Props = {
  uri: string[];
};

export const UG2 = ({ uri }: UG2Props) => (
  <div>
    {uri.map((imageUri, i) => (
      <div key={i}>
        <UriTablature src={imageUri} />
      </div>
    ))}
  </div>
);
