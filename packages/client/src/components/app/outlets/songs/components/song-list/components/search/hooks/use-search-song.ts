import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../../../../utils/post";

type SearchSongResponse = {
  data: { files: string[] };
};

export type SearchSongAction = {
  type: "search-song";
  search: string;
  artist: string;
};

export const useSearchSong = () => {
  const navigate = useNavigate();

  const [result, dispatch, isPending] = useActionState<
    SearchSongResponse["data"] | undefined,
    SearchSongAction
  >(async (prevState, { type, ...body }) => {
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
