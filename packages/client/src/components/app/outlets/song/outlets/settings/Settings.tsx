import {
  Alert,
  AlertProps,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { FileOpen, Restore, Storage } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { post } from "../../../../utils/post";
import { format } from "date-fns";

export const Settings = () => {
  const [snack, setSnack] = useState<AlertProps & { message: string }>();
  const onSnackClose = useCallback(() => setSnack(undefined), []);

  const [backupBusy, setBackupBusy] = useState(false);
  const onBackup = useCallback(async () => {
    setBackupBusy(true);
    const response = await post("/util/backupDB");
    const { error } = await response.json();
    setBackupBusy(false);

    if (error) {
      setSnack({
        severity: "error",
        message: "Backup failed",
      });
    } else {
      setSnack({
        severity: "success",
        message: "Backup completed",
      });
    }
  }, []);

  const [backups, setBackups] = useState<{ name: string; path: string }[]>();
  const [selectedBackup, setSelectedBackup] = useState<string>();
  const [restoreBusy, setRestoreBusy] = useState(false);
  const onRestore = useCallback(async () => {
    setRestoreBusy(true);
    const response = await post(
      "/util/restoreDB",
      JSON.stringify({ backupZipPath: selectedBackup })
    );
    const { error } = await response.json();
    setRestoreBusy(false);

    if (error) {
      setSnack({
        severity: "error",
        message: "Restore failed",
      });
    } else {
      setSnack({
        severity: "success",
        message: "Restore completed",
      });
    }
  }, [selectedBackup]);

  useEffect(() => {
    const fetchBackups = async () => {
      const response = await post("/util/selectRestoreDB");
      const { error, files } = await response.json();

      if (error) {
        setSnack({
          severity: "error",
          message: "Failed to load backups",
        });
        setBackups([]);
      } else {
        setBackups(files);
      }
    };

    if (!backupBusy && !restoreBusy) fetchBackups();
  }, [backupBusy, restoreBusy]);

  return (
    <>
      <Stack gap={4} padding={2}>
        <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
          Settings & Tools
        </Typography>

        <Stack gap={2}>
          <Card variant="outlined" sx={{ maxWidth: "600px" }}>
            <CardHeader
              title="Database Backups"
              subheader="Available backups (Select to restore)"
            />

            {!backups && (
              <Box padding={1} display="flex" justifyContent="center">
                <CircularProgress size={24} color="secondary" />
              </Box>
            )}

            <CardContent>
              {backups && (
                <List>
                  {backups.map(({ name, path }) => {
                    const regex =
                      /backup_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})\.zip/;
                    const match = name.match(regex);
                    const date = match?.[1];
                    const time = match?.[2];
                    const formatted = format(
                      `${date}T${time?.replace(/-/g, ":")}`,
                      "EEEE, MMMM do, yyyy - h:mm aaa"
                    );

                    return (
                      <ListItemButton
                        onClick={() => setSelectedBackup(path)}
                        selected={selectedBackup === path}
                      >
                        <ListItemIcon>
                          <FileOpen fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          slotProps={{ primary: { fontSize: "small" } }}
                          primary={formatted}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              )}
            </CardContent>

            <CardActions>
              <Button
                variant="contained"
                startIcon={<Storage />}
                disabled={restoreBusy}
                loading={backupBusy}
                loadingPosition="start"
                onClick={onBackup}
                fullWidth
              >
                Backup Database
              </Button>
              <Button
                variant="contained"
                startIcon={<Restore />}
                disabled={!selectedBackup || backupBusy}
                loading={restoreBusy}
                loadingPosition="start"
                onClick={onRestore}
                fullWidth
              >
                Restore Backup
              </Button>
            </CardActions>
          </Card>
        </Stack>
      </Stack>

      {snack && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={onSnackClose}
        >
          <Alert onClose={onSnackClose} {...snack} variant="filled">
            {snack?.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
