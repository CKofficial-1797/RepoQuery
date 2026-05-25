'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useProject from "../../../hooks/use-project"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Bot,
  Presentation,
  CreditCard,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];
// const projects = [
//   { name: "Project 1", url: "/projects/1" },
//   { name: "Project 2", url: "/projects/2" },
//   { name: "Project 3", url: "/projects/3" },
// ];
export default function AppSidebar() {
  const pathname = usePathname();
  const {projects ,projectId, setProjectId} = useProject();
  const {open} =useSidebar();
  
  return (
    <Sidebar collapsible="icon" variant ="floating">
        <SidebarHeader>
            <div className=" flex items-center gap-2">
                <Image src="/THORFIN.jpg" alt="Logo" width={40} height={40} />
                {open&&(
                     <h1 className ="text-x1 font-bold text-primary/80">
                        RepoQuery</h1>
                )}
            </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-2",
                          active &&
                            "bg-primary text-white hover:bg-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
      <SidebarGroupLabel>Your Projects</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {projects?.map((project) => {
            // const active = pathname === project.url;

            return (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton asChild>
                  
                  <div onClick={
                    ()=>{
                      setProjectId(project.id)
                      
                    }
                  }
                    className={cn(
                      "flex items-center gap-2"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-sm border size-6 flex items-center justify-center text-sm",
                      project.id === projectId && "bg-primary text-white"
                      )}
                    >
                      {project.name[0]}
                    </div>

                    <span>{project.name}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {open && (
             <SidebarMenuItem>
            <Link href="/create">
                <Button size="sm" variant="outline" className="w-fit">
                <Plus />
                Create Project
                </Button>
            </Link>
            </SidebarMenuItem>
          )}
         

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
