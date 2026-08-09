import { useEffect, useState } from "react";
import { getAllPayments, recordPayment, deletePayment, getAllUsers, getMembershipPlans } from "../../services/admin.service";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiDollarSign, FiSearch, FiPrinter } from "react-icons/fi";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    membershipPlanId: "",
    amount: "",
    paymentMethod: "cash",
    paymentStatus: "completed",
    transactionId: "",
    notes: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, usersRes, plansRes] = await Promise.all([
        getAllPayments(),
        getAllUsers(),
        getMembershipPlans()
      ]);

      if (payRes.success) {
        setPayments(payRes.payments);
      }
      if (usersRes.success) {
        setMembers(usersRes.users.filter(u => u.role === "member"));
      }
      if (plansRes.success) {
        setPlans(plansRes.plans);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payments history");
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
      const res = await recordPayment({
        ...formData,
        amount: Number(formData.amount)
      });
      if (res.success) {
        toast.success("Payment recorded successfully");
        setShowAddModal(false);
        setFormData({
          memberId: "",
          membershipPlanId: "",
          amount: "",
          paymentMethod: "cash",
          paymentStatus: "completed",
          transactionId: "",
          notes: ""
        });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log payment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const res = await deletePayment(id);
      if (res.success) {
        toast.success("Payment record deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete payment record");
    }
  };

  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find(p => p._id === planId);
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, membershipPlanId: planId, amount: selectedPlan.price }));
    } else {
      setFormData(prev => ({ ...prev, membershipPlanId: planId, amount: "" }));
    }
  };

  const filteredPayments = payments.filter(
    p => p.memberId?.name.toLowerCase().includes(search.toLowerCase()) || p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Payments Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Record payments and trace transactions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
        >
          <FiPlus size={18} />
          Record Payment
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm max-w-md">
        <FiSearch className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by member name or transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading payments registry...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No payment transactions recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-semibold bg-slate-50/70 dark:bg-slate-850">
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Plan / Pack</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                      <FiDollarSign className="text-blue-500" />
                      {p.memberId?.name || "Unknown Member"}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{p.membershipPlanId?.name || "N/A"}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">${p.amount}</td>
                    <td className="py-4 px-6 capitalize text-slate-500 dark:text-slate-400 text-xs font-semibold">{p.paymentMethod}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">{p.transactionId || "CASH-ENTRY"}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.paymentStatus === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                        title="Print Invoice"
                      >
                        <FiPrinter size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Record"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Record New Payment</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Select Member</label>
                <select
                  required
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Select Package</label>
                  <select
                    required
                    value={formData.membershipPlanId}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="">-- Choose Package --</option>
                    {plans.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI / QR Scan</option>
                    <option value="online">Online Payment</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Transaction ID (Online/Card)</label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  placeholder="TXN-123456"
                />
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
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
