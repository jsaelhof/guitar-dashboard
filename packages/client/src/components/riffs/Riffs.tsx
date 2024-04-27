import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from "@mui/material";
import { AudioEvent, Riff } from "../../types";
import { useEffect, useMemo, useState } from "react";
import {
  RiffList,
  RiffListItem,
  SectionLabel,
  UriTablature,
} from "./Riffs.styles";
import {
  addAudioEventListener,
  removeAudioEventListener,
} from "../../utils/audio-events";
import { formatSeconds } from "../../utils/format-seconds";

export type RiffsProps = {
  riffs: Riff[] | null;
};

const Riffs = ({ riffs }: RiffsProps) => {
  const allRiffs = useMemo(() => [...Array((riffs ?? []).length).keys()], []);
  const [openItems, setOpenItems] = useState<number[]>(allRiffs);

  // This hook sets up a listener for playback events from the the Player.tsx component as it plays through a song.
  // Using the time, we can check and see if what riff should be shown.
  useEffect(() => {
    const listener = (e: AudioEvent) => {
      if (e.detail.currentTime) {
        const currentRiffIndex = riffs?.findLastIndex(
          ({ time }) => time != null && time < e.detail.currentTime
        );

        currentRiffIndex !== undefined && setOpenItems([currentRiffIndex]);
      }
    };

    addAudioEventListener(listener);

    () => {
      removeAudioEventListener(listener);
    };
  }, []);

  return (
    <div>
      {riffs && riffs.length > 0 && (
        <div>
          <RiffList>
            <RiffListItem onClick={() => setOpenItems(allRiffs)}>
              All
            </RiffListItem>

            {riffs.map(({ label }, index) => (
              <RiffListItem onClick={() => setOpenItems([index])}>
                {label}
              </RiffListItem>
            ))}
          </RiffList>
        </div>
      )}
      {(riffs || []).map(({ label, labelDesc, src, uri, time }, index) => (
        <Accordion
          key={src}
          expanded={
            openItems.find((itemIndex) => itemIndex === index) != null ?? false
          }
          onChange={(e, expanded) =>
            expanded
              ? setOpenItems([...openItems, index])
              : setOpenItems(
                  openItems.filter((itemIndex) => itemIndex !== index)
                )
          }
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              flexDirection: "row-reverse",
              textTransform: "capitalize",
              gap: "8px",
            }}
          >
            <SectionLabel>
              <Chip
                label={`${
                  time !== undefined ? `${formatSeconds(time)}: ` : ""
                }${label}`}
              />
              {labelDesc}
            </SectionLabel>
          </AccordionSummary>
          <AccordionDetails>
            {src && <img src={`http://localhost:8001/${src}`} />}

            {uri &&
              uri.map((imageUri, i) => <UriTablature key={i} src={imageUri} />)}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Riffs;
