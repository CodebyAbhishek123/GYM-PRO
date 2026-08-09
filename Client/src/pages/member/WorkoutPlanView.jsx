import { useEffect, useState } from "react";
import { getCurrentWorkoutPlan } from "../../services/member.service";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiActivity } from "react-icons/fi";

const WorkoutPlanView = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const [activeDay, setActiveDay] = useState("monday");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await getCurrentWorkoutPlan();
        if (res.success) {
          setPlan(res.workoutPlan);
        }
      } catch (error) {
        console.error(error);
        // Toast optional since no plan assigned is a common valid state
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const activeDayWorkout = plan?.days?.find(d => d.day === activeDay);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading workout plan...</div>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">My Workout Routine</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">View weekly exercise schedules customized by your trainer.</p>
      </div>

      {!plan ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 shadow-sm">
          No active workout plan has been assigned to you for this week.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Week Metadata */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong>Trainer Assigned: </strong> {plan.trainerId?.name || "Fitness Coach"}
            </span>
            <span>
              <strong>Duration: </strong> {new Date(plan.weekStartDate).toLocaleDateString()} - {new Date(plan.weekEndDate).toLocaleDateString()}
            </span>
          </div>

          {/* Plan Builder grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Weekday Tab Selectors */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400 px-3 mb-2">Select Weekday</span>
              {weekdays.map(day => {
                const dayWorkout = plan.days?.find(d => d.day === day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setActiveDay(day)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold capitalize flex items-center justify-between transition-colors ${activeDay === day ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-400"}`}
                  >
                    {day}
                    {dayWorkout?.isRestDay && (
                      <span className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded">
                        Rest
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Displaying Exercises */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-850 dark:text-white capitalize flex items-center gap-2">
                  {activeDayWorkout?.name || `${activeDay} routine`}
                </h3>
                {activeDayWorkout?.description && (
                  <p className="text-slate-400 text-xs mt-1">{activeDayWorkout.description}</p>
                )}
              </div>

              {activeDayWorkout?.isRestDay || !activeDayWorkout || activeDayWorkout.exercises?.length === 0 ? (
                <div className="p-8 text-center text-slate-450 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  🧘‍♂️ Rest Day. Recovery is where the muscle grows!
                </div>
              ) : (
                <div className="space-y-4">
                  {activeDayWorkout.exercises.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{item.exerciseId?.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.exerciseId?.description}</p>
                      </div>

                      <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-800">
                          {item.sets} Sets
                        </span>
                        <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-800">
                          {item.reps} Reps
                        </span>
                        {item.restTime > 0 && (
                          <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-800 flex items-center gap-1.5">
                            <FiClock /> {item.restTime}s rest
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanView;
