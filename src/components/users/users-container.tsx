"use client";

import { User } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useSession } from "@/hooks/use-session";
import { DELETE_USER, EDIT_PERMISSIONS, EDIT_USER } from "@/lib/permissions";
import { useDeleteItemDialogState } from "./user-delete";
import { useEditUserDialogState } from "./users-edit";

export default function UsersContainer({ users }: { users: User[] }) {
  const { session } = useSession();
  const canEdit = ((session?.user.permission || 0) & EDIT_USER) !== 0;
  const canEditPermissions =
    ((session?.user.permission || 0) & EDIT_PERMISSIONS) !== 0;
  const canDelete = ((session?.user.permission || 0) & DELETE_USER) !== 0;

  const editUserDialogState = useEditUserDialogState();
  const deleteUserDialogState = useDeleteItemDialogState();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns(editUserDialogState, deleteUserDialogState, {
          canEdit,
          canEditPermissions,
          canDelete,
        })}
        data={users}
      />
    </div>
  );
}
