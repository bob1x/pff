import { AppSidebar } from "../components/dashboard/app-sidebar"

import { SectionCards } from "../components/dashboard/section-cards"
import { SiteHeader } from "../components/dashboard/site-header"
import { SiteNavbar } from "../components/dashboard/site-navbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <SiteNavbar />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
              <button type="button" className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400">ezaea</button>
              </div>    
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}