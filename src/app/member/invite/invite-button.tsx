"use client";

import { Button } from "@/components/ui/button";
import createInvite from "./invite-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import CopyButton from "@/components/ui/copy-button";

export default function InviteButton({ appUrl }: { appUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState("");
  const submit = async () => {
    const { token } = await createInvite();
    if (token) {
      setToken(token);
      setIsOpen(true);
    }
  };
  return (
    <>
      <Button onClick={() => submit()}>Invite</Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              This link expires in 24hrs. This link is one time use.
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please make sure to copy this before closing this dialog. It will
              not be shown again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <CopyButton
            variant="outline"
            text={`${appUrl}/api/auth/login?token=${token}`}
          >
            Copy Invite Link
          </CopyButton>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
