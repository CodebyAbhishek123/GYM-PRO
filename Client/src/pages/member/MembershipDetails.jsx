import { useEffect, useState } from "react";
import { getMemberDashboard, getMemberPayments } from "../../services/member.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiAward, FiCheck, FiDollarSign, FiCreditCard } from "react-icons/fi";

const MembershipDetails = () => {
  const { user } = useAuth();
  const [membership, setMembership] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        setLoading(true);
        const [dashRes, payRes] = await Promise.all([
          getMemberDashboard(),
          getMemberPayments(user?.id)
        ]);

        if (dashRes.success) {
          setMembership(dashRes.membership);
        }
        if (payRes.success) {
          setPayments(payRes.payments || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load membership details");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchMembershipData();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading plan details...</div>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Membership Details</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">View active packages, renewal details, and payment histories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Active plan details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
            <FiAward /> Active Subscription
          </h3>

          {membership ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Gym Package</span>
                <h4 className="text-2xl font-black mt-1">{membership.membershipPlanId?.name}</h4>
                <p className="text-sm text-blue-100 mt-2 font-bold">${membership.membershipPlanId?.price} / Month</p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 py-2">
                  <span className="text-slate-500">Start Date</span>
                  <span className="font-semibold">{new Date(membership.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 py-2">
                  <span className="text-slate-500">Renewal Date</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {new Date(membership.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 py-2">
                  <span className="text-slate-500">Access Hours</span>
                  <span className="font-semibold">{membership.membershipPlanId?.accessHours || "24/7"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 py-2">
                  <span className="text-slate-500">Status</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-[10px] font-bold uppercase">
                    {membership.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-6">No active subscription plan configured.</p>
          )}
        </div>

        {/* Payments history */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
            <FiCreditCard /> Payment History
          </h3>

          {payments.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No billing history found.</p>
          ) : (
            <div className="space-y-4">
              {payments.map(p => (
                <div key={p._id} className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-blue-500">
                      <FiDollarSign size={18} />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{p.membershipPlanId?.name || "Membership Renewal"}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase">
                        Method: {p.paymentMethod} • Date: {new Date(p.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white block">${p.amount}</span>
                    <span className="inline-block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                      {p.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipDetails;
