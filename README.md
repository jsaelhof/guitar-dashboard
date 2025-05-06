# guitar-dashboard

A web-based dashboard for controlling music and sheet music while practicing

# Setup

Add a .env file at `/packages/server/.env`

Include the following:

```
# Port of the server
PORT=8001

# Connection string for the Mongo DB
CONNECTION_STRING=mongodb://localhost:27017/guitar;

# Path on the local machine to the MP3 library, no trailing slash.
# Files paths in the DB are appended to this value.
# Those file paths are in the form `/G/Ghost/...`
MP3_LIB=/Volumes/Public/Music
```
