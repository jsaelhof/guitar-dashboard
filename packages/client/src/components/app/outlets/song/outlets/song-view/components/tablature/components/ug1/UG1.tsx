import { UriTablature } from "./UG1.styles";

export type UG1Props = {
  uri: string[];
  zoom: number;
};

export const UG1 = ({ uri, zoom }: UG1Props) => (
  <div>
    {uri.map((imageUri, i) => (
      <div key={i}>
        <UriTablature
          src={imageUri}
          style={{ width: `${800 * (zoom / 100)}px` }}
        />
      </div>
    ))}
  </div>
);
