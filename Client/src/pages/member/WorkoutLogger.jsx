import { useEffect, useState, useRef } from "react";
import { getCurrentWorkoutPlan, logWorkout } from "../../services/member.service";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem } from "../../components/ui/AnimatedComponents";
import { FiCheck, FiPlay, FiClock, FiSave, FiList } from "react-icons/fi";

const WorkoutLogger = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Logger states
  const [activeExercise, setActiveExercise] = useState(null);
  const [setsInput, setSetsInput] = useState([]);
  const [loggedExercises, setLoggedExercises] = useState({}); // { [exerciseId]: true }
  
  // Timer State
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDayName = weekdays[new Date().getDay()];

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
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  // Timer Control
  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(timerIntervalRef.current);
  }, []);

  const selectExerciseForLogging = (exItem) => {
    setActiveExercise(exItem);
    startTimer(); // auto start timer on logging first workout
    
    // Initialize inputs based on target sets
    const initialSets = [];
    const count = exItem.sets || 4;
    for (let i = 1; i <= count; i++) {
      initialSets.push({
        setNumber: i,
        weight: exItem.weight || 0,
        repsCompleted: Number(exItem.reps) || 10,
        isComplete: false
      });
    }
    setSetsInput(initialSets);
  };

  const handleSetChange = (index, field, value) => {
    setSetsInput(prev => {
      const updated = [...prev];
      updated[index][field] = Number(value) || 0;
      return updated;
    });
  };

  const toggleSetComplete = (index) => {
    setSetsInput(prev => {
      const updated = [...prev];
      updated[index].isComplete = !updated[index].isComplete;
      return updated;
    });
  };

  const saveExerciseLog = async () => {
    if (!activeExercise) return;

    try {
      const durationMins = Math.round(timer / 60);
      const res = await logWorkout({
        workoutPlanId: plan._id,
        exerciseId: activeExercise.exerciseId?._id,
        day: currentDayName,
        sets: setsInput,
        duration: durationMins,
        notes: "Logged via GYMPRO Workout Logger"
      });

      if (res.success) {
        toast.success(`Logged ${activeExercise.exerciseId?.name}!`);
        setLoggedExercises(prev => ({ ...prev, [activeExercise.exerciseId?._id]: true }));
        setActiveExercise(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save log");
    }
  };

  const todayWorkout = plan?.days?.find(d => d.day === currentDayName);

  // Time Formatter
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading logger tools...</div>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Active Workout Logger</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Log weights, reps, and check off sets in real-time.</p>
        </div>

        {/* Workout Timer */}
        {plan && (
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-2xl shadow-sm">
            <FiClock className="text-blue-500 animate-pulse" size={18} />
            <span className="font-mono font-bold text-base">{formatTime(timer)}</span>
            <button
              onClick={isTimerRunning ? pauseTimer : startTimer}
              className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${isTimerRunning ? "bg-amber-500" : "bg-blue-600"}`}
            >
              {isTimerRunning ? "Pause" : "Resume"}
            </button>
          </div>
        )}
      </div>

      {!plan ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 shadow-sm">
          No workout plans assigned. Cannot log session.
        </div>
      ) : todayWorkout?.isRestDay || !todayWorkout || todayWorkout.exercises?.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 shadow-sm">
          Today is scheduled as a Rest Day. No log inputs required.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Today's Exercises List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
              <FiList /> Exercises list ({currentDayName})
            </h3>
            <StaggerContainer className="space-y-3">
              {todayWorkout.exercises.map((item, index) => {
                const isLogged = loggedExercises[item.exerciseId?._id];
                const isActive = activeExercise?.exerciseId?._id === item.exerciseId?._id;
                return (
                  <StaggerItem key={index}>
                    <motion.div
                      whileHover={!isLogged ? { scale: 1.015, x: 2 } : {}}
                      whileTap={!isLogged ? { scale: 0.985 } : {}}
                      onClick={() => !isLogged && selectExerciseForLogging(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${isLogged ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 cursor-not-allowed" : isActive ? "border-blue-600 dark:border-blue-500 bg-blue-50/30" : "bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800 hover:border-slate-350"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{item.exerciseId?.name}</span>
                        {isLogged && <FiCheck className="text-emerald-500" size={18} />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                        Target: {item.sets} Sets × {item.reps} Reps
                      </p>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Active Log Inputs */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {activeExercise ? (
                <motion.div
                  key={activeExercise.exerciseId?._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 120, damping: 15 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Logging: {activeExercise.exerciseId?.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Enter completed logs for each set below.
                    </p>
                  </div>

                  {/* Sets Editor */}
                  <div className="space-y-3">
                    {setsInput.map((set, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${set.isComplete ? "bg-blue-50/20 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30" : "bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800"}`}
                      >
                        <span className="font-bold text-xs">Set {set.setNumber}</span>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => handleSetChange(idx, "weight", e.target.value)}
                              className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none text-center text-xs font-bold"
                            />
                            <span className="text-[10px] text-slate-450 uppercase font-semibold">kg</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={set.repsCompleted}
                              onChange={(e) => handleSetChange(idx, "repsCompleted", e.target.value)}
                              className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none text-center text-xs font-bold"
                            />
                            <span className="text-[10px] text-slate-450 uppercase font-semibold">reps</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSetComplete(idx)}
                            className={`p-1.5 rounded-lg border transition-all ${set.isComplete ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 dark:border-slate-700 text-slate-400 hover:border-slate-400"}`}
                          >
                            <FiCheck size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveExerciseLog}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all duration-200"
                    >
                      <FiSave /> Save Exercise Log
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3"
                >
                  <FiPlay size={36} className="text-slate-355 text-blue-500 animate-bounce" />
                  <p className="font-semibold text-sm">No exercise active.</p>
                  <p className="text-xs text-slate-400 max-w-xs">Select an exercise from the left panel to begin logging sets and weights.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;
