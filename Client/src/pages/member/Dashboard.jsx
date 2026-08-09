import { useEffect, useState } from "react";
import { getMemberDashboard, checkIn, checkOut } from "../../services/member.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, HoverCard } from "../../components/ui/AnimatedComponents";
import {
  FiCheckCircle,
  FiCalendar,
  FiAward,
  FiBookOpen,
  FiSliders,
  FiHeart,
  FiMapPin,
  FiClock
} from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await getMemberDashboard();
      if (res.success) {
        setData(res);
        // Find if checked in today
        const todayStr = new Date().toDateString();
        const latest = res.attendance?.[0];
        if (latest && new Date(latest.date).toDateString() === todayStr) {
          setTodayRecord(latest);
          setCheckedIn(latest.checkIn && !latest.checkOut);
        } else {
          setTodayRecord(null);
          setCheckedIn(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAttendanceToggle = async () => {
    try {
      if (!checkedIn) {
        const res = await checkIn();
        if (res.success) {
          toast.success("Checked in successfully! Enjoy your workout! 💪");
          fetchDashboard();
        }
      } else {
        const res = await checkOut();
        if (res.success) {
          toast.success("Checked out successfully! Good job today! 👏");
          fetchDashboard();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Attendance logging failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // Get current weekday target workout
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDayName = weekdays[new Date().getDay()];
  const todayWorkout = data?.workout?.days?.find(d => d.day === currentDayName);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 gap-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Hey, {user?.name}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Track your daily targets and keep pushing limits.</p>
        </div>

        {/* Quick Check-In Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            onClick={handleAttendanceToggle}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-colors duration-300 ${checkedIn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {checkedIn ? "Check Out of Gym" : "Check In to Gym"}
          </motion.button>
          {todayRecord?.checkIn && (
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <FiClock />
              Checked-in at: {new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Targets */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Today's Workout */}
        <StaggerItem>
          <HoverCard className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FiSliders className="text-blue-500" />
              Today's Workout ({currentDayName})
            </h3>
            {todayWorkout?.isRestDay || !todayWorkout ? (
              <div className="py-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                Today is a Rest Day. Relax and recover! 🧘‍♂️
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 capitalize">{todayWorkout.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{todayWorkout.description}</p>
                <div className="space-y-2 mt-4">
                  {todayWorkout.exercises?.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{ex.exerciseId?.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                        {ex.sets} sets × {ex.reps} reps
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </HoverCard>
        </StaggerItem>

        {/* Today's Diet Plan */}
        <StaggerItem>
          <HoverCard className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FiBookOpen className="text-emerald-500" />
              Nutritional Goals
            </h3>
            {data?.diet ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Target Calories</span>
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                      {data.diet.dailyCalories} kcal
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Water Goal</span>
                    <p className="text-lg font-extrabold text-blue-500 mt-1">
                      {data.diet.waterIntake || 3} Liters
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-2">
                  <span className="block text-[10px] font-bold uppercase text-slate-400">Meal Schedule</span>
                  {data.diet.meals?.slice(0, 3).map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg">
                      <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{m.mealType.replace("_", " ")}</span>
                      <span className="text-slate-400 text-[10px] font-mono">{m.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                No active diet plan assigned yet.
              </div>
            )}
          </HoverCard>
        </StaggerItem>

        {/* Membership Details */}
        <StaggerItem>
          <HoverCard className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FiAward className="text-amber-500" />
              Membership Status
            </h3>
            {data?.membership ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/30 text-amber-800 dark:text-amber-300">
                  <span className="text-[10px] uppercase font-bold text-amber-500">Active package</span>
                  <h4 className="text-lg font-extrabold mt-1">{data.membership.membershipPlanId?.name}</h4>
                  <p className="text-xs text-slate-500 mt-2">
                    Expires: {new Date(data.membership.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 py-1.5">
                    <span className="text-slate-500">Access Hours</span>
                    <span className="font-semibold">{data.membership.membershipPlanId?.accessHours || "24/7"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 py-1.5">
                    <span className="text-slate-500">Start Date</span>
                    <span className="font-semibold">{new Date(data.membership.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                No active membership subscription. Contact Admin to activate.
              </div>
            )}
          </HoverCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default Dashboard;