import fetch from "node-fetch";
import express from "express";
import open from "open";
import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID || "YOUR_CLIENT_ID";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "YOUR_CLIENT_SECRET";
const redirect_uri = "http://127.0.0.1:8888/callback";

const app = express();
const port = 8888;

app.get("/login", (req, res) => {
  const scope = "user-read-currently-playing user-read-playback-state";
  const queryParams = querystring.stringify({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: querystring.stringify({
      code,
      redirect_uri,
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();
  console.log("\nRefresh Token:", data.refresh_token, "\n");

  res.send("✅ Success! Check your terminal for the refresh token.");
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Go to http://localhost:${port}/login to authorize`);
  open(`http://localhost:${port}/login`);
});
