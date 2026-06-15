import { governedCaseFileFixture } from "../../../../../packages/domain/src/governed-casefile";

import { toControlRoomSource } from "./to-control-room-source";
import { toControlRoomViewModel } from "./to-control-room-view-model";

export const controlRoomDemoSource = toControlRoomSource(
  governedCaseFileFixture,
);

export const controlRoomDemoViewModel = toControlRoomViewModel(
  controlRoomDemoSource,
);
