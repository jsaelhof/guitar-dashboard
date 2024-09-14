import { PreviewTooltip } from "./Preview.styles";
import ZoomPreview from "./components/zoom-preview/ZoomPreview";

export type PreviewProps = {
  url: string;
};

const Preview = ({ url }: PreviewProps) => (
  <PreviewTooltip title={<ZoomPreview url={url} />} placement="left">
    <img src={url} width="250" />
  </PreviewTooltip>
);

export default Preview;
