import { useEffect, useState } from "react";
import { getAttendanceHistory } from "../../services/member.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiActivity } from "react-icons/fi";

const AttendanceView = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await getAttendanceHistory(user?.id);
        if (res.success) {
          setHistory(res.attendance || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchAttendance();
  }, [user]);

  // Compute streaks
  const totalSessions = history.length;
  const averageDuration = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.duration || 0), 0) / history.length)
    : 0;

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Attendance Calendar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review your gym check-in records and session logs.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading history...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Quick Metrics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-center">
            <h3 className="text-xs font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3 text-left">
              Gym Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                <FiActivity className="text-blue-500 mx-auto mb-2" size={24} />
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Workouts</span>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{totalSessions}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                <FiClock className="text-emerald-500 mx-auto mb-2" size={24} />
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Time</span>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{averageDuration} m</p>
              </div>
            </div>
          </div>

          {/* List of records */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
              <FiCalendar /> Check-In Log history
            </h3>
            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No check-in entries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map(log => (
                  <div key={log._id} className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {new Date(log.date).toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase flex items-center gap-1">
                        <FiClock />
                        Check-in: {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {log.checkOut && ` • Check-out: ${new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        Present
                      </span>
                      {log.duration > 0 && (
                        <span className="block text-[10px] text-slate-400 font-semibold mt-1">Duration: {log.duration} min</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
