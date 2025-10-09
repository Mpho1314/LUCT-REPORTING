import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

function ReportChart({ data }) {
  // Simple visualization component for report data
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for visualization
      setChartData(data);
    }
  }, [data]);

  // If no data is provided, show placeholder
  if (!chartData || chartData.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No data available for visualization</p>
        </div>
      </div>
    );
  }

  // Simple bar chart visualization
  return (
    <div className="chart-container">
      <h3>Report Statistics</h3>
      <div className="bar-chart">
        {chartData.map((item, index) => (
          <div key={index} className="chart-item">
            <div className="chart-label">{item.label || `Item ${index + 1}`}</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  width: `${Math.min(100, (item.value / Math.max(...chartData.map(d => d.value))) * 100)}%`,
                  backgroundColor: `hsl(${210 + index * 30}, 70%, 60%)`
                }}
              ></div>
              <span className="chart-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportChart;