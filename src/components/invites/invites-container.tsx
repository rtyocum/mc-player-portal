"use client";

import { columns, InviteWithOwner } from "./columns";
import { DataTable } from "./data-table";
import { useSession } from "@/hooks/use-session";
import { ADD_INVITE, DELETE_INVITE } from "@/lib/permissions";
import AddInviteDialog, {
  LimitedUser,
  useAddInviteDialogState,
} from "./invites-add";
import DeleteInviteDialog, {
  useDeleteInviteDialogState,
} from "./invite-delete";

export default function InvitesContainer({
  invites,
  users,
}: {
  invites: InviteWithOwner[];
  users: LimitedUser[];
}) {
  const { session } = useSession();
  const canAdd = !!((session?.user.permission ?? 0) & ADD_INVITE);
  const canDelete = !!((session?.user.permission ?? 0) & DELETE_INVITE);

  const addInviteDialogState = useAddInviteDialogState();
  const deleteInviteDialogState = useDeleteInviteDialogState();

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns(deleteInviteDialogState, {
            canDelete,
          })}
          openCreateDialog={addInviteDialogState.toggleModal}
          data={invites}
          showCreateButton={canAdd}
        />
      </div>
      <AddInviteDialog state={addInviteDialogState} users={users} />

      <DeleteInviteDialog
        key={deleteInviteDialogState.data?.id}
        {...deleteInviteDialogState}
      />
    </>
  );
}
