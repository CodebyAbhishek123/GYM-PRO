import { useEffect, useState } from "react";
import { getMembershipPlans, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan } from "../../services/admin.service";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiAward } from "react-icons/fi";

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 1,
    price: 0,
    features: "",
    maxTrainerSessions: 0,
    freezeDays: 0,
    accessHours: "24/7",
    status: "active"
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getMembershipPlans();
      if (res.success) {
        setPlans(res.plans);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = formData.features.split(",").map(f => f.trim()).filter(Boolean);
      const res = await createMembershipPlan({ ...formData, features: featuresArray });
      if (res.success) {
        toast.success("Membership plan created");
        setShowAddModal(false);
        resetForm();
        fetchPlans();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create membership plan");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = typeof formData.features === "string"
        ? formData.features.split(",").map(f => f.trim()).filter(Boolean)
        : formData.features;
      const res = await updateMembershipPlan(selectedPlan._id, { ...formData, features: featuresArray });
      if (res.success) {
        toast.success("Membership plan updated");
        setShowEditModal(false);
        setSelectedPlan(null);
        resetForm();
        fetchPlans();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update plan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this membership plan?")) return;
    try {
      const res = await deleteMembershipPlan(id);
      if (res.success) {
        toast.success("Plan deleted successfully");
        fetchPlans();
      }
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: 1,
      price: 0,
      features: "",
      maxTrainerSessions: 0,
      freezeDays: 0,
      accessHours: "24/7",
      status: "active"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Membership Packages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure pricing and plans details.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
        >
          <FiPlus size={18} />
          Add Package
        </button>
      </div>

      {/* Grid of Packages */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No membership packages configured yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <FiAward size={20} />
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${p.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{p.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${p.price}</span>
                  <span className="text-slate-400 text-xs">/ {p.duration} {p.duration === 1 ? "month" : "months"}</span>
                </div>

                <ul className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {p.features?.map((f, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedPlan(p);
                    setFormData({
                      name: p.name,
                      description: p.description || "",
                      duration: p.duration,
                      price: p.price,
                      features: p.features?.join(", ") || "",
                      maxTrainerSessions: p.maxTrainerSessions || 0,
                      freezeDays: p.freezeDays || 0,
                      accessHours: p.accessHours || "24/7",
                      status: p.status
                    });
                    setShowEditModal(true);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Add Membership Package</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Pro Quarterly"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 p-2"
                  placeholder="Description of the plan..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  placeholder="Locker Room access, 24/7 entry"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Trainer Sessions</label>
                  <input
                    type="number"
                    value={formData.maxTrainerSessions}
                    onChange={(e) => setFormData({ ...formData, maxTrainerSessions: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Freeze Days</label>
                  <input
                    type="number"
                    value={formData.freezeDays}
                    onChange={(e) => setFormData({ ...formData, freezeDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Edit Package Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 p-2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Trainer Sessions</label>
                  <input
                    type="number"
                    value={formData.maxTrainerSessions}
                    onChange={(e) => setFormData({ ...formData, maxTrainerSessions: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Freeze Days</label>
                  <input
                    type="number"
                    value={formData.freezeDays}
                    onChange={(e) => setFormData({ ...formData, freezeDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPlan(null);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
