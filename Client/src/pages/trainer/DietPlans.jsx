import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllMemberships } from "../../services/admin.service";
import { createDietPlan } from "../../services/trainer.service";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiCheck } from "react-icons/fi";

const DietPlans = () => {
  const location = useLocation();
  const preSelectedMemberId = location.state?.memberId || "";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [memberId, setMemberId] = useState(preSelectedMemberId);
  const [goal, setGoal] = useState("muscle_gain");
  const [dailyCalories, setDailyCalories] = useState(2500);
  const [protein, setProtein] = useState(150);
  const [carbohydrates, setCarbohydrates] = useState(250);
  const [fats, setFats] = useState(70);
  const [waterIntake, setWaterIntake] = useState(3.5);
  const [restrictions, setRestrictions] = useState("");
  const [notes, setNotes] = useState("");

  const [meals, setMeals] = useState([
    { mealType: "breakfast", time: "08:00 AM", foods: "Oats, 4 Egg Whites, Banana", calories: 450, protein: 30, carbohydrates: 60, fats: 10 },
    { mealType: "lunch", time: "01:30 PM", foods: "Grilled Chicken Breast, Brown Rice, Broccoli", calories: 600, protein: 45, carbohydrates: 70, fats: 12 },
    { mealType: "dinner", time: "08:30 PM", foods: "Salmon Fillet, Sweet Potato, Asparagus", calories: 550, protein: 40, carbohydrates: 50, fats: 18 }
  ]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const memRes = await getAllMemberships();
        if (memRes.success) {
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
      } catch (error) {
        console.error(error);
        toast.error("Failed to load members list");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const addMeal = () => {
    setMeals(prev => [
      ...prev,
      { mealType: "snack", time: "05:00 PM", foods: "", calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
    ]);
  };

  const removeMeal = (index) => {
    setMeals(prev => prev.filter((_, i) => i !== index));
  };

  const handleMealChange = (index, field, value) => {
    setMeals(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberId) return toast.error("Please select a member");

    try {
      const parsedMeals = meals.map(m => ({
        ...m,
        foods: m.foods.split(",").map(f => f.trim()).filter(Boolean),
        calories: Number(m.calories),
        protein: Number(m.protein),
        carbohydrates: Number(m.carbohydrates),
        fats: Number(m.fats)
      }));

      const res = await createDietPlan({
        memberId,
        goal,
        dailyCalories: Number(dailyCalories),
        protein: Number(protein),
        carbohydrates: Number(carbohydrates),
        fats: Number(fats),
        waterIntake: Number(waterIntake),
        restrictions,
        notes,
        meals: parsedMeals,
        status: "active"
      });

      if (res.success) {
        toast.success("Diet plan assigned successfully");
        setMemberId("");
        setRestrictions("");
        setNotes("");
        setMeals([
          { mealType: "breakfast", time: "08:00 AM", foods: "", calories: 0, protein: 0, carbohydrates: 0, fats: 0 },
          { mealType: "lunch", time: "01:30 PM", foods: "", calories: 0, protein: 0, carbohydrates: 0, fats: 0 },
          { mealType: "dinner", time: "08:30 PM", foods: "", calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
        ]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create diet plan");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Goal-Based Diet Planner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Design daily nutrition schedules and target macros for trainees.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading diet modules...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Select Member</label>
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
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Fitness Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="muscle_gain">Muscle Gain</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Water Intake (Liters/day)</label>
              <input
                type="number"
                step="0.1"
                required
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none"
              />
            </div>
          </div>

          {/* Macro Targets Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">Daily Nutrition Macro Targets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Target Calories (kcal)</label>
                <input
                  type="number"
                  required
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Target Protein (g)</label>
                <input
                  type="number"
                  required
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Target Carbs (g)</label>
                <input
                  type="number"
                  required
                  value={carbohydrates}
                  onChange={(e) => setCarbohydrates(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Target Fats (g)</label>
                <input
                  type="number"
                  required
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Meals list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-850 dark:text-white">Daily Meals</h3>
                <p className="text-slate-400 text-xs">Define timing and macro breakdown for specific meals.</p>
              </div>
              <button
                type="button"
                onClick={addMeal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-100 dark:border-blue-900/30 transition-colors"
              >
                <FiPlus size={14} />
                Add Meal
              </button>
            </div>

            <div className="space-y-4">
              {meals.map((meal, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative group">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meal Type</label>
                    <select
                      value={meal.mealType}
                      onChange={(e) => handleMealChange(index, "mealType", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none text-xs capitalize"
                    >
                      {["breakfast", "lunch", "dinner", "pre_workout", "post_workout", "snack"].map(t => (
                        <option key={t} value={t}>{t.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Timing</label>
                    <input
                      type="text"
                      required
                      value={meal.time}
                      onChange={(e) => handleMealChange(index, "time", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                      placeholder="e.g. 08:00 AM"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Foods (comma separated)</label>
                    <input
                      type="text"
                      required
                      value={meal.foods}
                      onChange={(e) => handleMealChange(index, "foods", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                      placeholder="Eggs, Oats, Avocado"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Kcal</label>
                    <input
                      type="number"
                      value={meal.calories}
                      onChange={(e) => handleMealChange(index, "calories", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Prot(g)</label>
                    <input
                      type="number"
                      value={meal.protein}
                      onChange={(e) => handleMealChange(index, "protein", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Carb(g)</label>
                    <input
                      type="number"
                      value={meal.carbohydrates}
                      onChange={(e) => handleMealChange(index, "carbohydrates", e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-xs"
                    />
                  </div>
                  <div className="md:col-span-1 text-right flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => removeMeal(index)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove Meal"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Dietary Restrictions</label>
                <input
                  type="text"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Lactose Intolerant, Vegetarian, No peanuts"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Instructions / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Drink water before meals..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
              >
                <FiCheck size={18} />
                Assign Diet Plan
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default DietPlans;
