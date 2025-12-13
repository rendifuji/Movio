import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Film, Building2, CalendarDays } from "lucide-react";
import { Person } from "@/assets/images";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, Separator } from "@/components";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Movies", icon: Film, href: "/admin/movies" },
  { title: "Cinemas", icon: Building2, href: "#" },
  { title: "Schedules", icon: CalendarDays, href: "/admin/schedules" },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="h-14 flex items-start justify-center px-4 whitespace-nowrap border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">
              Movio Admin
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2!">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "overflow-hidden",
                          isActive &&
                            "border-l-4 border-primary! bg-linear-to-r from-primary/20 backdrop-blur-3xl via-primary/10 to-transparent text-primary!",
                          "group-data-[collapsible=icon]:px-2 px-4! rounded-none py-6 text-base!"
                        )}
                      >
                        <Link to={item.href}>
                          <item.icon className="size-6" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm font-medium text-muted-foreground">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Derry</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={Person} alt="User avatar" />
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
