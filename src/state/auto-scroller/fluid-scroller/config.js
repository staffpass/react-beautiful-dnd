// @flow

export type AutoScrollConfig = {
  maxScrollAtPercentage?: number,
  maxPixelScroll?: number,
  topThreshold?: number,
  bottomThreshold?: number,
  leftThreshold?: number,
  rightThreshold?: number,
  triggerDelay?: number,
  ease?: (percentage: number) => number,
  durationDampening?: {
    stopDampeningAt?: number,
    accelerateAt?: number,
  },
};

// Values used to control how the fluid auto scroll feels
const config = {
  // percentage distance from edge of container:
  maxScrollAtPercentage: 0.2,
  // pixels per frame
  maxPixelScroll: 14,
  topThreshold: 100,
  bottomThreshold: 100,
  leftThreshold: 100,
  rightThreshold: 100,

  triggerDelay: 500,

  // A function used to ease a percentage value
  // A simple linear function would be: (percentage) => percentage;
  // percentage is between 0 and 1
  // result must be between 0 and 1
  ease: (percentage: number): number => Math.pow(percentage, 2),

  durationDampening: {
    // ms: how long to dampen the speed of an auto scroll from the start of a drag
    stopDampeningAt: 1200,
    // ms: when to start accelerating the reduction of duration dampening
    accelerateAt: 360,
  },
};

export default config;
