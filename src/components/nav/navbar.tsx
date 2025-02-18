import ThemeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export async function Navbar() {
  return (
    <>
      <nav className="flex w-full items-center justify-between p-4 text-foreground">
        <div className="flex grow basis-0 items-center justify-start space-x-4">
          <SidebarTrigger />
        </div>

        <div className="flex grow basis-0 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </nav>
      <Separator />
    </>
  );
}
