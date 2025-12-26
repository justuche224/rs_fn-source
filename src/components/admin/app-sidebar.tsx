import type * as React from "react";
import {
  ArrowDownCircle,
  ClockIcon,
  CreditCard,
  LayoutDashboardIcon,
  LineChart,
  ListIcon,
  SettingsIcon,
  TrendingUp,
  ChevronDown,
  Users2,
  Wallet,
  ShoppingBag,
  ShieldAlert,
  Share,
  Banknote,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavSecondary } from "@/components/admin/nav-secondary";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Plans",
      url: "/admin/plans",
      icon: TrendingUp,
    },
    {
      title: "Wallets",
      url: "/admin/wallets",
      icon: Wallet,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: ShoppingBag,
    },
    {
      title: "Product Categories",
      url: "/admin/categories",
      icon: ListIcon,
    },
    {
      title: "KYC verifications",
      url: "/admin/kyc",
      icon: ShieldAlert,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users2,
    },
  ],
  navHistory: [
    {
      title: "Investments",
      url: "/admin/investments",
      icon: CreditCard,
    },
    {
      title: "Withdrawals",
      url: "/admin/withdrawals",
      icon: ArrowDownCircle,
    },
    {
      title: "Deposits",
      url: "/admin/deposits",
      icon: LineChart,
    },
    {
      title: "Transfers",
      url: "/admin/transfers",
      icon: Share,
    },
    {
      title: "Liquidations",
      url: "/admin/liquidations",
      icon: Banknote,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/account/profile",
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/admin">
                <img src="/assets/images/logo.png" className="h-10 w-full" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <Collapsible className="w-full" defaultOpen={true}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <ClockIcon className="h-4 w-4" />
                  <span>Transactions</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {data.navHistory.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={item.url}>
                          <item.icon className="h-3.5 w-3.5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
