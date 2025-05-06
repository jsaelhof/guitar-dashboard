import { Button } from "@mui/material";
import { Layout } from "./TablatureEmptyState.styles";
import { Add, Search } from "@mui/icons-material";
import { searchTab } from "../../../../utils/search-tab";
import { Song } from "guitar-dashboard-types";

export type TablatureEmptyStateProps = {
  song: Song;
  onClick: (val: boolean) => void;
};

const TablatureEmptyState = ({ song, onClick }: TablatureEmptyStateProps) => (
  <Layout>
    <Button
      variant="contained"
      color="primary"
      startIcon={<Search />}
      onClick={() => {
        searchTab(song);
      }}
    >
      Search Tablature
    </Button>

    <Button
      variant="outlined"
      color="primary"
      sx={{ px: 1, minWidth: 0 }}
      onClick={() => onClick(true)}
    >
      <Add />
    </Button>
  </Layout>
);

export default TablatureEmptyState;
