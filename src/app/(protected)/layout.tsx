'use client';

import React from "react";
import { SidebarProvider ,SidebarTrigger} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import AppSidebar from "./dashboard/app-sidebar";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full m-2">
        <div className="flex items-center gap-2 border border-sidebar-border bg-sidebar shadow rounded-md p-2 px-4">
          {/* <SearchBar /> */}
            <SidebarTrigger className =""/>
          <div className="ml-auto" />
            

          <UserButton />
        </div>

        <div className="mt-2 border border-sidebar-border bg-sidebar shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
