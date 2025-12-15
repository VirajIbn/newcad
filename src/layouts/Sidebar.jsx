import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Package,
  Wrench,
  ChevronRight,
  Database,
  Tag,
  Truck,
  Factory,
  TrendingDown,
  User,
  LogOut,
  Settings,
  ChevronDown,
  FileText,
  Users,
  BarChart3,
  TrendingUp,
  Handshake,
  Settings2,
  Megaphone,
  Trash2,
  Building2,
  Wand2,
  FolderTree,
  Mail,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { clsx } from 'clsx';

const navigationItems = [
  {
    name: 'Asset Management',
    path: '/assets',
    icon: Package,
    children: [
      {
        name: 'Asset Dashboard',
        path: '/assets/dashboard',
        icon: Database,
      },
      {
        name: 'Asset Details',
        path: '/assets/details',
        icon: FileText,
      },
      {
        name: 'Asset Types',
        path: '/assets/types',
        icon: Tag,
      },
      {
        name: 'Asset Category',
        path: '/assets/category',
        icon: FolderTree,
      },
      {
        name: 'Asset Vendors',
        path: '/assets/vendors',
        icon: Truck,
      },
      {
        name: 'Asset Manufacturers',
        path: '/assets/manufacturers',
        icon: Factory,
      },
      {
        name: 'Asset Maintenance',
        path: '/assets/maintenance',
        icon: Wrench,
      },
      {
        name: 'Asset Depreciation',
        path: '/assets/depreciation',
        icon: TrendingDown,
      },
    ],
  },

  {
    name: 'CRM',
    path: '/crm',
    icon: Users,
    children: [
      {
        name: 'CRM Dashboard',
        path: '/crm/dashboard',
        icon: BarChart3,
      },
      {
        name: 'Leads',
        path: '/crm/leads',
        icon: TrendingUp,
      },
      {
        name: 'Deals',
        path: '/crm/opportunities',
        icon: Handshake,
      },
      {
        name: 'Trash',
        path: '/crm/trash',
        icon: Trash2,
      },
    ],
  },

  {
    name: 'Master',
    path: '/master',
    icon: Settings2,
    children: [
      {
        name: 'Business Units',
        path: '/master/business-units',
        icon: Building2,
      },
      {
        name: 'Campaigns',
        path: '/master/campaigns',
        icon: Megaphone,
      },
      {
        name: 'Email Master',
        path: '/master/email-master',
        icon: Mail,
      },
    ],
  },

  {
    name: 'Reports',
    path: '/reports',
    icon: FileText,
    children: [
      {
        name: 'CRM Reports',
        path: '/reports/crm',
        icon: BarChart3,
      },
      {
        name: 'AI Report Generator',
        path: '/reports/ai-generator',
        icon: Wand2,
      },
    ],
  },

];

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState(new Set());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [profileDropdownPosition, setProfileDropdownPosition] = useState({ top: 0, left: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const profileMenuRef = useRef(null);
  const menuItemRefs = useRef({});
  const hoverTimeoutRef = useRef(null);
  const profileHoverTimeoutRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear hovered menu when sidebar expands
  useEffect(() => {
    if (!isCollapsed) {
      setHoveredMenu(null);
      setShowProfileMenu(false);
    }
  }, [isCollapsed]);

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (hoveredMenu) {
        calculateDropdownPosition(hoveredMenu);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredMenu]);

  // Calculate dropdown position
  const calculateDropdownPosition = (menuName) => {
    const menuItem = menuItemRefs.current[menuName];
    if (menuItem) {
      const rect = menuItem.getBoundingClientRect();
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      const viewportWidth = window.innerWidth;
      
      let left = rect.right + 8; // Default position to the right
      
      // Check if dropdown goes beyond right edge
      if (left + dropdownWidth > viewportWidth) {
        left = rect.left - dropdownWidth - 8; // Position to the left instead
      }
      
      setDropdownPosition({
        top: rect.top,
        left: left
      });
    }
  };

  // Calculate profile dropdown position
  const calculateProfileDropdownPosition = () => {
    if (profileMenuRef.current) {
      const rect = profileMenuRef.current.getBoundingClientRect();
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      const dropdownHeight = 200; // Approximate height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = rect.right + 8; // Default position to the right
      let top = rect.top - 10; // Default position above
      
      // Check if dropdown goes beyond right edge
      if (left + dropdownWidth > viewportWidth) {
        left = rect.left - dropdownWidth - 8; // Position to the left instead
      }
      
      // Check if dropdown goes beyond top edge
      if (top < 0) {
        top = rect.bottom + 8; // Position below instead
      }
      
      // Check if dropdown goes beyond bottom edge
      if (top + dropdownHeight > viewportHeight) {
        top = viewportHeight - dropdownHeight - 10; // Adjust to fit
      }
      
      setProfileDropdownPosition({ top, left });
    }
  };

  // Handle menu hover with delay
  const handleMenuHover = (menuName, hasChildren) => {
    if (isCollapsed && hasChildren) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Set hovered menu immediately
      calculateDropdownPosition(menuName);
      setHoveredMenu(menuName);
    }
  };

  // Handle menu leave with delay
  const handleMenuLeave = () => {
    if (isCollapsed) {
      // Set a timeout to hide the menu after a short delay
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredMenu(null);
      }, 150); // 150ms delay
    }
  };

  // Handle profile menu hover when collapsed
  const handleProfileHover = () => {
    if (isCollapsed) {
      // Clear any existing timeout
      if (profileHoverTimeoutRef.current) {
        clearTimeout(profileHoverTimeoutRef.current);
      }
      
      // Calculate position and show profile menu
      calculateProfileDropdownPosition();
      setShowProfileMenu(true);
    }
  };

  // Handle profile menu leave when collapsed
  const handleProfileLeave = () => {
    if (isCollapsed) {
      // Set a timeout to hide the menu after a short delay
      profileHoverTimeoutRef.current = setTimeout(() => {
        setShowProfileMenu(false);
      }, 300); // 300ms delay to allow time for clicking
    }
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (profileHoverTimeoutRef.current) {
        clearTimeout(profileHoverTimeoutRef.current);
      }
    };
  }, []);


  const toggleMenu = (menuName) => {
    const newExpanded = new Set();
    if (!expandedMenus.has(menuName)) {
      newExpanded.add(menuName);
    }
    setExpandedMenus(newExpanded);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div
      className={clsx(
        "flex flex-col h-full border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{ backgroundColor: '#37474F' }}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >

      {/* Navigation */}
      <nav className={clsx(
        "flex-1 space-y-1 overflow-y-auto transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )} style={{ backgroundColor: '#37474F' }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedMenus.has(item.name);
          const isHovered = hoveredMenu === item.name;
          
          return (
            <div 
              key={item.path} 
              className="space-y-1 relative"
              onMouseEnter={() => handleMenuHover(item.name, hasChildren)}
              onMouseLeave={handleMenuLeave}
              ref={(el) => {
                if (el) menuItemRefs.current[item.name] = el;
              }}
            >
              <motion.button
                onClick={() => {
                  if (hasChildren && !isCollapsed) {
                    toggleMenu(item.name);
                  } else if (!hasChildren) {
                    navigate(item.path);
                  }
                }}
                className={clsx(
                  'w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200',
                  isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="ml-3 flex-1 flex items-center justify-between">
                    <span>{item.name}</span>
                    {hasChildren && (
                      <ChevronRight
                        className={clsx(
                          'w-4 h-4 transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    )}
                  </div>
                )}
              </motion.button>
              
              {/* Submenu - Expanded State */}
              {hasChildren && !isCollapsed && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 mt-1 space-y-1"
                    >
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.path);
                        
                        return (
                          <motion.button
                            key={child.path}
                            onClick={() => navigate(child.path)}
                            className={clsx(
                              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                              childActive
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-300 hover:bg-gray-600/40 hover:text-white'
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <ChildIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="ml-2">{child.name}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

            </div>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className={clsx(
        "border-t border-gray-200 dark:border-gray-700 transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )} style={{ backgroundColor: '#37474F' }}>
        <div className="space-y-3">
          {/* User Profile Card with Dropdown */}
          <div 
            className="relative" 
            ref={profileMenuRef}
            onMouseEnter={handleProfileHover}
            onMouseLeave={handleProfileLeave}
          >
            <div 
              className={clsx(
                "flex items-center rounded-lg cursor-pointer hover:bg-gray-500/50 transition-colors duration-200 shadow-sm",
                isCollapsed ? "p-2 justify-center" : "space-x-3 p-3 bg-gray-600/50"
              )}
              onClick={() => {
                if (!isCollapsed) {
                  setShowProfileMenu(!showProfileMenu);
                }
              }}
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                alt={user?.name || "User Avatar"}
                className={clsx(
                  "rounded-full object-cover border-2 border-white dark:border-gray-500 shadow-sm",
                  isCollapsed ? "w-8 h-8" : "w-10 h-10"
                )}
              />
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.fullname }
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </>
              )}
            </div>
            
            {/* Profile Dropdown Menu - Expanded State */}
            {!isCollapsed && (
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 overflow-hidden z-50"
                  >
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-gray-600"></div>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Portal-based Floating Submenu - Collapsed State */}
      {isCollapsed && hoveredMenu && (() => {
        const item = navigationItems.find(nav => nav.name === hoveredMenu);
        if (!item || !item.children) return null;
        
        const Icon = item.icon;
        
        return createPortal(
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
            onMouseEnter={() => {
              // Clear any timeout when hovering over submenu
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              setHoveredMenu(hoveredMenu);
            }}
            onMouseLeave={() => {
              // Set timeout when leaving submenu
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredMenu(null);
              }, 150);
            }}
          >
            {/* Visual bridge to connect menu and submenu */}
            <div 
              className={clsx(
                "absolute top-4 w-1 h-8 bg-gray-200 dark:bg-gray-600",
                dropdownPosition.left < window.innerWidth / 2 
                  ? "-right-1" 
                  : "-left-1"
              )}
              style={{ 
                clipPath: dropdownPosition.left < window.innerWidth / 2
                  ? 'polygon(100% 0, 0 20%, 0 80%, 100% 100%)' // Facing right
                  : 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' // Facing left
              }}
            />
            <div className="relative">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <Icon className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    {item.name}
                  </h3>
                </div>
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const childActive = isActive(child.path);
                  
                  return (
                    <button
                      key={child.path}
                      onClick={() => {
                        navigate(child.path);
                        setHoveredMenu(null);
                      }}
                      className={clsx(
                        'w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors',
                        childActive && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      )}
                    >
                      <ChildIcon className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                      <span className="truncate font-medium">{child.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>,
          document.body
        );
      })()}

      {/* Portal-based Profile Dropdown - Collapsed State */}
      {isCollapsed && createPortal(
        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              style={{
                top: `${profileDropdownPosition.top}px`,
                left: `${profileDropdownPosition.left}px`
              }}
              onMouseEnter={() => {
                // Clear any timeout when hovering over profile menu
                if (profileHoverTimeoutRef.current) {
                  clearTimeout(profileHoverTimeoutRef.current);
                }
                setShowProfileMenu(true);
              }}
              onMouseLeave={() => {
                // Set timeout when leaving profile menu
                profileHoverTimeoutRef.current = setTimeout(() => {
                  setShowProfileMenu(false);
                }, 300);
              }}
            >
          {/* Visual bridge to connect profile and dropdown */}
          <div 
            className={clsx(
              "absolute top-4 w-1 h-8 bg-gray-200 dark:bg-gray-600",
              profileDropdownPosition.left < window.innerWidth / 2 
                ? "-right-1" 
                : "-left-1"
            )}
            style={{ 
              clipPath: profileDropdownPosition.left < window.innerWidth / 2
                ? 'polygon(100% 0, 0 20%, 0 80%, 100% 100%)' // Facing right
                : 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' // Facing left
            }}
          />
          <div className="relative">
            <div className="py-2">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Profile Menu
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <User className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span className="truncate font-medium">View Profile</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Settings className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span className="truncate font-medium">Settings</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3 flex-shrink-0 text-red-500 dark:text-red-400" />
                <span className="truncate font-medium">Logout</span>
              </button>
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default Sidebar;
