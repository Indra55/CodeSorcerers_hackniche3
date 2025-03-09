"use client";

import { useState } from "react";
import { BarChart, LineChart, PieChart, DonutChart } from "./ChartComponents";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText,
  HelpCircle,
  LayoutDashboardIcon,
  LineChartIcon,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
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

// Mock data for the company dashboard
const companyData = {
  overview: {
    totalRevenue: "₹12,45,678",
    revenueGrowth: 8.5,
    totalOrders: "3,456",
    ordersGrowth: 5.2,
    totalProducts: "245",
    productsGrowth: 3.7,
    conversionRate: 2.8,
    conversionGrowth: 0.3,
  },
  revenueData: [
    { name: "Jan", revenue: 645000 },
    { name: "Feb", revenue: 756000 },
    { name: "Mar", revenue: 867000 },
    { name: "Apr", revenue: 932000 },
    { name: "May", revenue: 978000 },
    { name: "Jun", revenue: 1090000 },
    { name: "Jul", revenue: 1145000 },
    { name: "Aug", revenue: 1156000 },
    { name: "Sep", revenue: 1245678 },
  ],
  categoryData: [
    { name: "Electronics", value: 45 },
    { name: "Fashion", value: 35 },
    { name: "Home & Kitchen", value: 20 },
  ],
  productPerformance: [
    { name: "Smartphone X Pro", sales: 456, revenue: "₹45,60,000", growth: 12.5 },
    { name: "Wireless Earbuds", sales: 345, revenue: "₹10,35,000", growth: 8.7 },
    { name: "Designer Watch", sales: 234, revenue: "₹11,70,000", growth: 5.3 },
    { name: "Smart Home Hub", sales: 189, revenue: "₹9,45,000", growth: 3.8 },
    { name: "Premium Skincare Set", sales: 156, revenue: "₹7,80,000", growth: 2.5 },
  ],
  recommendationInsights: {
    effectivenessScore: 82,
    conversionImpact: 18.5,
    topRecommendedProducts: [
      { name: "Smartphone X Pro", category: "Electronics", conversionRate: 10.3 },
      { name: "Wireless Earbuds", category: "Electronics", conversionRate: 8.8 },
      { name: "Designer Watch", category: "Fashion", conversionRate: 7.7 },
    ],
    recommendationTypes: [
      { name: "Similar Products", effectiveness: 75 },
      { name: "Frequently Bought Together", effectiveness: 85 },
      { name: "Based on Browsing History", effectiveness: 68 },
      { name: "Personalized for User", effectiveness: 92 },
    ],
  },
  customerInsights: {
    totalCustomers: 5678,
    newCustomers: 345,
    returningCustomers: 2345,
    churnRate: 3.2,
    averageOrderValue: "₹3,600",
    customerLifetimeValue: "₹18,500",
    topCustomers: [
      { name: "Rahul Sharma", orders: 12, spent: "₹45,600", lastPurchase: "2 days ago" },
      { name: "Priya Patel", orders: 8, spent: "₹32,400", lastPurchase: "1 week ago" },
      { name: "Amit Kumar", orders: 6, spent: "₹28,900", lastPurchase: "2 weeks ago" },
    ],
  },
  loyaltyProgram: {
    members: 2345,
    memberGrowth: 8.3,
    pointsIssued: "5,45,678",
    pointsRedeemed: "3,56,234",
    redemptionRate: 65.3,
    topRewards: [
      { name: "₹500 Discount", redemptions: 645 },
      { name: "Free Shipping", redemptions: 487 },
      { name: "Premium Product", redemptions: 354 },
    ],
  },
  inventoryStatus: [
    { name: "Smartphone X Pro", stock: 45, status: "Low Stock", reorder: true },
    { name: "Wireless Earbuds", stock: 120, status: "In Stock", reorder: false },
    { name: "Designer Watch", stock: 78, status: "In Stock", reorder: false },
    { name: "Smart Home Hub", stock: 23, status: "Low Stock", reorder: true },
    { name: "Premium Skincare Set", stock: 56, status: "In Stock", reorder: false },
  ],
  aiInsights: [
    "Customers who purchase 'Smartphone X Pro' are 65% more likely to buy 'Wireless Earbuds' within 30 days.",
    "Increasing product recommendations on product pages could improve conversion rates by approximately 12%.",
    "Loyalty program members spend on average 35% more than non-members.",
    "Inventory for 'Smartphone X Pro' is projected to run out in 15 days based on current sales velocity.",
    "Customers from the 25-34 age group show the highest engagement with your personalized recommendations.",
  ],
  customerSegmentation: [
    { name: "New", value: 20 },
    { name: "Occasional", value: 35 },
    { name: "Regular", value: 30 },
    { name: "Loyal", value: 15 },
  ],
  marketingPerformance: [
    { name: "Email Campaigns", conversions: 234, revenue: "₹8,45,000", roi: 320 },
    { name: "Social Media Ads", conversions: 187, revenue: "₹6,78,000", roi: 280 },
    { name: "Search Engine Ads", conversions: 156, revenue: "₹5,45,000", roi: 240 },
    { name: "Referral Program", conversions: 98, revenue: "₹3,56,000", roi: 380 },
  ],
};

