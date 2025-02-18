import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function About() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-10">
      <Card className="min-w-40 max-w-7xl">
        <CardHeader>
          <CardTitle>Welcome to Player Portal!</CardTitle>
          <CardDescription>
            This system allows you to manage your server membership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            You can use this system to:
          </p>
          <ul className="list-disc list-inside">
            <li>View your server membership</li>
            <li>Invite other players</li>
            <li>Leave the server</li>
          </ul>

          <div className="flex justify-center mt-5"></div>
        </CardContent>
      </Card>
    </div>
  );
}
