const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup the express assets path
app.use("/", express.static(path.join(__dirname, "../client")));

// app.use(cors());

// API calls ------------------------------------------------------------------------------------
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/race", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/race.html"));
});

// app.get("/api/tracks", (req, res) => {
//   // Your logic to retrieve and return tracks data
//   return res.json();
// });

// app.get("/api/tracks", async (req, res) => {
//   // Your logic to fetch tracks data from a data source or an external API
//   // For now, let's assume some sample data
//   const tracks = [
//     { id: 1, name: "Track 1", length: "3:45" },
//     { id: 2, name: "Track 2", length: "4:12" },
//     // Add more tracks as needed
//   ];

//   // Respond with the tracks data in JSON format
//   res.json(tracks);
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
