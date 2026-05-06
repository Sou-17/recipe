import { useState } from "react";
import axios from "axios";

function ExtractRecipe() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const extract = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/recipes/extract", { url });
      setResult(res.data);
    } catch (error) {
      setResult({ error: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "var(--text)", marginBottom: "15px", textAlign: "center", fontSize: "1.8rem" }}>Add New Recipe</h2>
      <p style={{ textAlign: "center", color: "var(--text-light)", marginBottom: "30px" }}>Simply paste a URL from any recipe website</p>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "40px", backgroundColor: "#fff", padding: "8px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        <input 
          placeholder="https://www.allrecipes.com/recipe/..."
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          style={{ flex: 1, padding: "12px 20px", borderRadius: "12px", border: "1px solid #eee", fontSize: "1rem", outline: "none", backgroundColor: "var(--bg)" }}
        />
        <button 
          onClick={extract} 
          disabled={loading}
          style={{ 
            padding: "12px 30px", 
            backgroundColor: "var(--primary)", 
            color: "white", 
            border: "none", 
            borderRadius: "12px", 
            cursor: "pointer", 
            fontWeight: "bold",
            fontSize: "1rem",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "✨ Processing..." : "Extract"}
        </button>
      </div>

      {result && !result.error && (
        <div style={{ padding: "30px", backgroundColor: "#fff", borderRadius: "20px", border: "1px solid var(--border)", animation: "fadeIn 0.5s ease-out" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "15px", marginBottom: "25px" }}>
            <div style={{ fontSize: "2rem", backgroundColor: "#f0fff4", padding: "10px", borderRadius: "15px" }}>✅</div>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "var(--text)" }}>{result.title}</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ backgroundColor: "#fdf2e9", color: "#e67e22", padding: "4px 12px", borderRadius: "100px", fontSize: "0.85rem", fontWeight: "600" }}>{result.cuisine || "Global"}</span>
                <span style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>•</span>
                <span style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>{result.total_time || result.cook_time || "N/A"}</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: "25px", padding: "20px", backgroundColor: "var(--bg)", borderRadius: "15px", border: "1px solid var(--border)" }}>
            <h5 style={{ margin: "0 0 15px 0", color: "var(--primary)", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              🛒 Smart Shopping List
            </h5>
            {result.shopping_list && Object.keys(result.shopping_list).length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {Object.entries(result.shopping_list).map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: "10px", fontSize: "0.85rem" }}>
                    <strong style={{ color: "var(--text)" }}>{cat}:</strong> 
                    <span style={{ color: "var(--text-light)", marginLeft: "5px" }}>{items.slice(0, 3).join(", ")}{items.length > 3 ? "..." : ""}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#e74c3c", fontSize: "0.85rem", margin: 0 }}>AI categorization skipped. Please check your API configuration.</p>
            )}
          </div>

          <button 
            onClick={() => { setResult(null); setUrl(""); }}
            style={{ marginTop: "30px", width: "100%", padding: "12px", backgroundColor: "transparent", border: "1px solid var(--border)", borderRadius: "12px", cursor: "pointer", color: "var(--text-light)", fontWeight: "600" }}
          >
            ← Extract Another Recipe
          </button>
        </div>
      )}

      {result && result.error && (
        <div style={{ padding: "20px", backgroundColor: "#fff5f5", color: "#c53030", borderRadius: "15px", border: "1px solid #feb2b2", textAlign: "center" }}>
          <strong>Oops!</strong> {typeof result.error === 'string' ? result.error : "We couldn't read that recipe. Try another link!"}
        </div>
      )}
    </div>
  );
}

export default ExtractRecipe;