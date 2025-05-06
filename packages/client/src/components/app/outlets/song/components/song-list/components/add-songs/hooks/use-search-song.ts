import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../../../../utils/post";
import { SearchSongResults } from "guitar-dashboard-types";

type SearchSongResponse = {
  data: SearchSongResults;
};

export type SearchSongAction =
  | {
      type: "search-song";
      search: string;
      artist: string;
      variousArtists?: boolean;
    }
  | {
      type: "reset";
    };

export const useSearchSong = () => {
  const navigate = useNavigate();

  const [result, dispatch, isPending] = useActionState<
    SearchSongResponse["data"] | undefined,
    SearchSongAction
  >(async (prevState, { type, ...body }) => {
    if (type === "reset") return undefined;

    const response = await post(`/search-song`, JSON.stringify(body));

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    const { data } = (await response.json()) as SearchSongResponse;
    return data;
  }, undefined);

  return { result, dispatch, isPending };
};
