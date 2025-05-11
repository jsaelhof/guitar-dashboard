import { Song } from "guitar-dashboard-types";

export type PDFProps = {
  pdf: Song["pdf"];
};

const PDF = ({ pdf }: PDFProps) => {
  // FIXME: Look at PDF.js as a better solution
  // Display any PDF. This is typically used for non-pro tabs (old style ascii) as any easier option than cropping images.
  return pdf ? (
    <embed
      src={`${import.meta.env.VITE_SERVER_URL}/${pdf}#toolbar=1&navpanes=0`}
      width="100%"
      height="100%"
      type="application/pdf"
      style={{
        flexGrow: 1,
      }}
    />
  ) : null;
};

export default PDF;
