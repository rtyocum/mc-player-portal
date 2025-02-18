"use client";

import { Copy } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";

export default function CopyButton({
  variant = "default",
  children,
  text,
  ...props
}: {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  children: React.ReactNode;
  text: string;
  [key: string]: unknown;
}) {
  return (
    <Button
      variant={variant}
      {...props}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard!");
      }}
    >
      {children}
      <Copy />
    </Button>
  );
}
