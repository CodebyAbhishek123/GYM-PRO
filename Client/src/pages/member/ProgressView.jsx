import { useEffect, useState } from "react";
import { addProgress, getProgressHistory } from "../../services/member.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiPlus, FiTrendingUp, FiActivity, FiSliders } from "react-icons/fi";
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

const ProgressView = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showLogModal, setShowLogModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    bodyFat: "",
    chest: "",
    waist: "",
    arms: "",
    thighs: "",
    notes: ""
  });

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await getProgressHistory(user?.id);
      if (res.success) {
        setHistory(res.progress || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProgress();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate BMI
      const wt = Number(formData.weight);
      const ht = Number(formData.height);
      let bmiValue = 0;
      if (wt && ht) {
        const htInMeters = ht / 100;
        bmiValue = Number((wt / (htInMeters * htInMeters)).toFixed(2));
      }

      const res = await addProgress({
        ...formData,
        weight: wt,
        height: ht,
        bmi: bmiValue,
        bodyFat: Number(formData.bodyFat) || undefined,
        chest: Number(formData.chest) || undefined,
        waist: Number(formData.waist) || undefined,
        arms: Number(formData.arms) || undefined,
        thighs: Number(formData.thighs) || undefined,
        date: new Date()
      });

      if (res.success) {
        toast.success("Progress metrics logged! Keep going!");
        setShowLogModal(false);
        setFormData({ weight: "", height: "", bodyFat: "", chest: "", waist: "", arms: "", thighs: "", notes: "" });
        fetchProgress();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save metrics");
    }
  };

  const chartData = history.map(h => ({
    date: new Date(h.date || h.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
    Weight: h.weight,
    BMI: h.bmi,
    Fat: h.bodyFat,
    Waist: h.waist
  })).reverse(); // Sort oldest to newest

  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Progress & Transformations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and view body metric progressions.</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
        >
          <FiPlus size={18} />
          Log Progress
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading history logs...</div>
      ) : chartData.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500">
          No metrics logs added yet. Click "Log Progress" to track your weight and measurements.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Chart */}
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
                    <Line type="monotone" dataKey="Weight" stroke="#3b82f6" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fat and BMI Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 flex items-center gap-2">
                <FiActivity className="text-purple-500" />
                BMI & Body Fat (%)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="BMI" stroke="#a855f7" strokeWidth={2} name="BMI" />
                    <Line type="monotone" dataKey="Fat" stroke="#ec4899" strokeWidth={2} name="Body Fat %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 flex items-center gap-2">
              <FiSliders className="text-blue-500" /> Measurements History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold bg-slate-50/70 dark:bg-slate-850">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">BMI</th>
                    <th className="py-3 px-4">Chest</th>
                    <th className="py-3 px-4">Waist</th>
                    <th className="py-3 px-4">Arms</th>
                    <th className="py-3 px-4">Thighs</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs">
                      <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                        {new Date(h.date || h.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold">{h.weight} kg</td>
                      <td className="py-3 px-4">{h.bmi || "--"}</td>
                      <td className="py-3 px-4">{h.chest ? `${h.chest} cm` : "--"}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">{h.waist ? `${h.waist} cm` : "--"}</td>
                      <td className="py-3 px-4">{h.arms ? `${h.arms} cm` : "--"}</td>
                      <td className="py-3 px-4">{h.thighs ? `${h.thighs} cm` : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Progress Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Log Body Metrics</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    placeholder="178"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    placeholder="15.2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                    placeholder="102"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                    placeholder="82"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Arms (cm)</label>
                  <input
                    type="number"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                    placeholder="38"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Thighs (cm)</label>
                  <input
                    type="number"
                    value={formData.thighs}
                    onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                    placeholder="58"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 p-2"
                  placeholder="How do you feel today? Any personal records?"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Record Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressView;
