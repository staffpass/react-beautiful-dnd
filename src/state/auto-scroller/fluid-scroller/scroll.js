// @flow
import { type Position, type Rect } from 'css-box-model';
import type {
  DraggingState,
  DroppableId,
  DraggableDimension,
  DroppableDimension,
  Viewport,
} from '../../../types';
import getBestScrollableDroppable from './get-best-scrollable-droppable';
import whatIsDraggedOver from '../../droppable/what-is-dragged-over';
import getWindowScrollChange from './get-window-scroll-change';
import getDroppableScrollChange from './get-droppable-scroll-change';

type Args = {|
  state: DraggingState,
  dragStartTime: number,
  shouldUseTimeDampening: boolean,
  scrollWindow: (scroll: Position) => void,
  scrollDroppable: (id: DroppableId, scroll: Position) => void,
|};

let timerId = null;
let scrollStarted = false;
let currentScrollableHeight = null;
let currentScrollableWidth = null;

export default ({
  state,
  dragStartTime,
  shouldUseTimeDampening,
  scrollWindow,
  scrollDroppable,
}: Args): void => {
  const center: Position = state.current.page.borderBoxCenter;
  const draggable: DraggableDimension =
    state.dimensions.draggables[state.critical.draggable.id];
  const subject: Rect = draggable.page.marginBox;
  // 1. Can we scroll the viewport?
  if (state.isWindowScrollAllowed) {
    const viewport: Viewport = state.viewport;
    const change: ?Position = getWindowScrollChange({
      dragStartTime,
      viewport,
      subject,
      center,
      shouldUseTimeDampening,
    });

    if (change) {
      scrollWindow(change);
      return;
    }
  }

  const droppable: ?DroppableDimension = getBestScrollableDroppable({
    center,
    destination: whatIsDraggedOver(state.impact),
    droppables: state.dimensions.droppables,
  });

  if (!droppable) {
    return;
  }

  const change: ?Position = getDroppableScrollChange({
    dragStartTime,
    droppable,
    subject,
    center,
    shouldUseTimeDampening,
  });

  if (
    (currentScrollableWidth &&
      currentScrollableHeight &&
      (currentScrollableWidth !== droppable.frame.scrollSize.scrollWidth ||
        currentScrollableHeight !== droppable.frame.scrollSize.scrollHeight)) ||
    !change
  ) {
    window.clearTimeout(timerId);
    timerId = null;
    currentScrollableWidth = null;
    currentScrollableHeight = null;
    scrollStarted = false;
  }

  if (change && !timerId) {
    currentScrollableWidth = droppable.frame.scrollSize.scrollWidth;
    currentScrollableHeight = droppable.frame.scrollSize.scrollHeight;

    timerId = window.setTimeout(() => {
      scrollStarted = true;
      scrollDroppable(droppable.descriptor.id, change);
    }, droppable.descriptor.autoScrollConfig.triggerDelay);
    return;
  }

  if (change && scrollStarted) {
    scrollDroppable(droppable.descriptor.id, change);
  }
};
