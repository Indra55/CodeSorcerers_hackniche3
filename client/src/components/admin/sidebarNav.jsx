import Link from "next/link";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarNav({ navigation, getIcon }) {
  return (
    <SidebarMenu>
      {navigation.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild isActive={item.id === "dashboard"}>
              <Link href="#">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}