import { Button } from "@mui/material";
import { Layout } from "./TablatureEmptyState.styles";

export type TablatureEmptyStateProps = {
  onClick: (val: boolean) => void;
};

const TablatureEmptyState = ({ onClick }: TablatureEmptyStateProps) => (
  <Layout>
    <div
      style={{
        opacity: 0.2,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <img src="/music.png" height="100px" />
    </div>
    <Button variant="contained" color="primary" onClick={() => onClick(true)}>
      Add Tablature
    </Button>
  </Layout>
);

export default TablatureEmptyState;
