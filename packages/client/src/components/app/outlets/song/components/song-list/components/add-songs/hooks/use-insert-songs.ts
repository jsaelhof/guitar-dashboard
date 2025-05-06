import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../../../../utils/post";
import { InsertSongResult, SearchSongResult } from "guitar-dashboard-types";

type InsertSongsResponse = {
  data: Array<InsertSongResult>;
};

export type InsertSongsAction = {
  type: "insert-songs";
  files: SearchSongResult[];
};

export const useInsertSongs = () => {
  const navigate = useNavigate();

  const [result, dispatch, isPending] = useActionState<
    InsertSongsResponse["data"] | undefined,
    InsertSongsAction
  >(async (prevState, { type, ...body }) => {
    const response = await post(`/songs/insert-songs`, JSON.stringify(body));

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    const { data } = (await response.json()) as InsertSongsResponse;
    return data;
  }, undefined);

  return { result, dispatch, isPending };
};
