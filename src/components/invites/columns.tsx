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
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DialogState } from "../dialog/dialog-state";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
//
export type InviteWithOwner = {
  id: string;
  token: string;
  remainingUses: number;
  expiresAt: Date;
  ownerId: string;
  username: string;
  picture: string;
};

export const columns = (
  appUrl: string,
  deleteDialogState: DialogState<InviteWithOwner>,
  { canDelete }: { canDelete: boolean },
): ColumnDef<InviteWithOwner>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "token",
    header: "Token",
  },
  {
    accessorKey: "remainingUses",
    header: "Remaining Uses",
  },
  {
    accessorKey: "expiresAt",
    header: "Expiry",
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <div className="text-sm leading-tight">
          {invite.expiresAt.toLocaleDateString()}{" "}
          {invite.expiresAt.toLocaleTimeString()}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Owner",
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={invite.picture} alt={invite.username} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate">{invite.username}</span>
            </div>
          </div>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invite = row.original;

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
                onClick={() => navigator.clipboard.writeText(invite.id)}
              >
                Copy ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${appUrl}/api/auth/login?token=${invite.token}`,
                  )
                }
              >
                Copy URL
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {canDelete ? (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => {
                      deleteDialogState.setData(invite);
                      deleteDialogState.toggleModal();
                    }}
                  >
                    Delete Invite
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
