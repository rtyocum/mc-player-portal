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
import { addDays, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { DialogState } from "@/components/dialog/dialog-state";
import { create } from "zustand";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addInvite } from "@/app/member/invites/invite-actions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { InviteWithOwner } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type LimitedUser = {
  id: string;
  username: string;
  picture: string;
  name?: string;
};

export interface AddInviteDialogProps {
  users: LimitedUser[];
  state: DialogState<InviteWithOwner>;
}

const formSchema = z.object({
  remainingUses: z.number().int().positive().optional(),
  expiresAt: z.date().optional(),
  ownerId: z.string().optional(),
});

export const useAddInviteDialogState = create<DialogState<InviteWithOwner>>(
  (set) => ({
    isOpen: false,
    toggleModal: () =>
      set((state: DialogState<InviteWithOwner>) => ({ isOpen: !state.isOpen })),
    data: null,
    setData: (data: InviteWithOwner) => set(() => ({ data: data })),
  }),
);

export default function AddInviteDialog(props: AddInviteDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remainingUses: 1,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      ownerId: props.state.data?.ownerId,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.state.toggleModal();
    addInvite(values);
  }

  return (
    <Dialog open={props.state.isOpen} onOpenChange={props.state.toggleModal}>
      <DialogContent className="sm:max-w-[850px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-5">
              <DialogTitle>Add Invite</DialogTitle>
              <DialogDescription>
                Create a new invite with custom settings.
              </DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="remainingUses"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Number of Uses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder=""
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        value={field.value?.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-5">
                    <FormLabel>Expiry Date</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(addDays(new Date(), parseInt(value)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the date the invite will expire.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem className="flex flex-col mb-5">
                  <FormLabel>Owner</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[240px] justify-between h-12",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? (() => {
                                const user = props.users.find(
                                  (u) => u.id === field.value,
                                );
                                return (
                                  <>
                                    <Avatar className="h-9 w-8 rounded-lg">
                                      <AvatarImage
                                        src={user?.picture}
                                        alt={user?.username}
                                      />
                                      <AvatarFallback className="rounded-lg">
                                        CN
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                      <span className="truncate font-semibold">
                                        {user?.username}
                                      </span>
                                      {user?.name ? (
                                        <span className="truncate text-xs">
                                          {user?.name}
                                        </span>
                                      ) : null}
                                    </div>
                                  </>
                                );
                              })()
                            : "Select an owner"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup>
                            {props.users.map((user) => (
                              <CommandItem
                                value={user.id}
                                key={user.id}
                                onSelect={() => {
                                  form.setValue("ownerId", user.id);
                                }}
                              >
                                <Avatar className="h-9 w-8 rounded-lg">
                                  <AvatarImage
                                    src={user.picture}
                                    alt={user.username}
                                  />
                                  <AvatarFallback className="rounded-lg">
                                    CN
                                  </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-semibold">
                                    {user.username}
                                  </span>
                                  {user.name ? (
                                    <span className="truncate text-xs">
                                      {user.name}
                                    </span>
                                  ) : null}
                                </div>

                                <Check
                                  className={cn(
                                    "ml-auto",
                                    user.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the user that will own the invite. It stop
                    functioning if this user looses access.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={props.state.toggleModal}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
