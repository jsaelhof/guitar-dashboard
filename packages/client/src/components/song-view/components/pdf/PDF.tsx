import { Song } from "guitar-dashboard-types";

export type PDFProps = {
  pdf: Song["pdf"];
};

const PDF = ({ pdf }: PDFProps) => {
  // FIXME: Look at PDF.js as a better solution
  // Display any PDF. This is typically used for non-pro tabs (old style ascii) as any easier option than cropping images.
  return pdf ? (
    <embed
      src={`http://localhost:8001/${song.pdf}`}
      width="100%"
      type="application/pdf"
      style={{
        flexGrow: 1,
      }}
    />
  ) : null;
};

export default PDF;
