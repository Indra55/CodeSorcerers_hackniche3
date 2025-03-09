"use client";

import { useState } from "react";
import { BarChart, LineChart, PieChart, DonutChart } from "./ChartComponent.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  HelpCircle,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Constants
const CHART_COLORS = ["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];
const ICON_SIZE = { width: 16, height: 16 };

// Mock data for the admin dashboard
const dashboardData = {
  overview: {
    totalRevenue: "₹24,56,789",
    revenueGrowth: 12.5,
    totalOrders: "8,456",
    ordersGrowth: 8.2,
    totalUsers: "12,345",
    usersGrowth: 15.3,
    totalProducts: "5,678",
    productsGrowth: 5.7,
    conversionRate: 3.2,
    conversionGrowth: 0.5,
  },
  revenueData: [
    { name: "Jan", revenue: 1245000 },
    { name: "Feb", revenue: 1356000 },
    { name: "Mar", revenue: 1567000 },
    { name: "Apr", revenue: 1432000 },
    { name: "May", revenue: 1678000 },
    { name: "Jun", revenue: 1890000 },
    { name: "Jul", revenue: 2145000 },
    { name: "Aug", revenue: 2356000 },
    { name: "Sep", revenue: 2456789 },
  ],
  categoryData: [
    { name: "Electronics", value: 35 },
    { name: "Fashion", value: 25 },
    { name: "Home & Kitchen", value: 20 },
    { name: "Beauty", value: 12 },
    { name: "Books", value: 8 },
  ],
  recommendationInsights: {
    effectivenessScore: 87,
    conversionImpact: 23.5,
    topRecommendedProducts: [
      { name: "Smartphone X Pro", category: "Electronics", conversionRate: 12.3 },
      { name: "Wireless Earbuds", category: "Electronics", conversionRate: 10.8 },
      { name: "Designer Watch", category: "Fashion", conversionRate: 9.7 },
      { name: "Smart Home Hub", category: "Electronics", conversionRate: 8.9 },
      { name: "Premium Skincare Set", category: "Beauty", conversionRate: 8.5 },
    ],
  },
  loyaltyProgram: {
    totalMembers: 5678,
    memberGrowth: 12.3,
    pointsIssued: "12,45,678",
    pointsRedeemed: "8,56,234",
    redemptionRate: 68.7,
    topRewards: [
      { name: "₹500 Discount", redemptions: 1245 },
      { name: "Free Shipping", redemptions: 987 },
      { name: "Premium Product", redemptions: 654 },
      { name: "Early Access", redemptions: 432 },
      { name: "VIP Experience", redemptions: 321 },
    ],
  },
  recentUsers: [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.s@example.com",
      status: "active",
      spent: "₹12,450",
      orders: 8,
      joined: "2 days ago",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.p@example.com",
      status: "active",
      spent: "₹8,760",
      orders: 5,
      joined: "1 week ago",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.k@example.com",
      status: "inactive",
      spent: "₹5,430",
      orders: 3,
      joined: "2 weeks ago",
    },
    {
      id: 4,
      name: "Neha Singh",
      email: "neha.s@example.com",
      status: "active",
      spent: "₹15,670",
      orders: 10,
      joined: "1 month ago",
    },
    {
      id: 5,
      name: "Vikram Joshi",
      email: "vikram.j@example.com",
      status: "active",
      spent: "₹9,870",
      orders: 6,
      joined: "1 month ago",
    },
  ],
  aiInsights: [
    "Sales of electronics are projected to increase by 18% next month based on current trends and seasonal patterns.",
    "Customer retention could improve by 15% if loyalty program points expiration is extended from 3 to 6 months.",
    "Detected unusual spike in cart abandonment (32% increase) for fashion category in the last 48 hours.",
    "Recommendation algorithm effectiveness has improved by 8.5% after recent updates.",
    "Potential inventory shortage detected for 'Smartphone X Pro' based on current sales velocity.",
  ],
  userSegmentation: [
    { name: "New Users", value: 25 },
    { name: "Occasional", value: 30 },
    { name: "Regular", value: 28 },
    { name: "Loyal", value: 17 },
  ],
  deviceUsage: [
    { name: "Mobile", value: 65 },
    { name: "Desktop", value: 25 },
    { name: "Tablet", value: 10 },
  ],
  trafficSources: [
    { name: "Direct", value: 30 },
    { name: "Organic Search", value: 25 },
    { name: "Social Media", value: 20 },
    { name: "Referral", value: 15 },
    { name: "Email", value: 10 },
  ],
};

