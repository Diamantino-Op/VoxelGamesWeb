"use client"

import { ChevronDown } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarSeparator,
    SidebarGroupContent,
    SidebarRail
} from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/sidebar/theme-toggle";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { ProjectsSidebarTab } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";

import React from "react";

export function MainSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <ThemeToggle />
                <SidebarSeparator />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <ProjectsSidebarTab />
                <Collapsible defaultOpen className="group/mainSidebarManagement">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Management
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/mainSidebarManagement:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>

                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
            <SidebarFooter>
                <SidebarSeparator />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
