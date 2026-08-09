import { useEffect, useState } from "react";
import { getAllExercises, createExercise, updateExercise, deleteExercise } from "../../services/exercise.service";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiSliders } from "react-icons/fi";

const ManageExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selected/Form State
  const [selectedEx, setSelectedEx] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    muscleGroup: "Chest",
    difficulty: "beginner",
    equipment: "",
    sets: 4,
    reps: "10",
    restTime: 90,
    safetyInstructions: "",
    commonMistakes: "",
    youtubeUrl: "",
    gifUrl: ""
  });

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await getAllExercises();
      if (res.success) {
        setExercises(res.exercises);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const equipArray = formData.equipment.split(",").map(e => e.trim()).filter(Boolean);
      const res = await createExercise({ ...formData, equipment: equipArray });
      if (res.success) {
        toast.success("Exercise created in library");
        setShowAddModal(false);
        resetForm();
        fetchExercises();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create exercise");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const equipArray = typeof formData.equipment === "string" 
        ? formData.equipment.split(",").map(e => e.trim()).filter(Boolean)
        : formData.equipment;
      const res = await updateExercise(selectedEx._id, { ...formData, equipment: equipArray });
      if (res.success) {
        toast.success("Exercise updated successfully");
        setShowEditModal(false);
        setSelectedEx(null);
        resetForm();
        fetchExercises();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update exercise");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise from the library?")) return;
    try {
      const res = await deleteExercise(id);
      if (res.success) {
        toast.success("Exercise deleted");
        fetchExercises();
      }
    } catch (error) {
      toast.error("Failed to delete exercise");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      muscleGroup: "Chest",
      difficulty: "beginner",
      equipment: "",
      sets: 4,
      reps: "10",
      restTime: 90,
      safetyInstructions: "",
      commonMistakes: "",
      youtubeUrl: "",
      gifUrl: ""
    });
  };

  const filteredExercises = exercises.filter(
    ex => ex.name.toLowerCase().includes(search.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Manage Exercises</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit, or delete exercises in the library.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
        >
          <FiPlus size={18} />
          Add Exercise
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm max-w-md">
        <FiSearch className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by exercise name or muscle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm"
        />
      </div>

      {/* Exercises Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading exercise library...</div>
        ) : filteredExercises.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No exercises found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-semibold bg-slate-50/70 dark:bg-slate-850">
                  <th className="py-4 px-6">Exercise</th>
                  <th className="py-4 px-6">Muscle Group</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExercises.map(ex => (
                  <tr key={ex._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm transition-colors duration-150">
                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                      <FiSliders className="text-blue-500" />
                      {ex.name}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium">{ex.muscleGroup}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ex.difficulty === "beginner" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : ex.difficulty === "intermediate" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400" : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"}`}>
                        {ex.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{ex.equipment?.join(", ") || "Bodyweight"}</td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedEx(ex);
                          setFormData({
                            name: ex.name,
                            description: ex.description,
                            muscleGroup: ex.muscleGroup,
                            difficulty: ex.difficulty,
                            equipment: ex.equipment?.join(", ") || "",
                            sets: ex.sets || 4,
                            reps: ex.reps || "10",
                            restTime: ex.restTime || 90,
                            safetyInstructions: ex.safetyInstructions || "",
                            commonMistakes: ex.commonMistakes || "",
                            youtubeUrl: ex.youtubeUrl || "",
                            gifUrl: ex.gifUrl || ""
                          });
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                        title="Edit Exercise"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ex._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Exercise"
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Add Exercise to Library</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Exercise Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 py-2"
                    placeholder="Bench Press"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Muscle Group</label>
                  <select
                    value={formData.muscleGroup}
                    onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 py-2.5"
                  >
                    {["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Cardio", "Full Body"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2outline-none focus:border-blue-500 p-2"
                  placeholder="Describe the form and setup..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Sets</label>
                  <input
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Reps</label>
                  <input
                    type="text"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Rest Time (seconds)</label>
                  <input
                    type="number"
                    value={formData.restTime}
                    onChange={(e) => setFormData({ ...formData, restTime: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Equipment (comma separated)</label>
                  <input
                    type="text"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                    placeholder="Barbell, Bench"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Safety Tips</label>
                <input
                  type="text"
                  value={formData.safetyInstructions}
                  onChange={(e) => setFormData({ ...formData, safetyInstructions: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  placeholder="Avoid rounding the back..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">YouTube Tutorial Link</label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none text-xs"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Animated GIF Link</label>
                  <input
                    type="text"
                    value={formData.gifUrl}
                    onChange={(e) => setFormData({ ...formData, gifUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none text-xs"
                    placeholder="https://..."
                  />
                </div>
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
                  Create Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Edit Exercise Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Exercise Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Muscle Group</label>
                  <select
                    value={formData.muscleGroup}
                    onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none"
                  >
                    {["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Cardio", "Full Body"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Sets</label>
                  <input
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Reps</label>
                  <input
                    type="text"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Rest Time (sec)</label>
                  <input
                    type="number"
                    value={formData.restTime}
                    onChange={(e) => setFormData({ ...formData, restTime: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Equipment (comma separated)</label>
                  <input
                    type="text"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Safety Tips</label>
                <input
                  type="text"
                  value={formData.safetyInstructions}
                  onChange={(e) => setFormData({ ...formData, safetyInstructions: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">YouTube Link</label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">GIF Link</label>
                  <input
                    type="text"
                    value={formData.gifUrl}
                    onChange={(e) => setFormData({ ...formData, gifUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEx(null);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExercises;
