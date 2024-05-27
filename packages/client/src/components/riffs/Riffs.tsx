import {
  Alarm,
  ArrowLeft,
  ArrowRight,
  BookmarkAdd,
  Close,
  ExpandMore,
  Update,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { AudioEvent } from "../../types";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  OrderLayout,
  RiffList,
  RiffListItem,
  RiffOrderDown,
  RiffOrderUp,
  SectionSummary,
  UriTablature,
} from "./Riffs.styles";
import {
  addAudioEventListener,
  removeAudioEventListener,
} from "../../utils/audio-events";
import { formatSeconds } from "../../utils/format-seconds";
import { useAppContext } from "../../context/AppContext";

const Riffs = () => {
  const { song, riffs, send } = useAppContext();

  const allRiffs = useMemo(() => [...Array((riffs ?? []).length).keys()], []);
  const [openItems, setOpenItems] = useState<number[]>(allRiffs);
  const [activeTimeMark, setActiveTimeMark] = useState<{
    index: number;
    time: number;
  } | null>(null);

  const ref = useRef<number>(0);

  // Sort the riffs by time (0) mapped to riff index (1)
  const timeMap = useMemo(
    () =>
      riffs
        .reduce<[number, number][]>((acc, riff, index) => {
          if (riff.time !== undefined) {
            acc.push([riff.time, index]);
          }
          return acc;
        }, [])
        .sort((a, b) => a[0] - b[0]),
    [riffs]
  );

  // This hook sets up a listener for playback events from the the Player.tsx component as it plays through a song.
  // Using the time, we can check and see what riff should be shown.
  useEffect(() => {
    const listener = (e: AudioEvent) => {
      if (e.detail.currentTime) {
        ref.current = Math.round(e.detail.currentTime);

        const currentRiffIndex =
          timeMap.findLast(([time]) => time < e.detail.currentTime)?.[1] ?? -1;

        currentRiffIndex >= 0 && setOpenItems([currentRiffIndex]);
      }
    };

    addAudioEventListener(listener);

    () => {
      removeAudioEventListener(listener);
    };
  }, [riffs]);

  return song ? (
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
      {(riffs || []).map(({ id, label, labelDesc, src, uri, time }, index) => (
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
              alignItems: "center",
              height: "64px",
            }}
          >
            <SectionSummary>
              <Chip label={label} />

              <div>{labelDesc}</div>

              <Box display="flex" alignItems="center">
                {activeTimeMark?.index === index && (
                  <>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();

                        setActiveTimeMark({
                          ...activeTimeMark,
                          time:
                            riffs[index].time === undefined ||
                            riffs[index].time === activeTimeMark.time
                              ? ref.current
                              : riffs[index].time ?? 0,
                        });
                      }}
                    >
                      <Update />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTimeMark({
                          ...activeTimeMark,
                          time: activeTimeMark.time - 1,
                        });
                      }}
                    >
                      <ArrowLeft />
                    </IconButton>

                    <Typography fontSize={14} sx={{ mx: 1 }}>
                      {formatSeconds(activeTimeMark.time)}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTimeMark({
                          ...activeTimeMark,
                          time: activeTimeMark.time + 1,
                        });
                      }}
                    >
                      <ArrowRight />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="success"
                      onClick={async (e) => {
                        e.stopPropagation();

                        send("riffs", "time", {
                          songId: song.id,
                          riffId: id,
                          seconds: activeTimeMark.time,
                        });

                        setActiveTimeMark(null);
                      }}
                    >
                      <BookmarkAdd />
                    </IconButton>
                  </>
                )}

                {activeTimeMark?.index !== index && (
                  <Typography fontSize={14}>
                    {time !== undefined ? formatSeconds(time) : ""}
                  </Typography>
                )}

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTimeMark(
                      activeTimeMark?.index === index
                        ? null
                        : {
                            index,
                            time: riffs[index].time ?? ref.current,
                          }
                    );
                  }}
                >
                  {activeTimeMark?.index === index ? <Close /> : <Alarm />}
                </IconButton>

                <OrderLayout>
                  <RiffOrderUp
                    onClick={(e) => {
                      e.stopPropagation();

                      if (index > 0) {
                        send("riffs", "order", {
                          songId: song.id,
                          riffId: id,
                          order: Math.max(index - 1, 0),
                        });
                      }
                    }}
                  >
                    <svg viewBox="0 0 24 12">
                      <path d="M 7 4 H 17 L 12 9" />
                    </svg>
                  </RiffOrderUp>
                  <RiffOrderDown
                    onClick={(e) => {
                      e.stopPropagation();

                      if (index < riffs.length - 1) {
                        send("riffs", "order", {
                          songId: song.id,
                          riffId: id,
                          order: Math.min(index + 1, riffs.length - 1),
                        });
                      }
                    }}
                  >
                    <svg viewBox="0 0 24 12">
                      <path d="M 7 4 H 17 L 12 9" />
                    </svg>
                  </RiffOrderDown>
                </OrderLayout>
              </Box>
            </SectionSummary>
          </AccordionSummary>
          <AccordionDetails>
            {src && <img src={`http://localhost:8001/${src}`} />}

            {uri &&
              uri.map((imageUri, i) => <UriTablature key={i} src={imageUri} />)}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  ) : null;
};

export default Riffs;
