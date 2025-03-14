// @flow
import getPercentage from '../../get-percentage';
import minScroll from './min-scroll';
import { type AutoScrollConfig } from '../../config';

export default (
  proposedScroll: number,
  dragStartTime: number,
  config: AutoScrollConfig,
): number => {
  const accelerateAt: number = config.durationDampening.accelerateAt;
  const stopAt: number = config.durationDampening.stopDampeningAt;
  const startOfRange: number = dragStartTime;
  const endOfRange: number = stopAt;
  const now: number = Date.now();
  const runTime: number = now - startOfRange;

  // we have finished the time dampening period
  if (runTime >= stopAt) {
    return proposedScroll;
  }

  // Up to this point we know there is a proposed scroll
  // but we have not reached our accelerate point
  // Return the minimum amount of scroll
  if (runTime < accelerateAt) {
    return minScroll;
  }

  const betweenAccelerateAtAndStopAtPercentage: number = getPercentage({
    startOfRange: accelerateAt,
    endOfRange,
    current: runTime,
  });

  const scroll: number =
    proposedScroll * config.ease(betweenAccelerateAtAndStopAtPercentage);

  return Math.ceil(scroll);
};
