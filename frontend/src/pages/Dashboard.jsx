import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [names, setNames] = useState('');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/leads`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const namesArray = names.split(',').map(name => name.trim()).filter(name => name);
      const response = await axios.post(`${baseUrl}/api/leads`, { names: namesArray });
      setResults(prev => [...response.data, ...prev]);
      setNames('');
    } catch (error) {
      console.error('Error submitting names:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(result => filter === 'All' || result.status === filter);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Smart Lead Automation System</h1>
        <p>Enrich leads with nationality predictions and automated processing</p>
      </header>

      <main className="dashboard-content">
        <section className="input-section">
          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="names-input">Enter names (comma-separated):</label>
              <input
                id="names-input"
                type="text"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder="e.g., Peter, Aditi, Ravi, Satoshi"
                required
              />
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </section>

        <section className="filter-section">
          <div className="filter-group">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Verified">Verified</option>
              <option value="To Check">To Check</option>
            </select>
          </div>
        </section>

        <section className="results-section">
          <h2>Lead Results</h2>
          <div className="table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Predicted Country</th>
                  <th>Confidence Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <tr key={index}>
                    <td className="name-cell">{result.name}</td>
                    <td className="country-cell">{result.country}</td>
                    <td className="probability-cell">{(result.probability * 100).toFixed(2)}%</td>
                    <td className="status-cell">
                      <span className={`status-badge status-${result.status.toLowerCase().replace(' ', '-')}`}>
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
