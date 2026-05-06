import { useState } from "react";
import axios from "axios";

function MealPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://127.0.0.1:8000/mealplan/generate");

      if (res.data.error) {
        setError(res.data.error);
        return;
      }

      setPlan(res.data.meal_plan);
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError(err.response?.data?.error || err.message || "Failed to generate meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h2 style={{ color: "var(--text)", margin: 0, fontSize: "1.8rem" }}>Weekly Menu</h2>
          <p style={{ color: "var(--text-light)", margin: "5px 0 0 0" }}>AI-curated meals based on your library</p>
        </div>
        <button 
          onClick={generatePlan} 
          disabled={loading}
          style={{ 
            padding: "12px 30px", 
            backgroundColor: "var(--success)", 
            color: "white", 
            border: "none", 
            borderRadius: "15px", 
            cursor: "pointer", 
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 4px 15px rgba(39, 174, 96, 0.2)"
          }}
        >
          {loading ? "✨ Curating..." : "🔄 Generate Plan"}
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #feb2b2", textAlign: "center", color: "#c53030" }}>
          <div style={{ fontSize: "2rem", marginBottom: "15px" }}>🍴</div>
          <p style={{ margin: 0 }}><b>Notice:</b> {typeof error === "string" ? error : "Add at least 3-5 recipes to get a diverse plan!"}</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px", animation: "bounce 1s infinite" }}>🥗</div>
          <h3 style={{ color: "var(--text-light)", fontWeight: "400" }}>Organizing your kitchen for the week...</h3>
        </div>
      )}

      {plan && !error && !loading && (
        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px" }}>
            {Object.entries(plan)
              .filter(([day]) => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(day.toLowerCase()))
              .map(([day, meals]) => (
              <div
                key={day}
                className="card"
                style={{ overflow: "hidden", border: "1px solid var(--border)" }}
              >
                <div style={{ backgroundColor: "var(--primary)", padding: "15px", textAlign: "center" }}>
                  <h4 style={{ margin: 0, color: "white", textTransform: "uppercase", letterSpacing: "3px", fontSize: "0.9rem" }}>
                    {day}
                  </h4>
                </div>
  
                <div style={{ padding: "30px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    <MealRow icon="🍯" label="Breakfast" name={meals.breakfast} />
                    <MealRow icon="🍱" label="Lunch" name={meals.lunch} />
                    <MealRow icon="🍲" label="Dinner" name={meals.dinner} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "50px", padding: "30px", backgroundColor: "#fef9e7", borderRadius: "20px", border: "1px solid #f9e79f", textAlign: "center" }}>
            <h4 style={{ color: "#d4ac0d", margin: "0 0 10px 0" }}>💡 Quick Tip</h4>
            <p style={{ color: "#7d6608", margin: 0, fontSize: "0.95rem" }}>Click on any recipe in the "Saved" tab to see its auto-generated shopping list and preparation steps!</p>
          </div>
        </div>
      )}

      {!plan && !loading && !error && (
        <div style={{ textAlign: "center", padding: "100px 0", opacity: 0.5 }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📅</div>
          <h3>Your week is wide open. Click generate to start!</h3>
        </div>
      )}
    </div>
  );
}

function MealRow({ icon, label, name }) {
  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      <div style={{ fontSize: "1.8rem", backgroundColor: "var(--bg)", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", border: "1px solid var(--border)" }}>{icon}</div>
      <div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-light)", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "2px", letterSpacing: "1px" }}>{label}</span>
        <p style={{ margin: 0, color: "var(--text)", fontWeight: "600", fontSize: "1rem" }}>{name || "Free Choice"}</p>
      </div>
    </div>
  );
}

export default MealPlan;