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
import { create } from "zustand";
import { deleteUser } from "@/app/member/users/user-actions";
import { UserView } from "./users-container";

export const useDeleteUserDialogState = create<DialogState<UserView>>(
  (set) => ({
    isOpen: false,
    toggleModal: () =>
      set((state: DialogState<UserView>) => ({ isOpen: !state.isOpen })),
    data: null,
    setData: (data: UserView) => set(() => ({ data: data })),
  }),
);

export default function DeleteUserDialog(props: DialogState<UserView>) {
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
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
