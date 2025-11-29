const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", true);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/whoami", (req, res) => {
    let ipAddress = req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || null;
    if (ipAddress && ipAddress.includes(",")) {
        ipAddress = ipAddress.split(",")[0].trim();
    }

    if (ipAddress && ipAddress.startsWith("::ffff:")) {
        ipAddress = ipAddress.replace("::ffff:", "");
    }

    const languageHeader = req.headers["accept-language"] || "";
    const language = languageHeader.split(",")[0];

    const software = req.headers["user-agent"] || "";

    res.json({
        ipaddress: ipAddress,
        language: language,
        software: software
    });
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