// Reusable Components
const DashboardCard = ({ title, value, growth, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center pt-1">
        <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
        <span className="text-xs text-emerald-500">+{growth}%</span>
        <span className="ml-1 text-xs text-muted-foreground">{description}</span>
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, description, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const RecentUsersTable = ({ users }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Spent</TableHead>
        <TableHead>Joined</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell className="font-medium">{user.name}</TableCell>
          <TableCell>
            <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
          </TableCell>
          <TableCell>{user.spent}</TableCell>
          <TableCell>{user.joined}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// Main Component
export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("monthly");

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ShopMart</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Sparkles className="h-4 w-4" />
                      <span>AI Insights</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Package className="h-4 w-4" />
                      <span>Products</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Orders</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Zap className="h-4 w-4" />
                      <span>Recommendations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <CreditCard className="h-4 w-4" />
                      <span>Loyalty Program</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-background">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input placeholder="Search..." className="w-64 pl-8" />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="container py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                  Welcome back, Admin! Here's what's happening with ShopMart today.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Total Revenue"
                  value={dashboardData.overview.totalRevenue}
                  growth={dashboardData.overview.revenueGrowth}
                  icon={DollarSign}
                  description="from last month"
                />
                <DashboardCard
                  title="Total Orders"
                  value={dashboardData.overview.totalOrders}
                  growth={dashboardData.overview.ordersGrowth}
                  icon={ShoppingCart}
                  description="from last month"
                />
                <DashboardCard
                  title="Total Users"
                  value={dashboardData.overview.totalUsers}
                  growth={dashboardData.overview.usersGrowth}
                  icon={Users}
                  description="from last month"
                />
                <DashboardCard
                  title="Conversion Rate"
                  value={`${dashboardData.overview.conversionRate}%`}
                  growth={dashboardData.overview.conversionGrowth}
                  icon={TrendingUp}
                  description="from last month"
                />
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <ChartCard title="Revenue Overview" description="Monthly revenue for the current year">
                  <LineChart
                    data={dashboardData.revenueData}
                    index="name"
                    categories={["revenue"]}
                    colors={CHART_COLORS}
                    valueFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    className="h-80"
                  />
                </ChartCard>

                <ChartCard title="Sales by Category" description="Distribution of sales across product categories">
                  <DonutChart
                    data={dashboardData.categoryData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={CHART_COLORS}
                    className="h-80"
                  />
                </ChartCard>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ChartCard title="User Segmentation" description="Breakdown of user types">
                  <PieChart
                    data={dashboardData.userSegmentation}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={CHART_COLORS}
                    className="h-60"
                  />
                </ChartCard>

                <ChartCard title="Device Usage" description="Platform distribution">
                  <PieChart
                    data={dashboardData.deviceUsage}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={CHART_COLORS}
                    className="h-60"
                  />
                </ChartCard>

                <ChartCard title="Traffic Sources" description="Where users are coming from">
                  <BarChart
                    data={dashboardData.trafficSources}
                    index="name"
                    categories={["value"]}
                    colors={CHART_COLORS}
                    valueFormatter={(value) => `${value}%`}
                    layout="vertical"
                    className="h-60"
                  />
                </ChartCard>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>AI-Powered Insights</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    </div>
                    <CardDescription>Intelligent insights based on your data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.aiInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                          <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{insight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export Insights Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentUsersTable users={dashboardData.recentUsers} />
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Users
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendation System Performance</CardTitle>
                    <CardDescription>Effectiveness of product recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Effectiveness Score</span>
                        <span className="text-sm font-medium">
                          {dashboardData.recommendationInsights.effectivenessScore}%
                        </span>
                      </div>
                      <Progress value={dashboardData.recommendationInsights.effectivenessScore} className="h-2" />
                    </div>
                    <div className="mb-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Conversion Impact</span>
                        <span className="text-sm font-medium">
                          +{dashboardData.recommendationInsights.conversionImpact}%
                        </span>
                      </div>
                      <Progress value={dashboardData.recommendationInsights.conversionImpact * 4} className="h-2" />
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Top Recommended Products</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Conv. Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dashboardData.recommendationInsights.topRecommendedProducts.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.conversionRate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty Program Analytics</CardTitle>
                    <CardDescription>Performance of the loyalty program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Total Members</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">{dashboardData.loyaltyProgram.totalMembers}</span>
                          <span className="ml-2 text-xs text-emerald-500">
                            +{dashboardData.loyaltyProgram.memberGrowth}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Redemption Rate</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">{dashboardData.loyaltyProgram.redemptionRate}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Points Issued</span>
                        <div className="text-2xl font-bold">{dashboardData.loyaltyProgram.pointsIssued}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Points Redeemed</span>
                        <div className="text-2xl font-bold">{dashboardData.loyaltyProgram.pointsRedeemed}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Top Redeemed Rewards</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reward</TableHead>
                            <TableHead>Redemptions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dashboardData.loyaltyProgram.topRewards.map((reward, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{reward.name}</TableCell>
                              <TableCell>{reward.redemptions}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}