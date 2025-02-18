import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../../../../utils/post";
import { SearchSongResult } from "guitar-dashboard-types";

type InsertSongsResponse = {
  data: Array<{ path: string; success: boolean }>;
};

export type InsertSongsAction =
  | {
      type: "insert-songs";
      files: SearchSongResult[];
    }
  | { type: "reset" };

export const useInsertSongs = () => {
  const navigate = useNavigate();

  const [result, dispatch, isPending] = useActionState<
    InsertSongsResponse["data"] | undefined,
    InsertSongsAction
  >(async (prevState, { type, ...body }) => {
    if (type === "reset") return undefined;

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
