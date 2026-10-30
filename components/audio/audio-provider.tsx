"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { playableTracks } from "@/lib/discography";
import type { Album, Track } from "@/lib/types";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export interface Playback {
  album: Album;
  track: Track;
}

interface PlayerContextValue {
  current: Playback | null;
  status: PlayerStatus;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  error: string | null;
  sessionVisible: boolean;
  knownDurations: Record<string, number>;
  playTrack: (album: Album, track: Track) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  changeVolume: (value: number) => void;
  toggleMute: () => void;
  stop: () => void;
  setSessionVisible: (visible: boolean) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const VOLUME_KEY = "elc-player-volume-v2";

export const DEFAULT_VOLUME = 0.8;

export function AudioProvider({
  albums,
  children,
}: {
  albums: Album[];
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<Playback | null>(null);
  const queue = useMemo(() => playableTracks(albums), [albums]);
  const queueRef = useRef(queue);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const [current, setCurrent] = useState<Playback | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionVisible, setSessionVisibleState] = useState(false);
  const [knownDurations, setKnownDurations] = useState<Record<string, number>>({});
  const volumeReady = useRef(false);

  const startPlayback = useCallback(
    (album: Album, track: Track, autoplay = true) => {
      const audio = audioRef.current;
      if (!audio || !track.audioUrl) {
        setError("El audio de este tema todavía no está disponible.");
        return;
      }

      const playback = { album, track };
      currentRef.current = playback;
      setCurrent(playback);
      setError(null);
      setCurrentTime(0);
      setDuration(track.durationSeconds ?? 0);

      const absolute = new URL(track.audioUrl, window.location.href).href;
      if (audio.src !== absolute) {
        audio.src = track.audioUrl;
        audio.load();
      } else {
        audio.currentTime = 0;
      }

      if (!autoplay) {
        setStatus("paused");
        return;
      }

      setStatus("loading");
      void audio.play().catch(() => {
        setStatus("paused");
        setError("El navegador bloqueó la reproducción. Tocá Play otra vez.");
      });
    },
    [],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    const active = currentRef.current;
    if (!audio || !active) return;

    if (audio.paused) {
      setError(null);
      setStatus("loading");
      void audio.play().catch(() => {
        setStatus("paused");
        setError("No pudimos iniciar este audio.");
      });
      return;
    }

    audio.pause();
  }, []);

  const playTrack = useCallback(
    (album: Album, track: Track) => {
      if (!track.audioUrl) {
        setError("El audio de este tema todavía no está disponible.");
        return;
      }

      if (currentRef.current?.track.id === track.id) {
        toggle();
        return;
      }

      startPlayback(album, track, true);
    },
    [startPlayback, toggle],
  );

  const next = useCallback(() => {
    const tracks = queueRef.current;
    if (!tracks.length) return;

    const activeId = currentRef.current?.track.id;
    const index = tracks.findIndex((item) => item.track.id === activeId);
    const following = tracks[(index + 1) % tracks.length];
    if (following) startPlayback(following.album, following.track, true);
  }, [startPlayback]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const tracks = queueRef.current;
    if (!tracks.length) return;

    const activeId = currentRef.current?.track.id;
    const index = tracks.findIndex((item) => item.track.id === activeId);
    if (index === -1) {
      const first = tracks[0];
      if (first) startPlayback(first.album, first.track, true);
      return;
    }

    const before = tracks[(index - 1 + tracks.length) % tracks.length];
    if (before) startPlayback(before.album, before.track, true);
  }, [startPlayback]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !currentRef.current) return;

    const limit = Number.isFinite(audio.duration) ? audio.duration : 0;
    const nextTime = Math.min(Math.max(seconds, 0), limit || seconds);

    try {
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    } catch {
      // Algunos navegadores rechazan seek antes de tener metadata.
    }
  }, []);

  const changeVolume = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    const audio = audioRef.current;
    setVolume(next);
    if (!audio) return;

    audio.volume = next;
    if (next > 0 && audio.muted) {
      audio.muted = false;
      setMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !audio.muted;
    audio.muted = next;
    setMuted(next);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    currentRef.current = null;
    setCurrent(null);
    setStatus("idle");
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  const setSessionVisible = useCallback((visible: boolean) => {
    setSessionVisibleState(visible);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let stored: number | null = null;
    try {
      const raw = window.localStorage.getItem(VOLUME_KEY);
      const parsed = raw === null ? Number.NaN : Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
        stored = parsed;
      }
    } catch {
      // Sin acceso a localStorage seguimos con el volumen por defecto.
    }

    const initial = stored ?? DEFAULT_VOLUME;
    audio.volume = initial;
    audio.muted = false;
    const frame = window.requestAnimationFrame(() => {
      volumeReady.current = true;
      setVolume(initial);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!volumeReady.current) return;
    try {
      window.localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      // Ignorado a propósito.
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);

    const onMetadata = () => {
      const total = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(total);
      const active = currentRef.current;
      if (!active || total <= 0) return;
      setKnownDurations((durations) =>
        durations[active.track.id] === total
          ? durations
          : { ...durations, [active.track.id]: total },
      );
    };

    const onPlay = () => {
      setStatus("playing");
      setError(null);
    };
    const onPause = () => {
      setStatus(currentRef.current ? "paused" : "idle");
    };
    const onWaiting = () => {
      if (currentRef.current) setStatus("loading");
    };
    const onCanPlay = () => {
      if (!audio.paused) setStatus("playing");
    };
    const onError = () => {
      if (!currentRef.current) return;
      setStatus("error");
      setError("No pudimos reproducir este audio.");
    };
    const onEnded = () => {
      setStatus("paused");
      next();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("durationchange", onMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.removeEventListener("durationchange", onMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, [next]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    if (!current) {
      navigator.mediaSession.metadata = null;
      return;
    }

    if (typeof MediaMetadata !== "undefined") {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.track.title,
        artist: "El Clásico",
        album: current.album.title,
      });
    }
  }, [current]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;

    try {
      session.setActionHandler("play", () => toggle());
      session.setActionHandler("pause", () => toggle());
      session.setActionHandler("nexttrack", () => next());
      session.setActionHandler("previoustrack", () => previous());
    } catch {
      // Media Session no está disponible en este navegador.
    }

    return () => {
      try {
        session.setActionHandler("play", null);
        session.setActionHandler("pause", null);
        session.setActionHandler("nexttrack", null);
        session.setActionHandler("previoustrack", null);
      } catch {
        // Nada que limpiar.
      }
    };
  }, [next, previous, toggle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
    };
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      current,
      status,
      isPlaying: status === "playing",
      currentTime,
      duration,
      volume,
      muted,
      error,
      sessionVisible,
      knownDurations,
      playTrack,
      toggle,
      next,
      previous,
      seek,
      changeVolume,
      toggleMute,
      stop,
      setSessionVisible,
    }),
    [
      current,
      status,
      currentTime,
      duration,
      volume,
      muted,
      error,
      sessionVisible,
      knownDurations,
      playTrack,
      toggle,
      next,
      previous,
      seek,
      changeVolume,
      toggleMute,
      stop,
      setSessionVisible,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" className="hidden" aria-hidden="true" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer debe usarse dentro de <AudioProvider>.");
  }
  return context;
}
