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
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  OrderLayout,
  RiffList,
  ListItem,
  RiffOrderDown,
  RiffOrderUp,
  SectionSummary,
  Shortcuts,
  UriTablature,
} from "./Riffs.styles";
import { formatSeconds } from "../../../../utils/format-seconds";
import { useAppContext } from "../../../../context/AppContext";
import {
  CustomEvents,
  PlaySavedLoopDetail,
  UpdateTimeDetail,
} from "../../../../types/events";

const Riffs = () => {
  const { song, riffs, dispatchRiffs } = useAppContext();

  const allRiffs = useMemo(
    () => [...Array((riffs ?? []).length).keys()],
    [riffs]
  );
  const [openItems, setOpenItems] = useState<number[]>(allRiffs);
  const [activeTimeMark, setActiveTimeMark] = useState<{
    index: number;
    time: number;
  } | null>(null);

  const currentTimeRef = useRef<number>(0);

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
    const listener = ({
      detail: { currentTime },
    }: CustomEvent<UpdateTimeDetail>) => {
      if (currentTime) {
        currentTimeRef.current = Math.round(currentTime);

        const currentRiffIndex =
          timeMap.findLast(([time]) => time < currentTime)?.[1] ?? -1;

        currentRiffIndex >= 0 && setOpenItems([currentRiffIndex]);
      }
    };

    document.addEventListener(CustomEvents.UPDATE_TIME, listener);

    () => {
      document.removeEventListener(CustomEvents.UPDATE_TIME, listener);
    };
  }, [riffs]);

  // This useEffect resets anything that should be cleared from the previous song.
  useEffect(() => {
    currentTimeRef.current = 0;
    setActiveTimeMark(null);
  }, [song?.id]);

  return song ? (
    <div>
      {/* This should maybe move out to its own component */}
      <Shortcuts>
        <RiffList>
          {riffs.length > 0 && (
            <ListItem onClick={() => setOpenItems(allRiffs)}>All</ListItem>
          )}

          {riffs.map(({ id, label }, index) => (
            <ListItem key={id} onClick={() => setOpenItems([index])}>
              {label}
            </ListItem>
          ))}
        </RiffList>
      </Shortcuts>

      {riffs.map(({ id, label, labelDesc, src, uri, time }, index) => (
        <Accordion
          key={id}
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
                              ? currentTimeRef.current
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

                        dispatchRiffs({
                          type: "time",
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
                            time: riffs[index].time ?? currentTimeRef.current,
                          }
                    );
                  }}
                >
                  {activeTimeMark?.index === index ? <Close /> : <Alarm />}
                </IconButton>

                <OrderLayout>
                  <RiffOrderUp
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();

                      if (index > 0) {
                        dispatchRiffs({
                          type: "order",
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
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();

                      if (index < riffs.length - 1) {
                        dispatchRiffs({
                          type: "order",
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
