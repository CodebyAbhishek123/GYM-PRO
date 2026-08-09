import { useEffect, useState } from "react";
import { getAllAttendance, getAllUsers } from "../../services/admin.service";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiSearch } from "react-icons/fi";

const AttendanceReports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await getAllAttendance();
        if (res.success) {
          setLogs(res.attendance || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load attendance logs");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredLogs = logs.filter(
    log => log.memberId?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Attendance Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Daily check-in and workout duration registers.</p>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm max-w-md">
        <FiSearch className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by member name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading registers...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No attendance registers logged today.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-semibold bg-slate-50/70 dark:bg-slate-850">
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Check In</th>
                  <th className="py-4 px-6">Check Out</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                      <FiCalendar className="text-blue-500" />
                      {log.memberId?.name || "Unknown Member"}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400 text-xs">
                      {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400 text-xs">
                      {log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                    </td>
                    <td className="py-4 px-6 flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                      <FiClock />
                      {log.duration ? `${log.duration} min` : "In Progress"}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${log.status === "present" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;
