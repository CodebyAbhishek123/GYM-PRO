import { useEffect, useState } from "react";
import { getTrainerDashboard, getWorkoutPlans } from "../../services/trainer.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiUsers, FiSliders, FiBookOpen, FiActivity, FiUser } from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setLoading(true);
        const [dashRes, plansRes] = await Promise.all([
          getTrainerDashboard(),
          getWorkoutPlans()
        ]);

        if (dashRes.success) {
          setStats(dashRes.statistics);
        }

        if (plansRes.success) {
          // Filter unique members assigned to this trainer
          const myPlans = plansRes.workoutPlans.filter(p => p.trainerId?._id === user?.id);
          const membersMap = {};
          myPlans.forEach(p => {
            if (p.memberId) {
              membersMap[p.memberId._id] = {
                id: p.memberId._id,
                name: p.memberId.name,
                email: p.memberId.email,
                planStatus: p.status,
                planId: p._id
              };
            }
          });
          setAssignedMembers(Object.values(membersMap));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load trainer dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  const cards = [
    {
      title: "Assigned Members",
      value: stats?.assignedMembers || 0,
      icon: FiUsers,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Active Workout Plans",
      value: stats?.workoutPlans || 0,
      icon: FiSliders,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Active Diet Plans",
      value: stats?.dietPlans || 0,
      icon: FiBookOpen,
      color: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Trainer Console</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Hello, Coach {user?.name}. Monitor your assigned trainees.</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{card.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
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

      {/* Trainees list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <FiActivity className="text-blue-500" />
          My Trainees
        </h3>
        <div className="overflow-x-auto">
          {assignedMembers.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 py-4 text-center">No members assigned to your workouts yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-semibold bg-slate-50/70 dark:bg-slate-850">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Plan Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedMembers.map(m => (
                  <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      <FiUser className="text-slate-400" />
                      {m.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{m.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${m.planStatus === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500"}`}>
                        {m.planStatus} Plan
                      </span>
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