import { useEffect, useState } from "react";
import { getMemberDashboard } from "../../services/member.service";
import toast from "react-hot-toast";
import { FiBookOpen, FiDroplet, FiAward, FiInfo } from "react-icons/fi";

const DietPlanView = () => {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        setLoading(true);
        const res = await getMemberDashboard();
        if (res.success) {
          setDiet(res.diet);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiet();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading diet plan...</div>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">My Diet & Nutrition</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review your daily meal plans and target macros.</p>
      </div>

      {!diet ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 shadow-sm">
          No diet plans assigned. Reach out to your trainer for custom diet advice!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* TIMINGS SCHEDULE */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3">
              Daily Meal Schedule
            </h3>
            <div className="space-y-4">
              {diet.meals?.map((m, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      {m.mealType.replace("_", " ")}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {m.foods?.join(", ")}
                    </h4>
                  </div>
                  <div className="text-right flex items-center sm:flex-col gap-4 sm:gap-1 text-xs">
                    <span className="font-bold text-slate-855 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm border border-slate-200/50 dark:border-slate-800">
                      {m.time}
                    </span>
                    {m.calories > 0 && (
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{m.calories} kcal</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MACROS OVERVIEW CARD */}
          <div className="space-y-6">
            {/* Macro Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
                <FiDroplet className="text-blue-500" /> Target Macros
              </h3>
              <div className="space-y-4">
                {/* Calories */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span>Daily Calories</span>
                    <span>{diet.dailyCalories} kcal</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Protein */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span>Protein</span>
                    <span>{diet.protein}g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span>Carbs</span>
                    <span>{diet.carbohydrates}g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Fats */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span>Fats</span>
                    <span>{diet.fats}g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* General notes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-xs uppercase text-slate-400">
                <FiInfo /> Trainer Notes
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {diet.notes || "Stay consistent and hit your daily macro metrics. Proper hydration is key."}
              </p>
              {diet.restrictions && (
                <div className="mt-3 p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-200/30 text-red-700 dark:text-red-400 rounded-xl text-xs">
                  <strong>Restrictions: </strong> {diet.restrictions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlanView;
