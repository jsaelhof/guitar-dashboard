export type ZoomPreviewProps = {
  url: string;
};

const ZoomPreview = ({ url }: ZoomPreviewProps) => (
  <div
    style={{
      background: "white",
      border: "1px solid lightgrey",
      borderRadius: 8,
      padding: "0 12px",
      boxShadow:
        "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    }}
  >
    <img src={url} width="800" />
  </div>
);

export default ZoomPreview;
