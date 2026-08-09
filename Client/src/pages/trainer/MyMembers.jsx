import { useEffect, useState } from "react";
import { getWorkoutPlans } from "../../services/trainer.service";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiActivity, FiArrowRight, FiBookOpen, FiSliders } from "react-icons/fi";

const MyMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        setLoading(true);
        const res = await getWorkoutPlans();
        if (res.success) {
          const myPlans = res.workoutPlans.filter(p => p.trainerId?._id === user?.id);
          const membersMap = {};
          myPlans.forEach(p => {
            if (p.memberId) {
              membersMap[p.memberId._id] = {
                id: p.memberId._id,
                name: p.memberId.name,
                email: p.memberId.email,
                planStatus: p.status,
                planId: p._id,
                phone: p.memberId.phone || "N/A"
              };
            }
          });
          setMembers(Object.values(membersMap));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load trainees list");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainees();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Assigned Members</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage workout routines, meal plans, and review progress logs.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-500">No members have been assigned to you yet.</p>
          <p className="text-slate-400 text-xs mt-2">Use the Workout Plans tab to create a plan for any gym member to link them to your console.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(m => (
            <div key={m.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl uppercase">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{m.name}</h3>
                    <p className="text-xs text-slate-400">{m.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <p><strong>Phone:</strong> {m.phone}</p>
                  <p>
                    <strong>Plan: </strong>
                    <span className="capitalize text-emerald-600 dark:text-emerald-400 font-semibold">{m.planStatus}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                <button
                  onClick={() => navigate("/trainer/workouts", { state: { memberId: m.id } })}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-[10px] font-bold"
                  title="Assign Workout"
                >
                  <FiSliders size={16} />
                  Workouts
                </button>
                <button
                  onClick={() => navigate("/trainer/diets", { state: { memberId: m.id } })}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-[10px] font-bold"
                  title="Assign Diet"
                >
                  <FiBookOpen size={16} />
                  Diets
                </button>
                <button
                  onClick={() => navigate(`/trainer/members/${m.id}/progress`)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all text-[10px] font-bold"
                  title="View Progress"
                >
                  <FiActivity size={16} />
                  Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMembers;
