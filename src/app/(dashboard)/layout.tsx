import {
  Dashboard,
  DashboardSidebar,
  DashboardNavigation,
  DashboardContent,
} from "@/components/ui/layout/Dashboard";
import { Thumbnail } from "@/components/user/Thumbnail";
import DashboardLinks from "@/components/navigation/DashboardLinks";
import { NoOrganisationBanner } from "@/components/banners/NoOrganisationBanner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Dashboard>
      <DashboardSidebar thumbnail={<Thumbnail />}>
        <DashboardNavigation>
          <DashboardLinks />
        </DashboardNavigation>
      </DashboardSidebar>
      <DashboardContent>
        <NoOrganisationBanner />
        {children}
      </DashboardContent>
    </Dashboard>
  );
}
