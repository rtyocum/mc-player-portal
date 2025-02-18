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

import { Input } from "@/components/ui/input";
import { DialogState } from "@/components/dialog/dialog-state";
import { User } from "@prisma/client";
import { create } from "zustand";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateUser } from "@/app/member/users/user-actions";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  ADD_USER,
  DELETE_USER,
  EDIT_PERMISSIONS,
  EDIT_USER,
  INVITE,
  JOIN_SERVER,
  VIEW_MEMBERSHIP,
  VIEW_USERS,
} from "@/lib/permissions";

type Props = {
  state: DialogState<User>;
  editable: boolean;
  editablePermissions: boolean;
};

const formSchema = z.object({
  note: z.string().optional(),
  permission: z.number().optional(),
});

export const useEditUserDialogState = create<DialogState<User>>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState<User>) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: User) => set(() => ({ data: data })),
}));

export default function EditUserDialog(props: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: props.state.data?.note ?? undefined,
      permission: props.state.data?.permission ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.state.toggleModal();
    if (!props.editable) return;
    if (props.state.data == null) return;
    updateUser(props.state.data?.id, values);
  }

  return (
    <Dialog open={props.state.isOpen} onOpenChange={props.state.toggleModal}>
      <DialogContent className="sm:max-w-[850px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-5">
              <DialogTitle>{props.editable ? "Edit" : "View"} User</DialogTitle>
              <DialogDescription>
                Make changes to the user below.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-between gap-5">
              <div className="space-y-4 grow">
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input disabled value={props.state.data?.id} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>UUID</FormLabel>
                  <FormControl>
                    <Input disabled value={props.state.data?.uuid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled value={props.state.data?.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled value={props.state.data?.email} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled value={props.state.data?.username} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <div className="space-y-4 grow">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!props.editable} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permission"
                  render={({ field }) => {
                    const onCheckedChange =
                      (value: number) => (checked: CheckedState) => {
                        if (checked === true) {
                          field.onChange((field.value ?? 0) | value);
                        } else if (checked === false) {
                          field.onChange((field.value ?? 0) & ~value);
                        }
                      };
                    return (
                      <FormItem>
                        <FormLabel>Permissions</FormLabel>
                        <FormControl>
                          <div className="flex gap-10">
                            <div
                              className={
                                "flex flex-col gap-2 justify-between items-start grow p-5 border border-input shadow-sm rounded-md" +
                                (!props.editablePermissions
                                  ? " opacity-50"
                                  : "")
                              }
                            >
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={
                                    !!((field?.value ?? 0) & VIEW_MEMBERSHIP)
                                  }
                                  onCheckedChange={onCheckedChange(
                                    VIEW_MEMBERSHIP,
                                  )}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">View Membership</p>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={
                                    !!((field?.value ?? 0) & JOIN_SERVER)
                                  }
                                  onCheckedChange={onCheckedChange(JOIN_SERVER)}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">Join Server</p>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={!!((field?.value ?? 0) & INVITE)}
                                  onCheckedChange={onCheckedChange(INVITE)}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">Invite</p>
                              </div>
                              <p className="text-sm">Member Permissions</p>
                            </div>
                            <div
                              className={
                                "flex flex-col gap-2 justify-between items-start grow p-5 border border-input shadow-sm rounded-md" +
                                (!props.editablePermissions
                                  ? " opacity-50"
                                  : "")
                              }
                            >
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={!!((field?.value ?? 0) & VIEW_USERS)}
                                  onCheckedChange={onCheckedChange(VIEW_USERS)}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">View Users</p>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={!!((field?.value ?? 0) & ADD_USER)}
                                  onCheckedChange={onCheckedChange(ADD_USER)}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">Add User</p>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={!!((field?.value ?? 0) & EDIT_USER)}
                                  onCheckedChange={onCheckedChange(EDIT_USER)}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">Edit User</p>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Checkbox
                                  checked={
                                    !!((field?.value ?? 0) & EDIT_PERMISSIONS)
                                  }
                                  onCheckedChange={onCheckedChange(
                                    EDIT_PERMISSIONS,
                                  )}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                />
                                <p className="text-sm">Edit User Permissions</p>
                              </div>
                              <div className="flex  justify-center items-center gap-2">
                                <Checkbox
                                  checked={
                                    !!((field?.value ?? 0) & DELETE_USER)
                                  }
                                  onCheckedChange={onCheckedChange(DELETE_USER)}
                                  disabled={
                                    !props.editable ||
                                    !props.editablePermissions
                                  }
                                  value={128}
                                />
                                <p className="text-sm">Delete User</p>
                              </div>
                              <p className="text-sm">Admin Permissions</p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              {props.editable ? (
                <Button type="submit">Save Changes</Button>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                onClick={props.state.toggleModal}
              >
                {props.editable ? "Cancel" : "Close"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
