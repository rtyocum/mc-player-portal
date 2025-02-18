"use client";

import { Button } from "@/components/ui/button";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      variant={"outline"}
      size="icon"
    >
      {isDark ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-white transition-all dark:rotate-0 dark:scale-100" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-accent-foreground transition-all dark:-rotate-90 dark:scale-0" />
      )}
    </Button>
  );
}
