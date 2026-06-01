/**
 * Map local video paths (from projects/play data) to Mux playback IDs.
 * Upload videos at https://dashboard.mux.com → Assets → copy each Playback ID.
 * Leave a key commented out (or omit it) to keep serving the local /public file.
 */
export const muxPlaybackIds: Partial<Record<string, string>> = {
  // Projects — crypto-2026
  // "/home-recording-crypto.mp4": "102L9uJTYTb02ZARrb02rc86BKKbTDsdAvRDtIc8tDIcGM",
  // "/crypto-loader-mobile.mp4": "CuicXFTK2RbDZk02YuuevLxDFMpePkf02DuKLI57nDGt4",
  // "/crypto-renewal-exp.mp4": "8hJJlDYn8bWTorL7502wy01J01cXKLx01DMlXACiQglfJwU",

  // // Projects — texas-rangers
  // "/rangers-home.mp4": "Jd2VEZx3FY7CY01fx7g6HRZhKEfXsW00SN35QrG2XQxyI",
  // "/mobile-rangers.mp4": "sKfxvjt8nYk2x4rlygy01028D02cjYp6xvJrsq1A7UY1IU",
  // "/rangers-loader.mp4": "l2tqHhsCN700TeLkkvLUV02ZjLv9NpxAFjBnX4IfI2mcE",

  // // Play
  // "/Sequence_01_1.mp4": "sekRXNMagYPUO8M88Hvi7WVtKM24zXse01GVQ3nA2EVE",
  // "/Finalvid.mp4": "IxTPyzrWwF9wk2msosyPLM5WSV5qQz3JjuD4H5HmTXU",
};

export function getMuxPlaybackId(src: string): string | undefined {
  const id = muxPlaybackIds[src];
  return id?.trim() ? id.trim() : undefined;
}
