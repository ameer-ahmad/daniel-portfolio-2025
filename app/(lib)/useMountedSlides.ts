"use client";

import { useEffect, useMemo, useState } from "react";
import { MediaItem } from "@/data/projects";
import { slideContainsVideo } from "@/app/(lib)/mediaSlides";

type MountedSlidesOptions = {
  /** False keeps the gallery in the tree but holds every slide unmounted. */
  enabled: boolean;
  /** Mount the slides either side of the current one so navigation is instant. */
  mountNeighbours: boolean;
  /**
   * Mobile Safari will only keep a couple of video elements alive at once, so
   * neighbouring video slides are skipped there.
   */
  allowVideoNeighbours: boolean;
};

function sameIndices(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/**
 * Returns the slide indices that should stay mounted. Slides are revealed by
 * opacity rather than by mounting, because remounting an <img> costs a decode
 * and remounting a video iframe costs a full player bootstrap.
 *
 * Image slides are never evicted once mounted — they are cheap to keep and it
 * makes backtracking through a project free. Video slides are held to the
 * window so we never accumulate players.
 */
export function useMountedSlides(
  slides: MediaItem[],
  currentIndex: number,
  { enabled, mountNeighbours, allowVideoNeighbours }: MountedSlidesOptions
): number[] {
  const desired = useMemo(() => {
    const count = slides.length;
    if (!enabled || count === 0) return [];

    const safeIndex = Math.min(Math.max(currentIndex, 0), count - 1);
    const indices = new Set<number>([safeIndex]);

    if (mountNeighbours && count > 1) {
      const neighbours = [
        (safeIndex + 1) % count,
        (safeIndex - 1 + count) % count,
      ];
      neighbours.forEach((index) => {
        if (allowVideoNeighbours || !slideContainsVideo(slides[index])) {
          indices.add(index);
        }
      });
    }

    return Array.from(indices).sort((a, b) => a - b);
  }, [slides, currentIndex, enabled, mountNeighbours, allowVideoNeighbours]);

  const [mounted, setMounted] = useState<number[]>(() => desired);

  useEffect(() => {
    setMounted((previous) => {
      if (desired.length === 0) {
        return previous.length === 0 ? previous : [];
      }

      const desiredSet = new Set(desired);
      const retained = previous.filter(
        (index) =>
          index < slides.length &&
          (desiredSet.has(index) || !slideContainsVideo(slides[index]))
      );

      const next = Array.from(new Set([...retained, ...desired])).sort(
        (a, b) => a - b
      );

      return sameIndices(previous, next) ? previous : next;
    });
  }, [desired, slides]);

  // Filter synchronously so a shrink of `slides` (e.g. mobile → desktop)
  // never returns stale out-of-bounds indices before the effect runs.
  return useMemo(
    () => mounted.filter((index) => index < slides.length),
    [mounted, slides.length]
  );
}
