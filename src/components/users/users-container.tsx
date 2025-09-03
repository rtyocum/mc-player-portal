"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useSession } from "@/hooks/use-session";
import { DELETE_USER, EDIT_PERMISSIONS, EDIT_USER } from "@/lib/permissions";
import DeleteUserDialog, { useDeleteUserDialogState } from "./user-delete";
import EditUserDialog, { useEditUserDialogState } from "./users-edit";

export type UserView = {
  id: string;
  uuid?: string;
  username: string;
  email?: string;
  picture: string;
  name?: string;
  permission: number;
  note: string | null;
};

export default function UsersContainer({ users }: { users: UserView[] }) {
  const { session } = useSession();
  const canEdit = !!((session?.user.permission ?? 0) & EDIT_USER);
  const canEditPermissions = !!(
    (session?.user.permission ?? 0) & EDIT_PERMISSIONS
  );
  const canDelete = !!((session?.user.permission ?? 0) & DELETE_USER);

  const editUserDialogState = useEditUserDialogState();
  const deleteUserDialogState = useDeleteUserDialogState();

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns(editUserDialogState, deleteUserDialogState, {
            canEdit,
            canDelete,
          })}
          data={users}
        />
      </div>

      {/* INFO: The key prop is to force Next.JS to reload if a different user is edited. We append "edit" and "delete" otherwise the key props are the same. */}
      <EditUserDialog
        key={editUserDialogState.data?.id + "edit"}
        state={editUserDialogState}
        editable={canEdit}
        editablePermissions={canEditPermissions}
      />
      <DeleteUserDialog
        key={deleteUserDialogState.data?.id + "delete"}
        {...deleteUserDialogState}
      />
    </>
  );
}
