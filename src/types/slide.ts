export type SlideLayout = "cover" | "body" | "closing" | "section";

export type Bullet =
  | string
  | {
      text: string;
      children?: Bullet[];
      hint?: string;
      image?: string;
      video?: string;
      media?: string[];
      clearMedia?: boolean;
    };

export interface Slide {
  id: string;
  layout: SlideLayout;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: Bullet[];
  bulletStyle?: "dash" | "number";
  revealAll?: boolean;
  emphasize?: string;
  notes?: string;
  video?: string;
  videoPosition?: "center" | "right";
  videoMode?: "controls" | "loop";
  image?: string;
  imagePosition?: "center" | "right";
  images?: string[];
  imagesPosition?: "bottom" | "right";
  imagesMode?: "all" | "step";
  imagesLarge?: boolean;
  flashback?: { title: string; video: string; lastBullet?: string };
}
