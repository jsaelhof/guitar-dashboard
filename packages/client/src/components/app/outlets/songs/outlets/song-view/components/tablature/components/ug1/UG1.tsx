import { UriTablature } from "./UG1.styles";

export type UG1Props = {
  uri: string[];
};

export const UG1 = ({ uri }: UG1Props) => (
  <div>
    {uri.map((imageUri, i) => (
      <div key={i}>
        <UriTablature src={imageUri} />
      </div>
    ))}
  </div>
);
