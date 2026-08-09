import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllMemberships } from "../../services/admin.service";
import { getAllExercises } from "../../services/exercise.service";
import { createWorkoutPlan } from "../../services/trainer.service";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiCalendar, FiArrowRight, FiCheck } from "react-icons/fi";

const WorkoutPlans = () => {
  const location = useLocation();
  const preSelectedMemberId = location.state?.memberId || "";

  const [members, setMembers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [memberId, setMemberId] = useState(preSelectedMemberId);
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const [activeDay, setActiveDay] = useState("monday");

  // days definition: { [day]: { name: "", description: "", isRestDay: false, exercises: [] } }
  const [daysData, setDaysData] = useState(() => {
    const initial = {};
    weekdays.forEach(day => {
      initial[day] = {
        name: day.charAt(0).toUpperCase() + day.slice(1) + " Workout",
        description: "",
        isRestDay: false,
        exercises: []
      };
    });
    return initial;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [memRes, exRes] = await Promise.all([
          getAllMemberships(),
          getAllExercises()
        ]);

        if (memRes.success) {
          // Extract unique members from memberships list
          const memberList = [];
          const seen = new Set();
          memRes.memberships.forEach(m => {
            if (m.memberId && !seen.has(m.memberId._id)) {
              seen.add(m.memberId._id);
              memberList.push(m.memberId);
            }
          });
          setMembers(memberList);
        }

        if (exRes.success) {
          setExercises(exRes.exercises);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dependency data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addExerciseToDay = (day) => {
    setDaysData(prev => {
      const updated = { ...prev };
      updated[day].exercises.push({
        exerciseId: "",
        sets: 4,
        reps: "10",
        weight: 0,
        restTime: 90,
        notes: ""
      });
      return updated;
    });
  };

  const removeExerciseFromDay = (day, index) => {
    setDaysData(prev => {
      const updated = { ...prev };
      updated[day].exercises.splice(index, 1);
      return updated;
    });
  };

  const handleExerciseChange = (day, index, field, value) => {
    setDaysData(prev => {
      const updated = { ...prev };
      updated[day].exercises[index][field] = value;
      return updated;
    });
  };

  const toggleRestDay = (day) => {
    setDaysData(prev => {
      const updated = { ...prev };
      updated[day].isRestDay = !updated[day].isRestDay;
      if (updated[day].isRestDay) {
        updated[day].exercises = [];
      }
      return updated;
    });
  };

  const handleDayFieldChange = (day, field, value) => {
    setDaysData(prev => {
      const updated = { ...prev };
      updated[day][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberId) return toast.error("Please select a member");
    if (!weekStartDate || !weekEndDate) return toast.error("Please select week date range");

    try {
      // Map daysData object into DB schema array
      const days = weekdays.map(dayKey => ({
        day: dayKey,
        name: daysData[dayKey].name,
        description: daysData[dayKey].description,
        isRestDay: daysData[dayKey].isRestDay,
        exercises: daysData[dayKey].exercises
      }));

      const res = await createWorkoutPlan({
        memberId,
        weekStartDate: new Date(weekStartDate),
        weekEndDate: new Date(weekEndDate),
        days,
        notes,
        status: "active"
      });

      if (res.success) {
        toast.success("Workout plan assigned successfully");
        // Reset form
        setMemberId("");
        setWeekStartDate("");
        setWeekEndDate("");
        setNotes("");
        setDaysData(() => {
          const initial = {};
          weekdays.forEach(day => {
            initial[day] = {
              name: day.charAt(0).toUpperCase() + day.slice(1) + " Workout",
              description: "",
              isRestDay: false,
              exercises: []
            };
          });
          return initial;
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create workout plan");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Weekly Workout Planner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Design and assign Monday-Sunday routines to members.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading planner tools...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Assign to Member</label>
              <select
                required
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="">-- Choose Member --</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Week Start Date</label>
              <input
                type="date"
                required
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Week End Date</label>
              <input
                type="date"
                required
                value={weekEndDate}
                onChange={(e) => setWeekEndDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
              />
            </div>
          </div>

          {/* Builder area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Weekday Sidebar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400 px-3 mb-2">Select Day</span>
              {weekdays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold capitalize flex items-center justify-between transition-colors ${activeDay === day ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400"}`}
                >
                  {day}
                  {daysData[day].isRestDay && (
                    <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded">
                      Rest
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Day Workouts Editor */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold capitalize text-slate-850 dark:text-white flex items-center gap-2">
                    {activeDay} Workout Details
                  </h3>
                  <p className="text-slate-400 text-xs">Configure exercises for this day.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={daysData[activeDay].isRestDay}
                      onChange={() => toggleRestDay(activeDay)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    Mark as Rest Day
                  </label>
                  {!daysData[activeDay].isRestDay && (
                    <button
                      type="button"
                      onClick={() => addExerciseToDay(activeDay)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-100 dark:border-blue-900/30 transition-colors"
                    >
                      <FiPlus size={14} />
                      Add Exercise
                    </button>
                  )}
                </div>
              </div>

              {daysData[activeDay].isRestDay ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  Rest Day. No workouts scheduled.
                </div>
              ) : daysData[activeDay].exercises.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  No exercises added. Click "Add Exercise" to start building.
                </div>
              ) : (
                <div className="space-y-4">
                  {daysData[activeDay].exercises.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative group">
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Select Exercise</label>
                        <select
                          required
                          value={item.exerciseId}
                          onChange={(e) => handleExerciseChange(activeDay, index, "exerciseId", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none text-xs"
                        >
                          <option value="">-- Choose Exercise --</option>
                          {exercises.map(ex => (
                            <option key={ex._id} value={ex._id}>{ex.name} ({ex.muscleGroup})</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sets</label>
                        <input
                          type="number"
                          required
                          value={item.sets}
                          onChange={(e) => handleExerciseChange(activeDay, index, "sets", Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Reps</label>
                        <input
                          type="text"
                          required
                          value={item.reps}
                          onChange={(e) => handleExerciseChange(activeDay, index, "reps", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                          placeholder="e.g. 10"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Rest (sec)</label>
                        <input
                          type="number"
                          value={item.restTime}
                          onChange={(e) => handleExerciseChange(activeDay, index, "restTime", Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                        />
                      </div>
                      <div className="md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeExerciseFromDay(activeDay, index)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Remove Exercise"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes & Submission */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Plan Notes / Instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 p-2"
                placeholder="Include custom tips or goals for the member..."
                rows={3}
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all duration-200"
              >
                <FiCheck size={18} />
                Assign Weekly Plan
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkoutPlans;
