import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/nav/navbar";
import { MainSidebar } from "@/components/nav/main-sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SecureLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    return redirect("/api/auth/login");
  }
  return (
    <SidebarProvider>
      <MainSidebar />
      <div className="flex h-screen w-full flex-col">
        <header className="sticky left-0 top-0 h-24 bg-background">
          <Navbar />
        </header>
        <main className="grow">{children}</main>
        <footer className="flex h-24 flex-col items-center justify-end p-5">
          <p className="text-center">© 2024 Ryan Yocum</p>
          <p>
            Contact{" "}
            <a href="mailto:minecraft@rtyocum.dev">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                minecraft@rtyocum.dev
              </code>{" "}
              for any questions
            </a>
          </p>
        </footer>
      </div>
    </SidebarProvider>
  );
}
