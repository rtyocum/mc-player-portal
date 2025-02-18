import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { authorizeUser, getSession } from "@/lib/auth";
import { JOIN_SERVER, MEMBER, VIEW_MEMBERSHIP } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function Membership() {
  const session = await getSession();
  const permission = session?.userInfo?.permission ?? 0;
  if (!(await authorizeUser(VIEW_MEMBERSHIP))) {
    return redirect("/forbidden");
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-10">
      <Card className="min-w-40 max-w-7xl">
        <CardHeader>
          <CardTitle className="text-center">Membership Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {(permission & MEMBER) === MEMBER ? (
            // Custom badge with color
            <>
              <span className="bg-green-700 px-3 py-1 rounded-full">
                Member
              </span>
              <p className="mt-5">You have all privileges of a member.</p>
            </>
          ) : // 1 is default permission, we want to check if the user has more than 1 permission
          permission & (MEMBER - VIEW_MEMBERSHIP) ? (
            <>
              <span className="bg-yellow-700 px-3 py-1 rounded-full">
                Restricted Member
              </span>
              <p className="mt-5">You have limited member privileges.</p>
            </>
          ) : permission & VIEW_MEMBERSHIP ? (
            <>
              <span className="bg-red-700 px-3 py-1 rounded-full">
                Non Member
              </span>
              <p className="mt-5">You are not a member.</p>
            </>
          ) : null}

          {permission & JOIN_SERVER ? (
            <>
              <CardTitle className="text-center mt-5">
                Connection Details
              </CardTitle>
              <CopyButton
                variant="outline"
                text="mc.rtyocum.dev"
                className="mt-5"
              >
                Server Address: mc.rtyocum.dev
              </CopyButton>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
