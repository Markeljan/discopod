export const isAudioUrl = (url: string) =>
  [".mp3", ".wav", ".oga"].some((ext) => url.toLowerCase().endsWith(ext));
export const isVideoUrl = (url: string) =>
  [".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".mov"].some((ext) =>
    url.toLowerCase().endsWith(ext)
  );
