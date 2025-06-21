import React, { useEffect, useState } from 'react';
import { getNotes } from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiStats, setAIStats] = useState({
    totalNotes: 0,
    avgScore: 0,
    subjectScores: {},
  });

  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        const response = await getNotes();
        const userNotes = response.data;
        calculateStats(userNotes);
        setNotes(userNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotesData();
  }, []);

  const calculateStats = (notesData) => {
    const subjectMap = {};
    let totalScore = 0;

    notesData.forEach(note => {
      const subject = note.subject || "Uncategorized";
      const score = note.score || 0;

      if (!subjectMap[subject]) {
        subjectMap[subject] = { count: 0, scoreSum: 0 };
      }

      subjectMap[subject].count += 1;
      subjectMap[subject].scoreSum += score;
      totalScore += score;
    });

    const subjectScores = {};
    for (const sub in subjectMap) {
      const { count, scoreSum } = subjectMap[sub];
      subjectScores[sub] = {
        count,
        avgScore: Math.round(scoreSum / count)
      };
    }

    setAIStats({
      totalNotes: notesData.length,
      avgScore: notesData.length ? Math.round(totalScore / notesData.length) : 0,
      subjectScores
    });
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Learning Dashboard</h2>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Notes Created</h3>
            <p className="stat-value">{aiStats.totalNotes}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Average Score</h3>
            <p className="stat-value">{aiStats.avgScore}<span className="stat-max">/100</span></p>
          </div>
        </div>
      </div>

      <h3 className="section-title">📚 Subject-wise Understanding</h3>
      <div className="subject-grid">
        {Object.entries(aiStats.subjectScores).map(([subject, data]) => (
          <div key={subject} className="subject-card">
            <h4 className="subject-name">{subject}</h4>
            <div className="subject-stats">
              <p className="stat-item">
                <span className="stat-label">Notes:</span>
                <span className="stat-value">{data.count}</span>
              </p>
              <p className="stat-item">
                <span className="stat-label">Avg Score:</span>
                <span className="stat-value">{data.avgScore}</span>
              </p>
            </div>
            {/* Quiz CTA Removed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
