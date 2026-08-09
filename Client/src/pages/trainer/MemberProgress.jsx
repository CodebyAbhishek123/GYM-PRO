import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMemberProgress, getMemberWorkoutLogs } from "../../services/trainer.service";
import toast from "react-hot-toast";
import { FiTrendingUp, FiActivity, FiArrowLeft, FiAward, FiCalendar } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const MemberProgress = () => {
  const { id: memberId } = useParams();
  const [progress, setProgress] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const [progRes, logsRes] = await Promise.all([
          getMemberProgress(memberId),
          getMemberWorkoutLogs(memberId)
        ]);

        if (progRes.success) {
          setProgress(progRes.progress || []);
        }
        if (logsRes.success) {
          setLogs(logsRes.logs || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load progress records");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [memberId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading progress tracker...</div>;
  }

  // Format charts data
  const chartData = progress.map(p => ({
    date: new Date(p.date || p.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
    Weight: p.weight,
    Fat: p.bodyFat,
    BMI: p.bmi
  })).reverse(); // Oldest to newest

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/trainer/members"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          <FiArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Trainee Progress Tracker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Trace body transformations and workout metrics.</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500">
          No body progress measurements recorded by this trainee yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" />
              Weight Progression (kg)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Weight" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fat percentage log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 flex items-center gap-2">
              <FiActivity className="text-purple-500" />
              Body Fat (%) & BMI
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Fat" stroke="#a855f7" strokeWidth={2} name="Fat %" />
                  <Line type="monotone" dataKey="BMI" stroke="#ec4899" strokeWidth={2} name="BMI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Workout Logs History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 flex items-center gap-2">
          <FiCalendar className="text-blue-500" />
          Logged Workouts History
        </h3>
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">No completed workouts logged yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-semibold bg-slate-50/70 dark:bg-slate-850">
                  <th className="py-3 px-4">Exercise</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Completed Sets</th>
                  <th className="py-3 px-4">Total Volume</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                    <td className="py-3 px-4 font-semibold">{log.exerciseId?.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(log.date || log.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{log.sets?.length || 0} Sets</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{log.totalVolume || 0} kg</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">{log.duration || 0} mins</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                        Finished
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

export default MemberProgress;
