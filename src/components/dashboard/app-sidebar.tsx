import type * as React from "react";
import {
  ArrowDownCircle,
  ClockIcon,
  CreditCard,
  HistoryIcon,
  LayoutDashboardIcon,
  LineChart,
  ListIcon,
  SettingsIcon,
  Share2Icon,
  TrendingUp,
  ChevronDown,
  User,
  ShieldAlert,
  UserPen,
  Wallet,
  Share,
  DollarSign,
  Banknote,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
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
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Plans",
      url: "/dashboard/plans",
      icon: ListIcon,
    },
    {
      title: "Deposit",
      url: "/dashboard/deposit",
      icon: ArrowDownCircle,
    },
    {
      title: "Transfer",
      url: "/dashboard/transfer",
      icon: Share,
    },
    {
      title: "Withdraw",
      url: "/dashboard/withdraw",
      icon: CreditCard,
    },
    {
      title: "Invest",
      url: "/dashboard/plans",
      icon: TrendingUp,
    },
    {
      title: "Referrals",
      url: "/dashboard/referrals",
      icon: Share2Icon,
    },
  ],
  navHistory: [
    {
      title: "Withdraw History",
      url: "/dashboard/withdraw-history",
      icon: CreditCard,
    },
    {
      title: "Deposit History",
      url: "/dashboard/deposit-history",
      icon: ArrowDownCircle,
    },
    {
      title: "Investment History",
      url: "/dashboard/investment-history",
      icon: LineChart,
    },
    {
      title: "Transfer History",
      url: "/dashboard/transfer-history",
      icon: Share,
    },
    {
      title: "Liquidation History",
      url: "/dashboard/liquidation-history",
      icon: Banknote,
    },
    {
      title: "All History",
      url: "/dashboard/all-history",
      icon: HistoryIcon,
    },
  ],
  navAccount: [
    {
      title: "Profile",
      url: "/dashboard/account/profile",
      icon: UserPen,
    },
    {
      title: "Kyc",
      url: "/dashboard/account/kyc",
      icon: ShieldAlert,
    },
    {
      title: "Wallet",
      url: "/dashboard/account/wallet",
      icon: Wallet,
    },
    {
      title: "Liquidate assets",
      url: "/dashboard/account/liquidate",
      icon: DollarSign,
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
              <Link to="/dashboard">
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
                  <span>History</span>
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

          <Collapsible className="w-full" defaultOpen={true}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span>Account</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {data.navAccount.map((item) => (
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
