"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, BriefcaseMedical, Users } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  {
    name: "Doctor Management",
    href: "/doctor-management",
    icon: BriefcaseMedical,
  },
  { name: "Patient Management", href: "/patient-management", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    setOpen(false);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-[60px] flex items-center justify-center border-b bg-card/50 backdrop-blur-md">
        <h1 className="font-bold text-xl group-data-[collapsible=icon]:hidden tracking-tight">
          HMS <span className="text-primary">Admin</span>
        </h1>
        <div className="hidden group-data-[collapsible=icon]:block font-bold text-primary text-xl">
          H
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background/50">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-2 py-2">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "relative flex items-center gap-3 px-3 h-[45px] transition-all duration-300 ease-in-out rounded-lg overflow-hidden group/btn",
                        "text-muted-foreground hover:text-primary",
                        "hover:bg-primary/10 hover:translate-x-1",
                        isActive && [
                          "bg-primary text-primary-foreground shadow-md shadow-primary/20",
                          "hover:bg-primary hover:text-primary-foreground hover:translate-x-0",
                        ],
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={cn(
                            "size-5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110",
                            isActive && "text-white",
                          )}
                        />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2 bg-background/50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <SidebarMenuButton
              className="h-[45px] gap-3 px-3 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg group/logout cursor-pointer"
              tooltip="Log Out"
            >
              <LogOut className="size-5 transition-transform group-hover/logout:-translate-x-1" />
              <span className="font-medium">Log Out</span>
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
