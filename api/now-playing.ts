import { NowRequest, NowResponse } from "@vercel/node";
import { renderToString, ReactElement } from "react-dom/server";
import { decode } from "querystring";
import { Player } from "../components/NowPlaying";
import { nowPlaying } from "../utils/spotify";

// Define types for safety
type Artist = { name: string };
type Album = { images?: { url: string }[] };
type TrackItem = {
  artists?: Artist[];
  album?: Album;
  duration_ms?: number;
  name?: string;
  external_urls?: { spotify?: string };
};

export default async function handler(req: NowRequest, res: NowResponse) {
  const {
    item = {} as TrackItem,
    is_playing: isPlaying = false,
    progress_ms: progress = 0,
  } = await nowPlaying();

  const params = decode(req.url?.split("?")[1] || "") as Record<string, string>;

  // Redirect if ?open param exists
  if (params && typeof params.open !== "undefined") {
    if (item && item.external_urls?.spotify) {
      res.writeHead(302, {
        Location: item.external_urls.spotify,
      });
      return res.end();
    }
    return res.status(200).end();
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  const { duration_ms: duration, name: track } = item;
  const { images = [] } = item.album || {};

  const cover = images[images.length - 1]?.url;
  let coverImg: string | undefined = undefined;

  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  const artist = ((item.artists as Artist[]) || []).map(({ name }) => name).join(", ");

  // Ensure Player returns a ReactElement
  const element: ReactElement | null = Player({
    cover: coverImg,
    artist,
    track,
    isPlaying,
    progress,
    duration,
  });

  const text = element ? renderToString(element) : "";
  return res.status(200).send(text);
}
