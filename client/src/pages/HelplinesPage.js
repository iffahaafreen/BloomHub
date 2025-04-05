import React, { useState, useEffect } from "react";
import helplineData from "../helpline.json"; 

const HelplinesPage = () => {
  const [helplines, setHelplines] = useState([]);
  const [selectedState, setSelectedState] = useState("National");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Extract the helpline array from the JSON data
    if (helplineData && helplineData.helpline) {
      setHelplines(helplineData.helpline);
    }
  }, []);

  // Extract unique states from the helpline data
  const states = ["National", ...new Set(helplines.map(item => item.state).filter(state => state !== "National"))].sort();

  // Extract unique categories from the helpline data
  const categories = ["All", ...new Set(helplines.flatMap(item => item.category))].sort();

  // Filter helplines based on selected state and category
  const filteredHelplines = helplines.filter(item => {
    const stateMatch = selectedState === "All" || item.state === selectedState;
    const categoryMatch = selectedCategory === "All" || item.category.includes(selectedCategory);
    return stateMatch && categoryMatch;
  });

  return (
    <div className="helplines-container">
      <h1>Women's Helpline Numbers</h1>

      {/* Dropdown Filters */}
      <div className="filters">
        <label>State: </label>
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="All">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label>Category: </label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Display Helplines */}
      <div className="helplines-list">
        {filteredHelplines.length > 0 ? (
          <ul>
            {filteredHelplines.map((helpline, index) => (
              <li key={index} className="helpline-item">
                <h3>{helpline.name}</h3>
                <div className="helpline-details">
                  <div className="numbers">
                    <strong>Number{helpline.number.length > 1 ? 's' : ''}:</strong> 
                    {helpline.number.map((num, i) => (
                      <span key={i} className="phone-number">📞 {num}</span>
                    ))}
                  </div>
                  
                  <div className="metadata">
                    <span className="category">
                      <strong>Category:</strong> {helpline.category.join(', ')}
                    </span>
                    <br></br>
                    <span className="state">
                      <strong>State:</strong> {helpline.state}
                    </span>
                  </div>
                  
                  {helpline.website && (
                    <div className="website">
                      <strong>Website:</strong>
                      <a href={helpline.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No helplines found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default HelplinesPage;
