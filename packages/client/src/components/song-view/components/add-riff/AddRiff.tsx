import { Button, IconButton, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { AddBox, Close } from "@mui/icons-material";
import { Controls, Info, Layout, RiffInput, RiffList } from "./AddRiff.styles";
import { useAppContext } from "../../../../context/AppContext";
import { v4 as uuid } from "uuid";
import Preview from "./components/preview/Preview";

const AddRiff = () => {
  const { song, dispatchRiffs, setDisableShortcuts } = useAppContext();
  const [section, setSection] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [tabs, setTabs] = useState<string[]>([]);
  const tabsRef = useRef<{ [id: string]: string }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    // Only reset tabs if its not already empty otherwise it causes recursion when the useEffect that is dependent on tabs needs to reset state.
    setTabs((state) => (state.length ? [] : state));
    setSection("");
    setDesc("");
    tabsRef.current = {};
    setDisableShortcuts(false);
  }, []);

  useEffect(() => {
    // Whenever a new tab input is added, the controls get pushed off the bottom of the screen.
    // This bumps the controls back into view when the tab inputs change and at least one exists.
    tabs.length && scrollRef.current?.scrollIntoView({ behavior: "smooth" });

    // If tabs is ever reduced back to 0, the panel closes up. Reset the state.
    // Do not reset tabs itself...it's already at 0 and setting it will cause an infinite loop
    tabs.length === 0 && reset();
  }, [tabs]);

  // Reset the state when switching songs
  useEffect(reset, [song]);

  return song ? (
    <Layout>
      {tabs.length > 0 && (
        <>
          <Info
            id="section"
            label="Section"
            variant="outlined"
            value={section}
            size="small"
            autoFocus
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSection(e.target.value);
            }}
          />

          <Info
            id="desc"
            label="Description"
            variant="outlined"
            value={desc}
            size="small"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDesc(e.target.value);
            }}
          />

          <RiffList>
            {tabs.map((tabId, i) => (
              <RiffInput key={i}>
                <TextField
                  id="tab"
                  multiline
                  label={`Tab #${i + 1}`}
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
                      ...new Array(urls.length - 1)
                        .fill(null)
                        .map((_, i) => (parseInt(tabId) + (i + 1)).toString()),
                    ]);
                  }}
                />

                {tabsRef.current[tabId] && (
                  <Preview url={tabsRef.current[tabId]} />
                )}

                <IconButton
                  onClick={() => {
                    setTabs(tabs.filter((val) => val !== tabId));
                    delete tabsRef.current[tabId];
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
        <Button
          variant="outlined"
          startIcon={<AddBox />}
          onClick={() => {
            setDisableShortcuts(true);
            if (
              tabs.length === 0 ||
              tabsRef.current[tabs.at(-1) ?? ""].length
            ) {
              const newId = tabs.length.toString();
              tabsRef.current[newId] = "";
              setTabs([...tabs, newId]);
            }
          }}
        >
          Add Riff
        </Button>

        {tabs.length > 0 && (
          <Button
            color="success"
            variant="contained"
            disabled={
              !section ||
              tabs.length === 0 ||
              tabs.some((tab) => tab.length === 0)
            }
            onClick={async () => {
              dispatchRiffs({
                type: "add",
                id: uuid(),
                label: section,
                labelDesc: desc,
                uri: tabs.map((tabId) => tabsRef.current[tabId]),
              });
              setTabs([]);
            }}
          >
            Save
          </Button>
        )}
      </Controls>
    </Layout>
  ) : null;
};

export default AddRiff;
