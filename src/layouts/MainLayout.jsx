import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Factory, Building2, Users, BarChart3, FileText, Settings, Settings2, User, Shield, Package, Wrench, TrendingDown, Database, Tag, Truck, TrendingUp, Handshake, Trash2, Megaphone, Wand2, FolderTree, Mail} from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { FinancialYearDropdown } from '../components/common';
import { FinancialYearProvider } from '../context/FinancialYearContext';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

const MainLayoutContent = ({ children }) => {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Handle Financial Year change
  const handleFinancialYearChange = useCallback((selectedYear) => {
    
    // Dispatch a custom event that pages can listen to
    const event = new CustomEvent('financialYearChanged', {
      detail: { selectedYear }
    });
    window.dispatchEvent(event);
  }, []);

  // Function to get page title based on current route
  const getPageTitle = (pathname) => {
    const routeMap = {
      '/': 'Dashboard',
      '/assets': 'Assets',
      '/assets/details': 'Asset Details',
      '/assets/dashboard': 'Asset Dashboard',
      '/assets/depreciation': 'Asset Depreciation',
      '/assets/maintenance': 'Asset Maintenance',
      '/assets/types': 'Asset Types',
      '/assets/category': 'Asset Categories',
      '/assets/manufacturers': 'Asset Manufacturers',
      '/assets/vendors': 'Asset Vendors',
      '/crm': 'CRM',
      '/crm/dashboard': 'CRM Dashboard',
      '/crm/leads': 'Leads',
      '/crm/opportunities': 'Deal',
      '/crm/campaigns': 'Campaigns',
      '/crm/trash': 'Trash',
      '/master/business-units': 'Business Units',
      '/master/campaigns': 'Campaigns',
      '/master/email-master': 'Email Master',
      '/organizations': 'Organizations',
      '/users': 'Users',
      '/reports': 'Reports',
      '/reports/crm': 'CRM Reports',
      '/reports/ai-generator': 'AI Report Generator',
      '/requests': 'Requests',
      '/settings': 'Settings',
      '/profile': 'Profile',
      '/login': 'Login'
    };
    
    return routeMap[pathname] || 'Page';
  };

  // Function to get page icon based on current route
  const getPageIcon = (pathname) => {
    const iconMap = {
      '/': BarChart3,
      '/assets': Package,
      '/assets/details': FileText,
      '/assets/dashboard': Database,
      '/assets/depreciation': TrendingDown,
      '/assets/maintenance': Wrench,
      '/assets/types': Tag,
      '/assets/category': FolderTree,
      '/assets/manufacturers': Factory,
      '/assets/vendors': Truck,
      '/crm': Users,
      '/crm/dashboard': BarChart3,
      '/crm/leads': TrendingUp,
      '/crm/opportunities': Handshake,
      '/crm/campaigns': Megaphone,
      '/crm/trash': Trash2,
      '/master/business-units': Building2,
      '/master/campaigns': Megaphone,
      '/master/email-master': Mail,
      '/organizations': Building2,
      '/users': Users,
      '/reports': BarChart3,
      '/reports/crm': BarChart3,
      '/reports/ai-generator': Wand2,
      '/requests': FileText,
      '/settings': Settings,
      '/profile': User,
      '/login': Shield
    };
    
    return iconMap[pathname] || BarChart3;
  };

  // Pages where financial year dropdown should be hidden
  const hideFinancialYearPages = [
    '/assets/types',
    '/assets/category',
    '/assets/vendors', 
    '/assets/manufacturers',
    '/master/business-units',
    '/master/campaigns',
    '/master/email-master'
  ];

  const shouldShowFinancialYear = !hideFinancialYearPages.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Topbar - Full Width */}
        <Topbar onToggleSidebar={toggleSidebar} isSidebarCollapsed={isCollapsed} />
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Additional Header Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const IconComponent = getPageIcon(location.pathname);
                    return (
                      <IconComponent className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    );
                  })()}
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {getPageTitle(location.pathname)}
                  </h2>
                </div>
                {shouldShowFinancialYear && (
                  <div className="flex items-center space-x-4">
                    <FinancialYearDropdown
                      placeholder="Select FY"
                      showLabel={true}
                      label="Financial Year"
                      onChange={handleFinancialYearChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Page Content */}
            <motion.main
              className="flex-1 overflow-y-auto p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.main>
          </div>
        </div>
      </div>
  );
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const orgId = user?.orgId;

  // Pages where financial year dropdown should be hidden
  const hideFinancialYearPages = [
    '/assets/types',
    '/assets/category',
    '/assets/vendors', 
    '/assets/manufacturers',
    '/master/business-units',
    '/master/campaigns',
    '/master/email-master'
  ];

  const shouldShowFinancialYear = !hideFinancialYearPages.includes(location.pathname);

  // Conditionally wrap with FinancialYearProvider only for pages that need it
  if (shouldShowFinancialYear) {
    return (
      <SidebarProvider>
        <FinancialYearProvider orgId={orgId}>
          <MainLayoutContent>
            {children}
          </MainLayoutContent>
        </FinancialYearProvider>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <MainLayoutContent>
        {children}
      </MainLayoutContent>
    </SidebarProvider>
  );
};

export default MainLayout; 