import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { systemConfigMenu } from "@/menu";

export default function SystemConfigMenu() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base text-blue-800">
        Access Control
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {systemConfigMenu.map((subItem, index) => (
            <Tooltip key={index}>
              <TooltipTrigger>
                <SidebarMenuItem key={subItem.title}>
                  <SidebarMenuButton asChild>
                    <Link href={subItem.url}>
                      <subItem.icon className="text-[#1E49E2]"/>
                      <span className="text-[#1E49E2] opacity-80">{subItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </TooltipTrigger>
              <TooltipContent side="right">{subItem.title}</TooltipContent>
            </Tooltip>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
