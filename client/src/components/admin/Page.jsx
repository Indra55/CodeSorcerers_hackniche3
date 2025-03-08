"use client";

import { useState } from "react";
import { ADMIN_DATA } from "../../constants/admin-data";
import { StatCard, RevenueChart, SalesPieChart, CompaniesTable, SidebarNav, UserMenu, CompanySelector } from "@/components/admin";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "./sidebarNav";
// Other necessary imports

export default function AdminPage() {
  // State and logic remains the same
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(ADMIN_DATA.adminUsers[0]);

  // getIcon function remains the same

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-muted/30">
        {/* Mobile menu button */}

        <Sidebar className="border-r bg-background">
          <SidebarHeader>{/* ... */}</SidebarHeader>
          <SidebarContent>
            <SidebarNav navigation={ADMIN_DATA.navigation} getIcon={getIcon} />
          </SidebarContent>
          <SidebarFooter>
            <UserMenu currentAdmin={currentAdmin} admins={ADMIN_DATA.adminUsers} />
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <AdminDashboardContent />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function AdminDashboardContent() {
  // Original dashboard content logic
  return (
    <div className="space-y-6">
      {/* Header and CompanySelector */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ADMIN_DATA.statCards.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={`${stat.id === "revenue" ? "$" : ""}${getStatValue(stat.id).toLocaleString()}`}
            icon={getIcon(stat.icon)}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            animationDelay={0.1 * (index + 1)}
          />
        ))}
      </div>

      {/* Charts and Tables using components */}
      <RevenueChart data={revenueData} colors={ADMIN_DATA.chartColors} />
      <CompaniesTable data={filteredData} />
    </div>
  );
}