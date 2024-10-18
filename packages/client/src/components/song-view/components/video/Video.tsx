import { ChangeEvent, useRef, useState } from "react";
import { VideoResource } from "../../../../types";
import {
  UrlInput,
  InputLayout,
  Layout,
  DescInput,
  AddButton,
  FooterLayout,
} from "./Video.styles";
import { Button, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppContext } from "../../../../context/AppContext";

// This gets the youtube video id from the regular video liknk (which can't be embedded)
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export type VideoProps = {
  videos?: VideoResource[];
};

const Video = ({ videos }: VideoProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { dispatchSong, setDisableShortcuts } = useAppContext();
  const [url, setUrl] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const width = (ref.current?.getBoundingClientRect().width ?? 1000) - 16;

  return (
    <Layout ref={ref}>
      {(videos ?? []).map(({ id, url, desc }) => (
        <div key={id}>
          <iframe
            width={width}
            height={width / (16 / 9)}
            src={`https://www.youtube.com/embed/${getYouTubeId(url)}`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <FooterLayout>
            <div>{desc}</div>
            <Button
              variant="outlined"
              size="xsmall"
              color="secondary"
              onClick={() => dispatchSong({ type: "deletevideo", id })}
            >
              Remove
            </Button>
          </FooterLayout>
        </div>
      ))}

      {!!videos?.length && <Divider variant="middle" sx={{ my: 3 }} />}

      <InputLayout>
        <Typography variant="subtitle2">Add a new video reference</Typography>

        <UrlInput
          id="url"
          label="YouTube URL"
          variant="outlined"
          value={url}
          size="small"
          required
          autoFocus
          onFocus={() => setDisableShortcuts(true)}
          onBlur={() => setDisableShortcuts(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUrl(e.target.value);
          }}
        />

        <DescInput
          id="desc"
          label="Description"
          variant="outlined"
          value={desc}
          size="small"
          onFocus={() => setDisableShortcuts(true)}
          onBlur={() => setDisableShortcuts(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setDesc(e.target.value);
          }}
        />

        <AddButton
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            if (url) {
              setUrl("");
              setDesc("");
              dispatchSong({
                type: "addvideo",
                url,
                desc,
              });
            }
            // TODO: Client-side validation?
          }}
        >
          Add
        </AddButton>
      </InputLayout>
    </Layout>
  );
};

export default Video;
