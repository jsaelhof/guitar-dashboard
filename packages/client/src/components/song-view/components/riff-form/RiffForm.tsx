import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Controls,
  Info,
  Layout,
  RiffInput,
  RiffList,
  GuitarTabButtonLayout,
  GuitarTabSectionLayout,
} from "./RiffForm.styles";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import { AddBox, Close } from "@mui/icons-material";
import Preview from "./components/preview/Preview";
import { v4 as uuid } from "uuid";
import { useAppContext } from "../../../../context/AppContext";
import { TUNINGS } from "../../../../contstants";
import { Tuning } from "guitar-dashboard-types";
import { SongAction } from "../../hooks/use-song";

export type RiffFormProps = {
  mode: "tab" | "riffs";
  requireOneRiff?: boolean;
  onChange?: (count: number) => void;
  dispatchSong: (action: SongAction) => void;
  songIsPending: boolean;
};

const RiffForm = ({
  mode,
  requireOneRiff,
  onChange,
  dispatchSong,
  songIsPending,
}: RiffFormProps) => {
  const { setDisableShortcuts } = useAppContext();

  const [tabs, setTabs] = useState<string[]>(requireOneRiff ? ["0"] : []);
  const tabsRef = useRef<{ [id: string]: string }>(
    requireOneRiff ? { "0": "" } : {}
  );
  const [label, setLabel] = useState<string>("");
  const [labelDesc, setLabelDesc] = useState<string>("");
  const [tuning, setTuning] = useState<Tuning>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    // Initialize an empty riff input if required.
    if (requireOneRiff) {
      setTabs(["0"]);
      tabsRef.current = { "0": "" };
    } else {
      setTabs([]);
      tabsRef.current = {};
    }
    setLabel("");
    setLabelDesc("");
  }, []);

  useEffect(() => {
    return () => {
      setDisableShortcuts(false);
    };
  }, []);

  useEffect(() => {
    setDisableShortcuts(!!tabs.length);
    onChange && onChange(tabs.length);
  }, [tabs]);

  return (
    <Layout>
      {tabs.length > 0 && (
        <>
          {mode === "riffs" && (
            <>
              <Info
                id="section"
                label="Section"
                variant="outlined"
                value={label}
                size="small"
                autoFocus
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLabel(e.target.value);
                }}
              />

              <Info
                id="desc"
                label="Description"
                variant="outlined"
                value={labelDesc}
                size="small"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLabelDesc(e.target.value);
                }}
              />
            </>
          )}

          {mode === "tab" && (
            <GuitarTabSectionLayout>
              <Info
                id="instrument"
                label="Guitar"
                variant="outlined"
                value={label}
                size="small"
                autoFocus
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLabel(e.target.value);
                }}
              />
              <GuitarTabButtonLayout>
                {["Rhythm", "Lead", "Solo", "Clean"].map((guitar) => (
                  <Button
                    key={guitar}
                    variant="outlined"
                    size="xsmall"
                    color="secondary"
                    onClick={() => setLabel(guitar)}
                  >
                    {guitar}
                  </Button>
                ))}
              </GuitarTabButtonLayout>
            </GuitarTabSectionLayout>
          )}

          <GuitarTabSectionLayout>
            <Typography variant="subtitle2">Tuning</Typography>
            <GuitarTabButtonLayout>
              {(Object.keys(TUNINGS) as Array<Tuning>).map((tuningOption) => (
                <Button
                  key={tuningOption}
                  size="xsmall"
                  {...(tuning === tuningOption && {
                    color: "primary",
                    variant: "contained",
                  })}
                  {...(tuning !== tuningOption && {
                    color: "secondary",
                    variant: "outlined",
                  })}
                  onClick={() => setTuning(tuningOption)}
                >
                  {TUNINGS[tuningOption]}
                </Button>
              ))}
            </GuitarTabButtonLayout>
          </GuitarTabSectionLayout>

          <RiffList>
            {tabs.map((tabId, i) => (
              <RiffInput key={i}>
                <TextField
                  id="tab"
                  multiline
                  autoFocus={i > 0} // If this is the first input, leave the autofocus on the label field. Otherwise, autofocus new riff inputs that are added.
                  label={`Tab #${i + 1}`}
                  placeholder="Paste data uri"
                  variant="outlined"
                  value={
                    tabsRef.current[tabId]
                      ? `${tabsRef.current[tabId].slice(
                          0,
                          20
                        )}...${tabsRef.current[tabId].slice(-30)}`
                      : ""
                  }
                  size="small"
                  fullWidth
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    // Split the content by newline, filtering off anything that isn't a data uri.
                    // This allows me to paste a set of newline-delimited urls and insert multiple riffs at once.
                    const urls = e.target.value
                      .split("\n")
                      .filter((val) => val.startsWith("data"));

                    // Interesting performance issue here.
                    // The data uri strings are so huge that if I try to update the state the usual way (by creating a new array from the existing one),
                    // the page immediately hangs for several seconds. By the time the 3rd or 4th riff is added its about a minute.
                    // Performance nose-dives very rapidly.
                    // Instead, I'm using a two-state approach, only keep the riff ids in a useState as pointers to a ref that holds the data.
                    urls.forEach((url, i) => {
                      // For each url, add it to the ref. The tabId is the id generated for the next riff, so adding "i" to it creates a sequential series of id's (N+0, N+1, ...etc)
                      tabsRef.current[parseInt(tabId) + i] = url;
                    });

                    // This isn't ideal but due to the performance issue above, I need some sort of state change to re-render based on the update to the ref.
                    // Resetting the tabs array does the trick. If multiple tab urls were pasted at once, this is needed to auto-insert a text field for each url.
                    setTabs([
                      ...tabs,
                      // "tabs" already contains the pre-generated id for the first riff being added.
                      // This array will add any additional id's if the input contains 2 or more newline-delimited urls.
                      // Create a new array, starting at tabId+1 (then tabId+2, ...etc) and spread it after "tabs".
                      // If only one url was pasted, this will be a zero-length array and have no effect.
                      ...(urls.length > 1
                        ? new Array(urls.length - 1)
                            .fill(null)
                            .map((_, i) =>
                              (parseInt(tabId) + (i + 1)).toString()
                            )
                        : []),
                    ]);
                  }}
                />

                {tabsRef.current[tabId] && (
                  <Preview url={tabsRef.current[tabId]} />
                )}

                <IconButton
                  onClick={() => {
                    const updatedTabs = tabs.filter((val) => val !== tabId);
                    setTabs(updatedTabs);
                    delete tabsRef.current[tabId];

                    // If this form always shows one riff input, and this was the last riff removed, call reset to re-insert an empty one.
                    updatedTabs.length === 0 && requireOneRiff && reset();
                  }}
                >
                  <Close />
                </IconButton>
              </RiffInput>
            ))}
          </RiffList>
        </>
      )}

      <Controls ref={scrollRef}>
        <div>
          <Button
            variant="outlined"
            startIcon={<AddBox />}
            disabled={
              tabs.length > 0 &&
              tabsRef.current &&
              tabsRef.current[tabs.at(-1) ?? ""].length === 0
            }
            onClick={() => {
              const newId = tabs.length.toString();
              tabsRef.current[newId] = "";
              setTabs([...tabs, newId]);
            }}
          >
            Add Riff
          </Button>
        </div>

        {tabs.length > 0 && (
          <>
            <Button variant="outlined" onClick={() => reset()}>
              {mode === "tab" ? "Clear" : "Cancel"}
            </Button>

            <Button
              color="success"
              variant="contained"
              disabled={
                !label ||
                tabs.length === 0 ||
                Object.values(tabsRef.current).some(
                  (tab) => tab.length === 0
                ) ||
                songIsPending
              }
              onClick={async () => {
                if (mode === "riffs") {
                  dispatchSong({
                    type: "addriff",
                    id: uuid(),
                    label,
                    labelDesc,
                    uri: tabs.map((tabId) => tabsRef.current[tabId]),
                  });
                } else if (mode === "tab") {
                  dispatchSong({
                    type: "addtablature",
                    id: uuid(),
                    label,
                    labelDesc,
                    tuning,
                    uri: tabs.map((tabId) => tabsRef.current[tabId]),
                  });
                }
              }}
            >
              Save
            </Button>
          </>
        )}
      </Controls>
    </Layout>
  );
};

export default RiffForm;
