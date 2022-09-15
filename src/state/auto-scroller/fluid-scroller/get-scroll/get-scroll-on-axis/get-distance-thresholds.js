// @flow
// all in pixels
export type DistanceThresholds = {|
  startScrollingFrom: number,
  maxScrollValueAt: number,
|};

// converts the percentages in the config into actual pixel values
export default (): DistanceThresholds => {
  const thresholds: DistanceThresholds = {
    startScrollingFrom: 0.25,
    maxScrollValueAt: 0.05,
  };

  return thresholds;
};
