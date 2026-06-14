import { useEffect } from "react";
import { slides } from "../slides";
import type { Slide } from "../types/slide";
import { isVideoUrl } from "../utils";

const preloadedUrls = new Set<string>();

function preloadImage(url: string) {
  if (preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const image = new Image();
  image.src = url;
}

function imageUrlsForSlide(slide: Slide): string[] {
  const urls: string[] = [];
  if (slide.image) urls.push(slide.image);
  slide.images?.forEach((url) => urls.push(url));
  slide.bullets?.forEach((bullet) => {
    if (typeof bullet !== "string") {
      if (bullet.image) urls.push(bullet.image);
      bullet.media?.forEach((url) => {
        if (!isVideoUrl(url)) urls.push(url);
      });
    }
  });
  return urls;
}

export function useImagePreload(slideIndex: number) {
  useEffect(
    function preloadAdjacentImages() {
      for (const offset of [slideIndex, slideIndex - 1, slideIndex + 1]) {
        const slide = slides[offset];
        if (slide) imageUrlsForSlide(slide).forEach(preloadImage);
      }
    },
    [slideIndex],
  );

  useEffect(function warmRemainingImagesWhenIdle() {
    const warm = () => {
      for (const slide of slides) imageUrlsForSlide(slide).forEach(preloadImage);
    };
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(warm, 1500);
    return () => window.clearTimeout(timer);
  }, []);
}
