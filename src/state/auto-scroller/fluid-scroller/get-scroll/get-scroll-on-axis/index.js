// @flow
import type { Spacing } from 'css-box-model';
import type { Axis } from '../../../../../types';
import getValue from './get-value';
import { type AutoScrollConfig } from '../../config';

type GetOnAxisArgs = {|
  distanceToEdges: Spacing,
  dragStartTime: number,
  axis: Axis,
  shouldUseTimeDampening: boolean,
  type: 'vertical' | 'horizontal',
  config: AutoScrollConfig,
|};

export default ({
  distanceToEdges,
  dragStartTime,
  axis,
  shouldUseTimeDampening,
  type,
  config,
}: GetOnAxisArgs): number => {
  const isCloserToEnd: boolean =
    distanceToEdges[axis.end] < distanceToEdges[axis.start];

  let startFrom;

  if (type === 'horizontal') {
    startFrom = isCloserToEnd ? config.rightThreshold : config.leftThreshold;
  } else {
    startFrom = isCloserToEnd ? config.bottomThreshold : config.topThreshold;
  }

  if (isCloserToEnd) {
    return getValue({
      distanceToEdge: distanceToEdges[axis.end],
      thresholds: {
        startScrollingFrom: startFrom,
        maxScrollValueAt: startFrom * config.maxScrollAtPercentage,
      },
      dragStartTime,
      shouldUseTimeDampening,
      config,
    });
  }

  return (
    -1 *
    getValue({
      distanceToEdge: distanceToEdges[axis.start],
      thresholds: {
        startScrollingFrom: startFrom,
        maxScrollValueAt: startFrom * config.maxScrollAtPercentage,
      },
      dragStartTime,
      shouldUseTimeDampening,
      config,
    })
  );
};
