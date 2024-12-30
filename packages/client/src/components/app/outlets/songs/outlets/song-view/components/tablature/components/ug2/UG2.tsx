import { UriTablature } from "./UG2.styles";

export type UG2Props = {
  uri: string[];
  zoom: number;
};

export const UG2 = ({ uri, zoom }: UG2Props) => (
  <div>
    {uri.map((imageUri, i) => (
      <div key={i}>
        <UriTablature
          src={imageUri}
          style={{ width: `${1200 * (zoom / 100)}px` }}
        />
      </div>
    ))}
  </div>
);
