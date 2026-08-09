import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiSun,
  FiMoon,
  FiUser,
  FiActivity,
  FiBookOpen,
  FiUsers,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiSliders,
  FiTrendingUp,
  FiCheckSquare
} from "react-icons/fi";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case "admin":
        return [
          { name: "Admin Dashboard", path: "/admin/dashboard", icon: FiActivity },
          { name: "Manage Members", path: "/admin/members", icon: FiUsers },
          { name: "Manage Trainers", path: "/admin/trainers", icon: FiUser },
          { name: "Manage Exercises", path: "/admin/exercises", icon: FiSliders },
          { name: "Membership Plans", path: "/admin/plans", icon: FiBookOpen },
          { name: "Payments", path: "/admin/payments", icon: FiCreditCard },
          { name: "Attendance Reports", path: "/admin/attendance", icon: FiCalendar },
        ];
      case "trainer":
        return [
          { name: "Trainer Dashboard", path: "/trainer/dashboard", icon: FiActivity },
          { name: "Assigned Members", path: "/trainer/members", icon: FiUsers },
          { name: "Workout Plans", path: "/trainer/workouts", icon: FiSliders },
          { name: "Diet Plans", path: "/trainer/diets", icon: FiBookOpen },
          { name: "Attendance", path: "/trainer/attendance", icon: FiCalendar },
        ];
      case "member":
      default:
        return [
          { name: "Member Dashboard", path: "/member/dashboard", icon: FiActivity },
          { name: "Profile", path: "/member/profile", icon: FiUser },
          { name: "Workout Plan", path: "/member/workout", icon: FiSliders },
          { name: "Workout Logger", path: "/member/log", icon: FiCheckSquare },
          { name: "Diet Plan", path: "/member/diet", icon: FiBookOpen },
          { name: "Progress Tracker", path: "/member/progress", icon: FiTrendingUp },
          { name: "Exercise Library", path: "/member/exercises", icon: FiBookOpen },
          { name: "Attendance", path: "/member/attendance", icon: FiCalendar },
          { name: "Membership", path: "/member/membership", icon: FiCreditCard },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <div className={`min-h-screen flex bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300`}>
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <Link to="#" className="text-2xl font-bold tracking-wider text-blue-600 dark:text-blue-400">
              GYMPRO
            </Link>
            <button className="md:hidden text-slate-500 dark:text-slate-400" onClick={() => setSidebarOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className="block"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg uppercase border border-slate-200 dark:border-slate-800">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-bold truncate w-36">{user?.name || "User Name"}</p>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold transition-all duration-200"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 dark:bg-black/50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {links.find((l) => l.path === location.pathname)?.name || "GymPro"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              title="Toggle Theme"
            >
              <motion.div
                key={darkMode ? "sun" : "moon"}
                initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.div>
            </button>

            {/* Notification/Info Banner */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Connected
            </span>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
