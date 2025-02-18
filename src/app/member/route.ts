import { redirect } from "next/navigation";

export function GET() {
  return redirect("/member/home");
}
