import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
