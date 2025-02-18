"use client";

import { UserPlus, UserRoundCog, Users } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { INVITE, VIEW_MEMBERSHIP, VIEW_USERS } from "@/lib/permissions";
import { useSession } from "@/hooks/use-session";

export function SidebarNav() {
  const { session } = useSession();
  const permission = session?.userInfo?.permission ?? 0;
  const { isMobile, state, toggleSidebar } = useSidebar();
  const closeSidebar = () => {
    if (isMobile && state === "expanded") {
      toggleSidebar();
    }
  };
  return (
    <>
      {permission & (VIEW_MEMBERSHIP + INVITE) ? (
        <SidebarGroup>
          <SidebarGroupLabel>Membership</SidebarGroupLabel>
          <SidebarMenu>
            {permission & VIEW_MEMBERSHIP ? (
              <SidebarMenuItem>
                <Link href="/member/membership">
                  <SidebarMenuButton
                    tooltip="Membership"
                    onClick={closeSidebar}
                  >
                    <Users />
                    <span>Membership</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ) : null}
            {permission & INVITE ? (
              <SidebarMenuItem>
                <Link href="/member/invite">
                  <SidebarMenuButton
                    tooltip="Invite a Friend"
                    onClick={closeSidebar}
                  >
                    <UserPlus />
                    <span>Invite a Friend</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarGroup>
      ) : null}
      {permission & VIEW_USERS ? (
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarMenu>
            {permission & VIEW_USERS ? (
              <SidebarMenuItem>
                <Link href="/member/users">
                  <SidebarMenuButton
                    tooltip="Membership"
                    onClick={closeSidebar}
                  >
                    <UserRoundCog />
                    <span>Users</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarGroup>
      ) : null}
    </>
  );
}
