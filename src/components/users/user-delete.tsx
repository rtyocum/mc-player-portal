"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DialogState } from "@/components/dialog/dialog-state";
import { User } from "@prisma/client";
import { create } from "zustand";
import { deleteUser } from "@/app/member/users/user-actions";
import { useEffect, useState } from "react";

export const useDeleteItemDialogState = create<DialogState<User>>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState<User>) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: User) => set(() => ({ data: data })),
}));

export default function DeleteUserDialog(props: DialogState<User>) {
  const [deleteTimer, setDeleteTimer] = useState<number>(0);

  useEffect(() => {
    setDeleteTimer(5);
    const timer = setInterval(() => {
      setDeleteTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
          <DialogDescription>
            They will immedietely lose access to this page, their invites
            deactivated, and no longer be able to login.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => {
              if (!props.data) return;
              deleteUser(props.data.id);
              props.toggleModal();
            }}
            disabled={deleteTimer > 0}
          >
            Delete {deleteTimer > 0 ? <>({deleteTimer}s)</> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