export default function CompanyDashboard() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeTab, setActiveTab] = useState("overview");

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
              <SidebarGroupLabel>Company Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                      <LayoutDashboardIcon className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "products"} onClick={() => setActiveTab("products")}>
                      <Package className="h-4 w-4" />
                      <span>Products</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "customers"} onClick={() => setActiveTab("customers")}>
                      <Users className="h-4 w-4" />
                      <span>Customers</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
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
                    <SidebarMenuButton
                      isActive={activeTab === "recommendations"}
                      onClick={() => setActiveTab("recommendations")}
                    >
                      <Zap className="h-4 w-4" />
                      <span>Recommendations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "loyalty"} onClick={() => setActiveTab("loyalty")}>
                      <CreditCard className="h-4 w-4" />
                      <span>Loyalty Program</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "marketing"} onClick={() => setActiveTab("marketing")}>
                      <Tag className="h-4 w-4" />
                      <span>Marketing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "insights"} onClick={() => setActiveTab("insights")}>
                      <Sparkles className="h-4 w-4" />
                      <span>AI Insights</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Reports</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart3 className="h-4 w-4" />
                      <span>Sales Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LineChartIcon className="h-4 w-4" />
                      <span>Performance</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText className="h-4 w-4" />
                      <span>Export Data</span>
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
              <h1 className="text-xl font-semibold">Company Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input placeholder="Search products, customers..." className="w-64 pl-8" />
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
                  5
                </span>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Company" />
                <AvatarFallback>CO</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="container py-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-4 lg:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.overview.totalRevenue}</div>
                        <div className="flex items-center pt-1">
                          <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-emerald-500">+{companyData.overview.revenueGrowth}%</span>
                          <span className="ml-1 text-xs text-muted-foreground">from last month</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.overview.totalOrders}</div>
                        <div className="flex items-center pt-1">
                          <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-emerald-500">+{companyData.overview.ordersGrowth}%</span>
                          <span className="ml-1 text-xs text-muted-foreground">from last month</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.overview.totalProducts}</div>
                        <div className="flex items-center pt-1">
                          <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-emerald-500">+{companyData.overview.productsGrowth}%</span>
                          <span className="ml-1 text-xs text-muted-foreground">from last month</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.overview.conversionRate}%</div>
                        <div className="flex items-center pt-1">
                          <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-emerald-500">+{companyData.overview.conversionGrowth}%</span>
                          <span className="ml-1 text-xs text-muted-foreground">from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                      <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue for the current year</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <LineChart
                          data={companyData.revenueData}
                          index="name"
                          categories={["revenue"]}
                          colors={["#0ea5e9"]}
                          valueFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                          className="h-80"
                        />
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                      <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Distribution of sales across product categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DonutChart
                          data={companyData.categoryData}
                          index="name"
                          category="value"
                          valueFormatter={(value) => `${value}%`}
                          colors={["#0ea5e9", "#6366f1", "#8b5cf6"]}
                          className="h-80"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Performance</CardTitle>
                      <CardDescription>Top performing products by sales and revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Sales</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Growth</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companyData.productPerformance.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.sales}</TableCell>
                              <TableCell>{product.revenue}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                                  <span className="text-emerald-500">{product.growth}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Products
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Inventory Status</CardTitle>
                        <CardDescription>Current stock levels and reorder status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {companyData.inventoryStatus.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.stock}</TableCell>
                                <TableCell>
                                  <Badge variant={item.status === "Low Stock" ? "destructive" : "default"}>
                                    {item.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {item.reorder && (
                                    <Button variant="outline" size="sm">
                                      Reorder
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Segmentation</CardTitle>
                        <CardDescription>Breakdown of customer types</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PieChart
                          data={companyData.customerSegmentation}
                          index="name"
                          category="value"
                          valueFormatter={(value) => `${value}%`}
                          colors={["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"]}
                          className="h-80"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
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
                              {companyData.recommendationInsights.effectivenessScore}%
                            </span>
                          </div>
                          <Progress value={companyData.recommendationInsights.effectivenessScore} className="h-2" />
                        </div>
                        <div className="mb-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Conversion Impact</span>
                            <span className="text-sm font-medium">
                              +{companyData.recommendationInsights.conversionImpact}%
                            </span>
                          </div>
                          <Progress value={companyData.recommendationInsights.conversionImpact * 4} className="h-2" />
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
                              {companyData.recommendationInsights.topRecommendedProducts.map((product, index) => (
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
                        <CardTitle>Recommendation Types Effectiveness</CardTitle>
                        <CardDescription>Performance by recommendation strategy</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BarChart
                          data={companyData.recommendationInsights.recommendationTypes}
                          index="name"
                          categories={["effectiveness"]}
                          colors={["#0ea5e9"]}
                          valueFormatter={(value) => `${value}%`}
                          layout="vertical"
                          className="h-80"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Recommendation Optimization Suggestions</CardTitle>
                        <CardDescription>AI-powered insights to improve your recommendation system</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {companyData.aiInsights.map((insight, index) => (
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
                        Export Recommendations Report
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="customers" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.customerInsights.totalCustomers}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.customerInsights.newCustomers}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.customerInsights.averageOrderValue}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{companyData.customerInsights.customerLifetimeValue}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Segmentation</CardTitle>
                        <CardDescription>Breakdown of customer types</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PieChart
                          data={companyData.customerSegmentation}
                          index="name"
                          category="value"
                          valueFormatter={(value) => `${value}%`}
                          colors={["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"]}
                          className="h-80"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Customers</CardTitle>
                        <CardDescription>Customers with highest lifetime value</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer</TableHead>
                              <TableHead>Orders</TableHead>
                              <TableHead>Spent</TableHead>
                              <TableHead>Last Purchase</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {companyData.customerInsights.topCustomers.map((customer, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.orders}</TableCell>
                                <TableCell>{customer.spent}</TableCell>
                                <TableCell>{customer.lastPurchase}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Customers
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Loyalty Program Performance</CardTitle>
                      <CardDescription>Metrics for your customer loyalty program</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Total Members</span>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">{companyData.loyaltyProgram.members}</span>
                            <span className="ml-2 text-xs text-emerald-500">
                              +{companyData.loyaltyProgram.memberGrowth}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Redemption Rate</span>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">{companyData.loyaltyProgram.redemptionRate}%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Points Issued</span>
                          <div className="text-2xl font-bold">{companyData.loyaltyProgram.pointsIssued}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Points Redeemed</span>
                          <div className="text-2xl font-bold">{companyData.loyaltyProgram.pointsRedeemed}</div>
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
                            {companyData.loyaltyProgram.topRewards.map((reward, index) => (
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
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>AI-Powered Business Insights</CardTitle>
                        <CardDescription>Intelligent insights based on your business data</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {companyData.aiInsights.map((insight, index) => (
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
                      <CardTitle>Marketing Campaign Performance</CardTitle>
                      <CardDescription>Effectiveness of your marketing efforts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campaign</TableHead>
                            <TableHead>Conversions</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>ROI (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companyData.marketingPerformance.map((campaign, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{campaign.name}</TableCell>
                              <TableCell>{campaign.conversions}</TableCell>
                              <TableCell>{campaign.revenue}</TableCell>
                              <TableCell>{campaign.roi}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Campaigns
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Predictive Analytics</CardTitle>
                        <CardDescription>AI-powered sales forecasting</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Next Month Sales Forecast</span>
                              <span className="text-sm font-medium">₹14,56,000</span>
                            </div>
                            <Progress value={85} className="h-2" />
                            <p className="text-xs text-muted-foreground">Predicted with 85% confidence</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Inventory Optimization</span>
                              <span className="text-sm font-medium">₹2,45,000 savings</span>
                            </div>
                            <Progress value={72} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              Potential cost reduction with AI-optimized inventory
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Customer Churn Risk</span>
                              <span className="text-sm font-medium">156 customers</span>
                            </div>
                            <Progress value={32} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              Customers at risk of churning in next 30 days
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recommendation Opportunities</CardTitle>
                        <CardDescription>Potential areas for improvement</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-3">
                            <h4 className="mb-1 text-sm font-medium">Product Page Recommendations</h4>
                            <p className="text-xs text-muted-foreground">
                              Increasing recommendation visibility on product pages could improve conversion by up to
                              15%.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Implement
                            </Button>
                          </div>

                          <div className="rounded-lg border p-3">
                            <h4 className="mb-1 text-sm font-medium">Cart Page Cross-Selling</h4>
                            <p className="text-xs text-muted-foreground">
                              Adding "Frequently Bought Together" section to cart page could increase average order
                              value by 12%.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Implement
                            </Button>
                          </div>

                          <div className="rounded-lg border p-3">
                            <h4 className="mb-1 text-sm font-medium">Post-Purchase Recommendations</h4>
                            <p className="text-xs text-muted-foreground">
                              Email recommendations after purchase could drive 8% more repeat purchases within 30 days.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Implement
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}