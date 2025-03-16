import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INVITE } from "@/lib/permissions";
import InviteButton from "./invite-button";
import { redirect } from "next/navigation";
import { clientConfig, getSession } from "@/lib/auth";
export default async function Invite() {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;
  if (!session || !(permission & INVITE)) {
    return redirect("/forbidden");
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-10">
      <Card>
        <CardHeader>
          <CardTitle>Send an Invite</CardTitle>
          <CardDescription>
            Use this page to create an invite to send to another player
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <InviteButton appUrl={clientConfig.audience} />
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-gray-500">
            Invites are valid for 24 hours.
          </p>
          <p className="text-sm text-gray-500">
            If you need a longer term invite, please contact an admin.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
