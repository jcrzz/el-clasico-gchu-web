import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import type { Album, Track } from "./types";

const AUDIO_EXTENSIONS = [".m4a", ".mp3", ".ogg", ".wav"] as const;
const AUDIO_DIRECTORY = path.join(process.cwd(), "public", "audio");

function hasExtension(file: string) {
  return /\.[a-z0-9]+$/i.test(file);
}

function resolveTrack(track: Track, baseUrl: string | null): Track {
  if (!track.audioFile) return { ...track, audioUrl: null };

  if (baseUrl) {
    const file = hasExtension(track.audioFile)
      ? track.audioFile
      : `${track.audioFile}.m4a`;
    return { ...track, audioUrl: `${baseUrl}/${file}` };
  }

  for (const extension of AUDIO_EXTENSIONS) {
    const relative = `${track.audioFile}${extension}`;
    if (existsSync(path.join(AUDIO_DIRECTORY, relative))) {
      return { ...track, audioUrl: `/audio/${relative}` };
    }
  }

  return { ...track, audioUrl: null };
}

/**
 * Las pistas viven en `public/audio/<disco>/<pista>.<ext>` durante el
 * desarrollo, o en un bucket/CDN público en producción. Si no hay archivo
 * todavía, `audioUrl` queda en null y la UI muestra el estado pendiente.
 */
export function withResolvedAudio(albums: Album[]): Album[] {
  const configuredBase =
    process.env.AUDIO_BASE_URL ?? process.env.NEXT_PUBLIC_AUDIO_BASE_URL ?? "";
  const baseUrl = configuredBase.replace(/\/+$/, "") || null;

  return albums.map((album) => ({
    ...album,
    tracks: album.tracks.map((track) => resolveTrack(track, baseUrl)),
  }));
}
