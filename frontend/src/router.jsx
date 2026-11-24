import DashboardAdmin from './pages/admin/DashboardAdmin';
import UsersPage from './pages/admin/UsersPage';
import PermissionsPage from './pages/admin/PermissionsPage';
import CatalogPage from './pages/admin/CatalogPage';
import StatusLabelsPage from './pages/admin/StatusLabelsPage';
import LocationsPage from './pages/admin/LocationsPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import SettingsPage from './pages/admin/SettingsPage';

export const adminRoutes = [
  { path: '/admin/dashboard', element: <DashboardAdmin /> },
  { path: '/admin/users', element: <UsersPage /> },
  { path: '/admin/permissions', element: <PermissionsPage /> },
  { path: '/admin/catalog', element: <CatalogPage /> },
  { path: '/admin/status-labels', element: <StatusLabelsPage /> },
  { path: '/admin/locations', element: <LocationsPage /> },
  { path: '/admin/audit-logs', element: <AuditLogPage /> },
  { path: '/admin/settings', element: <SettingsPage /> },
];