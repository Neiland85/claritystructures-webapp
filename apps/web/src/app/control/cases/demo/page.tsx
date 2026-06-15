import { redirect } from "next/navigation";

import { canonicalControlRoomDemoCasePath } from "@/features/control-room/control-room-demo-route";

export default function ControlRoomDemoRedirectPage() {
  redirect(canonicalControlRoomDemoCasePath);
}
