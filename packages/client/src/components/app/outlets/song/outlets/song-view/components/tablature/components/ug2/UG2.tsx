import { UriTablature } from "./UG2.styles";

export type UG2Props = {
  assetBasePath: string;
  images: number;
  zoom: number;
};

export const UG2 = ({ assetBasePath, images, zoom }: UG2Props) => (
  <div>
    {Array.from({ length: images }, (_, i) => (
      <div key={i}>
        <UriTablature
          src={`${assetBasePath}/${i}.png`}
          style={{ width: `${1200 * (zoom / 100)}px` }}
        />
      </div>
    ))}
  </div>
);
