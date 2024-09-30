import { useActionState, useEffect } from "react";
import { Tab } from "../../types";

type FetchTabResponse = { data: { tab: Tab[] } };

export const useTab = (songId: string) => {
  const [{ tab }, dispatch, isPending] = useActionState<
    {
      tab: Tab[];
    },
    | {
        type: "get";
      }
    | {
        type: "add";
        id: string;
        label: string;
        labelDesc?: string;
        uri: string[];
      }
  >(
    async (_, { type, ...body }) => {
      const response = await fetch(
        `http://localhost:8001/tab/${songId}${
          type !== "get" ? `/${type}` : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          ...(type !== "get" && {
            method: "POST",
            body: JSON.stringify(body),
          }),
        }
      );
      const {
        data: { tab },
      } = (await response.json()) as FetchTabResponse;

      return {
        tab,
      };
    },
    {
      tab: [],
    }
  );

  useEffect(() => dispatch({ type: "get" }), [songId]);

  return { tab, dispatch, isPending };
};
