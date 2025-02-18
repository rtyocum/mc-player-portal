import "../globals.css";
import { NavbarPublic } from "@/components/nav/navbar-public";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky left-0 top-0 h-24 bg-background">
        <NavbarPublic />
      </header>
      <main className="grow">{children}</main>
    </div>
  );
}
