import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import ProjectRequestMenu from "./sidebarMenu/projectRequestMenu";
import SystemConfigMenu from "./sidebarMenu/systemConfigMenu";
import { Permission } from "@/types/User";
import { BrandLogo } from "./appSidebarlogo"; // นำเข้า Component ที่สร้างใหม่

export function AppSideBar({ permission }: { permission: Permission }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="navbar p-0 bg-kpmg-blue">
        <BrandLogo />
      </SidebarHeader>
      
      <SidebarContent>
        <ProjectRequestMenu isPrAdmin={permission.isPRAdmin} />
        {permission.isSystemConfig && (
          <>
            <hr className="mx-2 border-1 opacity-20" />
            <SystemConfigMenu />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}