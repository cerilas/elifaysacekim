export interface HeroAnimationState {
  progress: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookY: number;
  skinOpacity: number;
  tissueOpacity: number;
  reveal: number;
  target: number;
  graftVisibility: number;
  graftLift: number;
  graftBrightness: number;
  growth: number;
  ripple: number;
  particleProgress: number;
  rotation: number;
}

export interface SceneProps {
  animation: React.RefObject<HeroAnimationState>;
  mobile: boolean;
  reducedMotion: boolean;
}

export interface FolliclePlacement {
  x: number;
  z: number;
  height: number;
  angle: number;
  length: number;
  width: number;
}
