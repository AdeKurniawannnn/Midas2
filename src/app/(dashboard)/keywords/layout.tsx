"use client"

import { ReactNode } from "react"
import UnifiedDashboardLayout from "@/components/features/dashboard/unified-dashboard-layout"

interface DashboardPageProps {
  children: ReactNode
}

export default function KeywordsLayout({ children }: DashboardPageProps) {
  return (
    <UnifiedDashboardLayout currentPage="Keywords" showSidebar={true} showBreadcrumbs={true}>
      {children}
    </UnifiedDashboardLayout>
  )
}