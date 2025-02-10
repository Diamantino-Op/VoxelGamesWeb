import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, SquarePlus } from "lucide-react";

import React from "react";

export function ProjectsSidebarTab() {
    return (
        <Collapsible defaultOpen className="group/mainSidebarProjects">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        Projects
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/mainSidebarProjects:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <React.Suspense fallback={<NavProjectsSkeleton />}>
                            <NavProjects />
                        </React.Suspense>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function NewProjectButton() {
    return (
        <SidebarMenuItem key="NewProject">
            <SidebarMenuButton asChild>
                <a href="#">
                    <SquarePlus />
                    <span>New Project</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function NavProjectsSkeleton() {
    return (
        <SidebarMenu>
            {Array.from({ length: 5 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
            ))}
            <NewProjectButton />
        </SidebarMenu>
    )
}

export function NavProjects() {
    const data = null;
    const isLoading = true;

    if (isLoading) {
        return (
            <NavProjectsSkeleton />
        )
    }

    if (!data) {
        return null;
    }

    //TODO: Add type
    return (
        <SidebarMenu>
            {data.map((project: any) => (
                <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                        <a href={project.url}>
                            <project.icon />
                            <span>{project.name}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            <NewProjectButton />
        </SidebarMenu>
    )
}
