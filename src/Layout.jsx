import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main content area - full screen for single page app */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;