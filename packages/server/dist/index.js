"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const db = {
    "0000": {
        title: "Kaisarion",
        artist: "Ghost",
        tab: "https://tabs.ultimate-guitar.com/tab/ghost/kaisarion-official-4110004",
        file: "G/Ghost/Ghost - [2022] Impera/02 - Kaisarion.mp3",
    },
    "0001": {
        title: "Spillways",
        artist: "Ghost",
        tab: "https://tabs.ultimate-guitar.com/tab/ghost/spillways-official-4109164",
        file: "G/Ghost/Ghost - [2022] Impera/03 - Spillways.mp3",
    },
    "0002": {
        title: "Square Hammer",
        artist: "Ghost",
        tab: "https://tabs.ultimate-guitar.com/tab/ghost/square-hammer-official-2076729",
        file: "G/Ghost/Ghost - [2016] Popestar/01 - Square Hammer.mp3",
    },
    "0003": {
        tab: "https://tabs.ultimate-guitar.com/tab/iron-maiden/hallowed-be-thy-name-official-2202561",
        file: "I/Iron Maiden/Iron Maiden - [1982] The Number of the Beast/09 - Hallowed Be Thy Name.mp3",
    },
    "0004": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/02 - Atlas, Rise!.mp3",
    },
    "0005": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/01 - Hardwired.mp3",
    },
    "0006": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/03 - Now That We're Dead.mp3",
    },
    "0007": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/04 - Moth Into Flame.mp3",
    },
    "0008": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/06 - Halo On Fire.mp3",
    },
    "0009": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/09 - Here Comes Revenge.mp3",
    },
    "0010": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/12 - Spit Out The Bone.mp3",
    },
    "0011": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2016] Hardwired...To Self-Destruct (Limited Deluxe Edition) CD3/14 - Ronnie Rising Medley (A Light In The Black, Tarot Woman, Stargazer, Kill The King).mp3",
    },
    "0012": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2023] 72 Seasons/01 - 72 Seasons.mp3",
    },
    "0013": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2023] 72 Seasons/02 - Shadows Follow.mp3",
    },
    "0014": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2023] 72 Seasons/06 - Lux Æterna.mp3",
    },
    "0015": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2008] Death Magnetic/01 - That Was Just Your Life.mp3",
    },
    "0016": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [2008] Death Magnetic/03 - Broken, Beat & Scarred.mp3",
    },
    "0017": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [1998] Garage Inc/07 - Mercyful Fate.mp3",
    },
    "0018": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [1991] Metallica/07 - Through The Never.mp3",
    },
    "0019": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [1991] Metallica/10 - The God That Failed.mp3",
    },
    "0020": {
        artist: "Metallica",
        file: "M/Metallica/Studio Albums/Metallica - [1991] Metallica/03 - Holier Than Thou.mp3",
    },
    "0021": {
        title: "Girls On The East Side Of Town",
        artist: "Tuk Smith & The Restless Hearts",
        tab: "https://tabs.ultimate-guitar.com/tab/tuk-smith-the-restless-hearts/girls-on-the-east-side-of-town-tabs-5090788",
        pdf: "assets/0021/pdf/girls on the east side of town tab.pdf",
    },
    "0022": {
        file: "I/Iron Maiden/Iron Maiden - [1986] Somewhere In Time/08 - Alexander The Great.mp3",
    },
    "0023": {
        file: "I/Iron Maiden/Iron Maiden - [1986] Somewhere In Time/05 - The Loneliness Of The Long Distance Runner.mp3",
    },
    "0024": {
        file: "I/Iron Maiden/Iron Maiden - [1986] Somewhere In Time/02 - Wasted Years.mp3",
    },
    "0025": {
        file: "I/Iron Maiden/Iron Maiden - [1986] Somewhere In Time/01 - Caught Somewhere In Time.mp3",
    },
    "0026": {
        file: "I/Iron Maiden/Iron Maiden - [1986] Somewhere In Time/06 - Stranger In A Strange Land.mp3",
    },
    "0027": {
        file: "B/Boston/Boston - [1976] Boston/05 - Smokin'.mp3",
    },
    "0028": {
        file: "B/Boston/Boston - [1976] Boston/04 - Rock & Roll Band.mp3",
    },
    "0029": {
        file: "B/Boston/Boston - [1976] Boston/02 - Peace Of Mind.mp3",
    },
    "0030": {
        file: "B/Boston/Boston - [1986] Third Stage/04 - Cool The Engines.mp3",
    },
    "0031": {
        file: "I/Iron Maiden/Iron Maiden - [1988] Seventh Son of a Seventh Son/01 - Moonchild.mp3",
    },
    "0032": {
        file: "I/Iron Maiden/Iron Maiden - [1988] Seventh Son of a Seventh Son/04 - The Evil That Men Do.mp3",
    },
    "0033": {
        file: "I/Iron Maiden/Iron Maiden - [1988] Seventh Son of a Seventh Son/07 - The Clairvoyant.mp3",
    },
    "0034": {
        file: "I/Iron Maiden/Iron Maiden - [1984] Powerslave/01 - Aces High.mp3",
    },
    "0035": {
        file: "I/Iron Maiden/Iron Maiden - [1984] Powerslave/02 - 2 Minutes To Midnight.mp3",
    },
    "0036": {
        file: "I/Iron Maiden/Iron Maiden - [1984] Powerslave/07 - Powerslave.mp3",
    },
    "0037": {
        file: "I/Iron Maiden/Iron Maiden - [1984] Powerslave/08 - Rime Of The Ancient Mariner.mp3",
    },
    "0038": {
        file: "I/Iron Maiden/Iron Maiden - [2006] A Matter Of Life And Death/08 - For The Greater Good Of God.mp3",
    },
    "0039": {
        file: "I/Iron Maiden/Iron Maiden - [2006] A Matter Of Life And Death/03 - Brighter Than A Thousand Suns.mp3",
    },
    "0040": {
        file: "I/Iron Maiden/Iron Maiden - [2006] A Matter Of Life And Death/02 - These Colours Don't Run.mp3",
    },
    "0041": {
        file: "I/Iron Maiden/Iron Maiden - [2006] A Matter Of Life And Death/05 - The Longest Day.mp3",
    },
    "0042": {
        file: "I/Iron Maiden/Iron Maiden - [2006] A Matter Of Life And Death/07 - The Reincarnation Of Benjamin Breeg.mp3",
    },
};
app.use((0, cors_1.default)({
    origin: "http://localhost:8000",
}));
app.use(express_1.default.static("public"));
app.use(express_1.default.static("/Volumes/Public/Music"));
app.get("/songs", (req, res) => {
    console.log("SONGS");
    res.send(db);
});
app.get("/riffs/:slug", (req, res) => {
    let riffImages, riffUris;
    try {
        riffImages = (0, fs_1.readdirSync)(`public/assets/${req.params.slug}/riffs`).map((file) => {
            const [, label, ...labelDesc] = path_1.default.parse(file).name.split("_");
            return {
                label: label.split("-").join(" "),
                ...(labelDesc.length && {
                    labelDesc: labelDesc.join(" "),
                }),
                src: `assets/${req.params.slug}/riffs/${file}`,
            };
        });
    }
    catch (ex) { }
    try {
        riffUris = JSON.parse((0, fs_1.readFileSync)(`public/assets/${req.params.slug}/riffs.json`).toString());
    }
    catch (ex) { }
    try {
        res.send([
            ...(riffImages ? riffImages : []),
            ...(riffUris ? riffUris : []),
        ]);
    }
    catch (ex) {
        console.error(ex);
        res.send([]);
    }
});
app.post("/play/:slug", (req, res) => {
    console.log("PLAY", req.params, db[req.params.slug]);
    const { file } = db[req.params.slug];
    var cp = require("child_process");
    cp.exec(`open -a "iina" "${file}"`, (error, stdout, stderr) => {
        console.log(error);
    });
    res.send({
        ok: true,
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
