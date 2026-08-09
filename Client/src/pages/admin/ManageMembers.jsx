import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser, createUser, getMembershipPlans, createMembership, getAllMemberships } from "../../services/admin.service";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiAward, FiShield } from "react-icons/fi";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  // Selected/Form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", address: "", gender: "male" });
  const [membershipData, setMembershipData] = useState({ membershipPlanId: "", startDate: "", endDate: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, plansRes, membershipsRes] = await Promise.all([
        getAllUsers(),
        getMembershipPlans(),
        getAllMemberships()
      ]);

      if (usersData.success) {
        setMembers(usersData.users.filter(u => u.role === "member"));
        setTrainers(usersData.users.filter(u => u.role === "trainer"));
      }
      if (plansRes.success) {
        setPlans(plansRes.plans);
      }
      if (membershipsRes.success) {
        setMemberships(membershipsRes.memberships);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load members data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createUser({ ...formData, role: "member" });
      if (res.success) {
        toast.success("Member added successfully");
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "", phone: "", address: "", gender: "male" });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser(selectedUser._id, formData);
      if (res.success) {
        toast.success("Member details updated");
        setShowEditModal(false);
        setSelectedUser(null);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success("Member deleted successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createMembership({
        memberId: selectedUser._id,
        membershipPlanId: membershipData.membershipPlanId,
        startDate: new Date(membershipData.startDate),
        endDate: new Date(membershipData.endDate),
        status: "active"
      });
      if (res.success) {
        toast.success("Membership plan assigned successfully");
        setShowMembershipModal(false);
        setMembershipData({ membershipPlanId: "", startDate: "", endDate: "" });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign membership");
    }
  };

  const filteredMembers = members.filter(
    m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  const getMemberMembership = (memberId) => {
    return memberships.find(m => m.memberId?._id === memberId && m.status === "active");
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Manage Members</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and update gym member accounts.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: "", email: "", password: "", phone: "", address: "", gender: "male" });
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
        >
          <FiPlus size={18} />
          Add Member
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm max-w-md">
        <FiSearch className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm"
        />
      </div>

      {/* Members table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading members data...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-semibold bg-slate-50/70 dark:bg-slate-850">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Active Plan</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(m => {
                  const mship = getMemberMembership(m._id);
                  return (
                    <tr key={m._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                      <td className="py-4 px-6 font-semibold">{m.name}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{m.email}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{m.phone || "N/A"}</td>
                      <td className="py-4 px-6">
                        {mship ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                            <FiCheck size={12} />
                            {mship.membershipPlanId?.name}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUser(m);
                              setMembershipData({ membershipPlanId: "", startDate: "", endDate: "" });
                              setShowMembershipModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 transition-colors"
                          >
                            <FiAward size={12} />
                            Assign Plan
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-6 flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedUser(m);
                            setFormData({ name: m.name, email: m.email, phone: m.phone || "", address: m.address || "", gender: m.gender || "male" });
                            setShowEditModal(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                          title="Edit Member"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete Member"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Add Gym Member</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  placeholder="••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                    placeholder="+123456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md"
                >
                  Create
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
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Edit Member Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Membership Assignment Modal */}
      {showMembershipModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">Assign Gym Membership</h3>
            <p className="text-slate-500 text-xs mb-4">Assign membership plan for {selectedUser?.name}.</p>
            <form onSubmit={handleMembershipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Select Plan</label>
                <select
                  required
                  value={membershipData.membershipPlanId}
                  onChange={(e) => setMembershipData({ ...membershipData, membershipPlanId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                >
                  <option value="">-- Choose a Package --</option>
                  {plans.map(p => (
                    <option key={p._id} value={p._id}>{p.name} - ${p.price} ({p.duration} mo)</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={membershipData.startDate}
                    onChange={(e) => setMembershipData({ ...membershipData, startDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={membershipData.endDate}
                    onChange={(e) => setMembershipData({ ...membershipData, endDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowMembershipModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md"
                >
                  Assign Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
