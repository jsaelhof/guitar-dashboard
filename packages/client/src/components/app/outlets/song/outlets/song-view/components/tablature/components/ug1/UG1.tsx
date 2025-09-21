import { UriTablature } from "./UG1.styles";

export type UG1Props = {
  assetBasePath: string;
  images: number;
  zoom: number;
};

export const UG1 = ({ assetBasePath, images, zoom }: UG1Props) => (
  <div>
    {Array.from({ length: images }, (_, i) => (
      <div key={i}>
        <UriTablature
          src={`${assetBasePath}/${i}.png`}
          style={{ width: `${800 * (zoom / 100)}px` }}
        />
      </div>
    ))}
  </div>
);
