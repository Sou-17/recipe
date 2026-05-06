import React, { useEffect, useState } from "react";
import axios from "axios";

function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/recipes/");
      if (Array.isArray(res.data)) {
        setRecipes(res.data);
      } else if (res.data.recipes) {
        setRecipes(res.data.recipes);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setRecipes([]);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const [expandedId, setExpandedId] = useState(null);

  const deleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/recipes/${id}`);
      setExpandedId(null);
      fetchRecipes();
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert("Failed to delete recipe");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "var(--text)", marginBottom: "30px", textAlign: "center", fontSize: "1.8rem" }}>Recipe Library</h2>

      {recipes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "20px", border: "1px solid var(--border)", color: "var(--text-light)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📖</div>
          <p style={{ fontSize: "1.1rem" }}>Your library is empty. Start by extracting some recipes!</p>
        </div>
      ) : (
        <div style={{ backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", overflow: "hidden", border: "1px solid var(--border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdf2e9", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "20px", color: "var(--primary-dark)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Title</th>
                <th style={{ padding: "20px", color: "var(--primary-dark)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Cuisine</th>
                <th style={{ padding: "20px", color: "var(--primary-dark)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Difficulty</th>
                <th style={{ padding: "20px", color: "var(--primary-dark)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Time</th>
                <th style={{ padding: "20px", color: "var(--primary-dark)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <React.Fragment key={recipe.id}>
                  <tr 
                    onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
                    style={{ borderBottom: "1px solid #f9f2ed", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fffbf5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "20px", fontWeight: "600", color: "var(--text)" }}>{recipe.title}</td>
                    <td style={{ padding: "20px", color: "var(--text-light)" }}>{recipe.cuisine || "Global"}</td>
                    <td style={{ padding: "20px" }}>
                      <span style={{ 
                        backgroundColor: recipe.difficulty === "hard" ? "#fdedec" : recipe.difficulty === "med" ? "#fef5e7" : "#eafaf1", 
                        color: recipe.difficulty === "hard" ? "#e74c3c" : recipe.difficulty === "med" ? "#f39c12" : "#27ae60", 
                        padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" 
                      }}>
                        {recipe.difficulty || "Easy"}
                      </span>
                    </td>
                    <td style={{ padding: "20px", color: "var(--text-light)" }}>{recipe.total_time || recipe.cook_time || "N/A"}</td>
                    <td style={{ padding: "20px", textAlign: "right" }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                        style={{ backgroundColor: "transparent", border: "none", color: "#fab1a0", cursor: "pointer", fontSize: "1.1rem", padding: "5px" }}
                        title="Delete Recipe"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === recipe.id && (
                    <tr style={{ backgroundColor: "#fffcf9" }}>
                      <td colSpan="5" style={{ padding: "40px", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "50px" }}>
                          <div>
                            <h4 style={{ color: "var(--text)", borderBottom: "2px solid var(--primary)", paddingBottom: "10px", marginBottom: "20px" }}>
                              👨‍🍳 Cooking Instructions
                            </h4>
                            <ol style={{ paddingLeft: "20px", fontSize: "1rem", lineHeight: "1.6", color: "var(--text)" }}>
                              {recipe.steps.map((step, i) => (
                                <li key={i} style={{ marginBottom: "15px" }}>{step}</li>
                              ))}
                            </ol>
                            
                            <div style={{ marginTop: "30px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                              <h4 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "15px" }}>💡 Smart Suggestions</h4>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {recipe.substitutions?.map((sub, i) => (
                                  <div key={i} style={{ backgroundColor: "#fff", padding: "10px 15px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--text-light)" }}>
                                    {sub}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                              <h4 style={{ color: "var(--primary)", marginTop: 0, marginBottom: "20px" }}>🛒 Shopping List</h4>
                              {(!recipe.shopping_list || Object.keys(recipe.shopping_list).length === 0) ? (
                                <p style={{ color: "var(--text-light)", fontStyle: "italic", fontSize: "0.9rem" }}>No list items found.</p>
                              ) : (
                                Object.entries(recipe.shopping_list).map(([cat, items]) => (
                                  <div key={cat} style={{ marginBottom: "20px" }}>
                                    <h5 style={{ margin: "0 0 10px 0", color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase" }}>{cat}</h5>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                      {items.map((item, i) => (
                                        <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "var(--text-light)", marginBottom: "8px" }}>
                                          <input type="checkbox" style={{ accentColor: "var(--primary)" }} />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))
                              )}
                            </div>

                            {recipe.nutrition && (
                              <div style={{ marginTop: "20px", backgroundColor: "var(--primary)", padding: "15px", borderRadius: "15px", color: "white" }}>
                                <h5 style={{ margin: "0 0 10px 0", textTransform: "uppercase", fontSize: "0.75rem", opacity: 0.9 }}>Quick Stats</h5>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.85rem" }}>
                                  <div><b>Cals:</b> {recipe.nutrition.calories || "N/A"}</div>
                                  <div><b>Prot:</b> {recipe.nutrition.protein || "N/A"}</div>
                                </div>
                              </div>
                            )}

                            <div style={{ marginTop: "25px", textAlign: "center" }}>
                              <a href={recipe.source_url} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontSize: "0.9rem", textDecoration: "none", fontWeight: "600" }}>
                                View Original Recipe ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SavedRecipes;