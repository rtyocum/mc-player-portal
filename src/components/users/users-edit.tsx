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
import { PERMISSIONS } from "@/lib/permissions";
import { UserView } from "./users-container";

type Props = {
  state: DialogState<UserView>;
  editable: boolean;
  editablePermissions: boolean;
};

const formSchema = z.object({
  note: z.string().optional(),
  permission: z.number().optional(),
});

export const useEditUserDialogState = create<DialogState<UserView>>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState<UserView>) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: UserView) => set(() => ({ data: data })),
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
      <DialogContent className="sm:max-w-[850px] max-h-screen overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-5">
              <DialogTitle>{props.editable ? "Edit" : "View"} User</DialogTitle>
              <DialogDescription>
                Make changes to the user below.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
              <div className="space-y-4 grow">
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input disabled value={props.state.data?.id} />
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
                                "flex flex-col gap-2 justify-between items-start grow border p-5 border-input shadow-sm rounded-md" +
                                (!props.editablePermissions
                                  ? " opacity-50"
                                  : "")
                              }
                            >
                              {PERMISSIONS.map((permission) => (
                                <div
                                  key={permission.value}
                                  className="flex justify-center items-center gap-2"
                                >
                                  <Checkbox
                                    id={`permission-checkbox-${permission.value}`}
                                    checked={
                                      !!((field?.value ?? 0) & permission.value)
                                    }
                                    onCheckedChange={onCheckedChange(
                                      permission.value,
                                    )}
                                    disabled={
                                      !props.editable ||
                                      !props.editablePermissions
                                    }
                                  />
                                  <label
                                    htmlFor={`permission-checkbox-${permission.value}`}
                                    className="text-sm"
                                  >
                                    {permission.name}
                                  </label>
                                </div>
                              ))}
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
