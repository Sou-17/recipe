import { useState } from "react";
import ExtractRecipe from "./components/ExtractRecipe";
import SavedRecipes from "./components/SavedRecipes";
import MealPlan from "./components/MealPlan";

function App() {
  const [tab, setTab] = useState("extract");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <header style={{ 
        padding: "40px 20px", 
        textAlign: "center", 
        background: "linear-gradient(135deg, #e67e22 0%, #f39c12 100%)",
        color: "white",
        marginBottom: "30px",
        boxShadow: "0 4px 20px rgba(230, 126, 34, 0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem", letterSpacing: "-1px", color: "white" }}>Recipe AI</h1>
        <p style={{ margin: "10px 0 0 0", opacity: 0.9 }}>Your intelligent kitchen companion</p>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <nav style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "20px", 
          marginBottom: "40px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "100px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
          width: "fit-content",
          margin: "0 auto 40px auto"
        }}>
          <button 
            className={`tab-button ${tab === "extract" ? "active" : ""}`}
            onClick={() => setTab("extract")}
          >
            🍳 Extract
          </button>
          <button 
            className={`tab-button ${tab === "saved" ? "active" : ""}`}
            onClick={() => setTab("saved")}
          >
            📖 Saved
          </button>
          <button 
            className={`tab-button ${tab === "meal" ? "active" : ""}`}
            onClick={() => setTab("meal")}
          >
            📅 Meal Plan
          </button>
        </nav>

        <main className="card" style={{ padding: "40px", marginBottom: "60px" }}>
          {tab === "extract" && <ExtractRecipe />}
          {tab === "saved" && <SavedRecipes />}
          {tab === "meal" && <MealPlan />}
        </main>
      </div>
      
      <footer style={{ textAlign: "center", padding: "40px", color: "var(--text-light)", fontSize: "0.9rem" }}>
        Powered by AI • 2026
      </footer>
    </div>
  );
}

export default App;