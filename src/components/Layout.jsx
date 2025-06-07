import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { routeArray } from '../config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Flame" size={20} className="text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-gray-900">
                Campfire Hub
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="Bell" size={20} />
            </motion.button>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Flame" size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-heading font-bold text-gray-900">
                      Campfire Hub
                    </span>
                  </div>
                  
                  <nav className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        {route.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;