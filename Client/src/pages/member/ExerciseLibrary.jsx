import { useEffect, useState } from "react";
import { getAllExercises } from "../../services/exercise.service";
import toast from "react-hot-toast";
import { FiSearch, FiSliders, FiVideo, FiAlertCircle } from "react-icons/fi";

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");

  const [activeEx, setActiveEx] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const res = await getAllExercises();
        if (res.success) {
          setExercises(res.exercises);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load exercise library");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const muscles = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Cardio"];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Exercise Library</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search and learn correct forms, safety tips, and guide videos.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm max-w-sm w-full">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs"
          />
        </div>

        {/* Muscle group tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-thin">
          {muscles.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedMuscle === m ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="p-8 text-center text-slate-550">Loading library...</div>
      ) : filteredExercises.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          No exercises found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExercises.map(ex => (
            <div
              key={ex._id}
              onClick={() => setActiveEx(ex)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                  {ex.muscleGroup}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1 line-clamp-1">{ex.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-2">{ex.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3 text-[10px] uppercase font-semibold text-slate-400">
                <span>Equipment: {ex.equipment?.[0] || "Bodyweight"}</span>
                <span className={`px-2 py-0.5 rounded ${ex.difficulty === "beginner" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20" : ex.difficulty === "intermediate" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
                  {ex.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeEx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-xl animate-in fade-in zoom-in duration-150 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                  {activeEx.muscleGroup} • {activeEx.difficulty}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeEx.name}</h2>
              </div>
              <button
                onClick={() => setActiveEx(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* GIF Preview Mockup */}
            {activeEx.gifUrl && (
              <div className="w-full h-48 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200/50 dark:border-slate-800 relative group">
                <img
                  src={activeEx.gifUrl}
                  alt={activeEx.name}
                  className="h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded uppercase">
                  Animation Demo
                </span>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">How to Perform:</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeEx.description}
              </p>
            </div>

            {/* Details specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800 py-4 text-xs">
              <div>
                <span className="text-slate-450 uppercase font-semibold text-[10px]">Equipment</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeEx.equipment?.join(", ") || "Bodyweight"}</p>
              </div>
              <div>
                <span className="text-slate-450 uppercase font-semibold text-[10px]">Target Sets/Reps</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeEx.sets || 4} sets × {activeEx.reps || "10"} reps</p>
              </div>
              <div>
                <span className="text-slate-450 uppercase font-semibold text-[10px]">Target Rest</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeEx.restTime || 90} seconds</p>
              </div>
            </div>

            {/* Tips / Safety */}
            <div className="space-y-4">
              {activeEx.safetyInstructions && (
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/30 text-amber-800 dark:text-amber-300 text-xs flex gap-2">
                  <FiAlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <strong className="block font-bold">Safety Instructions:</strong>
                    <span className="leading-relaxed">{activeEx.safetyInstructions}</span>
                  </div>
                </div>
              )}
              {activeEx.commonMistakes && (
                <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-200/30 text-red-700 dark:text-red-450 text-xs">
                  <strong className="block font-bold">Common Mistakes:</strong>
                  <span className="leading-relaxed">{activeEx.commonMistakes}</span>
                </div>
              )}
            </div>

            {/* Video Link */}
            {activeEx.youtubeUrl && (
              <div className="pt-2">
                <a
                  href={activeEx.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  <FiVideo />
                  Watch Video Tutorial
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
