import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/admin.service";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiAward
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getAdminDashboard();
        if (data.success) {
          setStats(data.statistics);
          setRecentPayments(data.recentPayments || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  // Sample chart data derived from current statistics
  const revenueChartData = [
    { name: "Jan", Revenue: 1200, Members: 10 },
    { name: "Feb", Revenue: 1900, Members: 15 },
    { name: "Mar", Revenue: 3200, Members: 28 },
    { name: "Apr", Revenue: 4100, Members: 35 },
    { name: "May", Revenue: 5000, Members: 42 },
    { name: "Jun", Revenue: stats?.totalRevenue || 6500, Members: stats?.totalMembers || 50 }
  ];

  const cards = [
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: FiUsers,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Trainers",
      value: stats?.totalTrainers || 0,
      icon: FiUserCheck,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Active Memberships",
      value: stats?.activeMemberships || 0,
      icon: FiAward,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: FiDollarSign,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">GymPro analytics and operations monitor.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{card.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 group-hover:scale-105 transition-transform duration-200">
                  {card.value}
                </h3>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" />
            Revenue Analysis ($)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 41, 59, 0.8)", border: "none", borderRadius: 8, color: "#fff" }} />
                <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Signup rates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <FiUsers className="text-purple-500" />
            Membership Growth
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 41, 59, 0.8)", border: "none", borderRadius: 8, color: "#fff" }} />
                <Legend />
                <Bar dataKey="Members" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Payments */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <FiCalendar className="text-amber-500" />
          Recent Payments
        </h3>
        <div className="overflow-x-auto">
          {recentPayments.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 py-4 text-center">No recent payments logged.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-sm font-semibold">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                      {payment.memberId?.name || "Unknown Member"}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                      ${payment.amount}
                    </td>
                    <td className="py-3 px-4 uppercase text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {payment.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${payment.paymentStatus === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"}`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;