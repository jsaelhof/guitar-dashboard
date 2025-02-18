import { Song } from "guitar-dashboard-types";
import jsmediatags from "jsmediatags";

export const getSongMetadata = async (path: string) =>
  await new Promise<
    Partial<Pick<Song, "album" | "year" | "cover" | "title" | "artist">>
  >((resolve) => {
    jsmediatags.read(path, {
      onSuccess: (tagData) => {
        const { album, year, picture, title, artist } = tagData.tags ?? {};

        let cover;
        if (picture) {
          const { data, format } = picture;
          // @ts-expect-error Can't figure out how to type data. Its a number[] but needs to be something else.
          const base64String = Buffer.from(data, "binary").toString("base64");
          cover = `data:${format};base64,${base64String}`;
        }

        resolve({ album, year, cover, title, artist });
      },
      onError: () => resolve({}),
    });
  });
