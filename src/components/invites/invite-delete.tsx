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
import { InviteWithOwner } from "./columns";
import { deleteInvite } from "@/app/member/invites/invite-actions";

export const useDeleteInviteDialogState = create<DialogState<InviteWithOwner>>(
  (set) => ({
    isOpen: false,
    toggleModal: () =>
      set((state: DialogState<InviteWithOwner>) => ({ isOpen: !state.isOpen })),
    data: null,
    setData: (data: InviteWithOwner) => set(() => ({ data: data })),
  }),
);

export default function DeleteInviteDialog(
  props: DialogState<InviteWithOwner>,
) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle>
            Are you sure you want to delete this invite?
          </DialogTitle>
          <DialogDescription>
            No one will be able to use this invite to join the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => {
              if (!props.data) return;
              deleteInvite(props.data.id);
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
