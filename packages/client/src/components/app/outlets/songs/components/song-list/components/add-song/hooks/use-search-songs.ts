import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../../../../utils/post";

type SearchSongsResponse = {
  data: { files: string[] };
};

export type SearchSongsAction = {
  type: "search-songs";
  names: string[];
  hint: string;
};

export const useSearchSongs = () => {
  const navigate = useNavigate();

  const [result, dispatch, isPending] = useActionState<
    SearchSongsResponse["data"] | undefined,
    SearchSongsAction
  >(async (prevState, { type, ...body }) => {
    const response = await post(`/search-songs`, JSON.stringify(body));

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    const { data } = (await response.json()) as SearchSongsResponse;
    return data;
  }, undefined);

  return { result, dispatch, isPending };
};
