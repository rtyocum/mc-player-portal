"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DialogState } from "../dialog/dialog-state";
import { UserView } from "./users-container";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = (
  editDialogState: DialogState<UserView>,
  deleteDialogState: DialogState<UserView>,
  {
    canEdit,
    canDelete,
    canViewPersonalInfo,
  }: {
    canEdit: boolean;
    canDelete: boolean;
    canViewPersonalInfo: boolean;
  },
): ColumnDef<UserView>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  ...(canViewPersonalInfo
    ? [
        {
          accessorKey: "name",
          header: ({ column }: HeaderContext<UserView, unknown>) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        },
        {
          accessorKey: "email",
          header: ({ column }: HeaderContext<UserView, unknown>) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        },
      ]
    : []),
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  editDialogState.setData(user);
                  editDialogState.toggleModal();
                }}
              >
                {canEdit ? "Edit User" : "View User"}
              </DropdownMenuItem>
              {canDelete ? (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => {
                      deleteDialogState.setData(user);
                      deleteDialogState.toggleModal();
                    }}
                  >
                    Delete User
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
