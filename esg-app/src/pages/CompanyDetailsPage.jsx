import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyById, getAllCompanies } from '../services/dataService';
import { generateScoreExplanation, generatePeerComparison, generateInvestmentRecommendation } from '../services/aiService';
import './CompanyDetailsPage.css';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [rank, setRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [industryData, setIndustryData] = useState([]);
  
  // AI Analysis states
  const [aiAnalysis, setAiAnalysis] = useState({
    scoreExplanation: null,
    peerComparison: null,
    investmentRecommendation: null
  });
  const [aiLoading, setAiLoading] = useState({
    scoreExplanation: false,
    peerComparison: false,
    investmentRecommendation: false
  });

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  const loadCompanyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load company data and all companies to calculate rank
      const [companyData, allCompanies] = await Promise.all([
        getCompanyById(id),
        getAllCompanies()
      ]);

      if (!companyData) {
        setError('Company not found');
        return;
      }

      setCompany(companyData);
      setIndustryData(allCompanies);
      
      // Calculate ranking
      const companyRank = allCompanies.findIndex(c => c.id === id) + 1;
      setRank(companyRank);
      
    } catch (err) {
      console.error('Error loading company data:', err);
      setError('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  // AI Analysis Functions
  const handleScoreExplanation = async () => {
    if (aiAnalysis.scoreExplanation) {
      // Already have analysis, clear it
      setAiAnalysis(prev => ({ ...prev, scoreExplanation: null }));
      return;
    }

    setAiLoading(prev => ({ ...prev, scoreExplanation: true }));
    try {
      const result = await generateScoreExplanation(company);
      setAiAnalysis(prev => ({ ...prev, scoreExplanation: result }));
    } catch (error) {
      console.error('Error generating score explanation:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, scoreExplanation: false }));
    }
  };

  const handlePeerComparison = async () => {
    if (aiAnalysis.peerComparison) {
      setAiAnalysis(prev => ({ ...prev, peerComparison: null }));
      return;
    }

    setAiLoading(prev => ({ ...prev, peerComparison: true }));
    try {
      const result = await generatePeerComparison(company, industryData);
      setAiAnalysis(prev => ({ ...prev, peerComparison: result }));
    } catch (error) {
      console.error('Error generating peer comparison:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, peerComparison: false }));
    }
  };

  const handleInvestmentRecommendation = async () => {
    if (aiAnalysis.investmentRecommendation) {
      setAiAnalysis(prev => ({ ...prev, investmentRecommendation: null }));
      return;
    }

    setAiLoading(prev => ({ ...prev, investmentRecommendation: true }));
    try {
      const result = await generateInvestmentRecommendation(company, industryData);
      setAiAnalysis(prev => ({ ...prev, investmentRecommendation: result }));
    } catch (error) {
      console.error('Error generating investment recommendation:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, investmentRecommendation: false }));
    }
  };

  if (loading) {
    return (
      <div className="company-details-page">
        <div className="loading">Loading company details...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="company-details-page">
        <div className="error">
          {error || 'Company not found. Please go back to the leaderboard.'}
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // green
    if (score >= 60) return '#FF9800'; // orange
    return '#f44336'; // red
  };

  return (
    <div className="company-details-page">
      <header className="company-header">
        <div className="company-info">
          <h1>{company.companyName}</h1>
          <div className="overall-score">
            <div 
              className="score-circle"
              style={{ backgroundColor: getScoreColor(company.overallScore) }}
            >
              {company.overallScore}
            </div>
            <div className="score-label">
              <h2>Overall ESG Score</h2>
              <p>Industry Ranking: #{rank}</p>
            </div>
          </div>
        </div>
        
        {company.sapaViolations > 0 && (
          <div className="violations-alert">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>SAPA Violations: {company.sapaViolations}</strong>
              <p>Safety and Prevention Act violations recorded</p>
            </div>
          </div>
        )}
      </header>

      <div className="esg-breakdown">
        <h2>ESG Score Breakdown</h2>
        <div className="score-grid">
          <div className="score-card environmental">
            <div className="score-header">
              <h3>Environmental</h3>
              <div className="score-value">{company.e_score}</div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${company.e_score}%`,
                  backgroundColor: getScoreColor(company.e_score)
                }}
              ></div>
            </div>
            <p>Climate impact, resource management, waste reduction</p>
          </div>

          <div className="score-card social">
            <div className="score-header">
              <h3>Social</h3>
              <div className="score-value">{company.s_score}</div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${company.s_score}%`,
                  backgroundColor: getScoreColor(company.s_score)
                }}
              ></div>
            </div>
            <p>Worker safety, community impact, labor practices</p>
          </div>

          <div className="score-card governance">
            <div className="score-header">
              <h3>Governance</h3>
              <div className="score-value">{company.g_score}</div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${company.g_score}%`,
                  backgroundColor: getScoreColor(company.g_score)
                }}
              ></div>
            </div>
            <p>Board structure, ethics, transparency, compliance</p>
          </div>
        </div>
      </div>

      <div className="ai-analysis-section">
        <h2>🤖 AI Analysis</h2>
        <div className="analysis-grid">
          <div className="analysis-card">
            <div className="analysis-card-header">
              <div>
                <h3>🔍 Score Explanation</h3>
                <p>Why does {company.companyName} have this ESG score?</p>
              </div>
              <button 
                className="analysis-btn"
                onClick={handleScoreExplanation}
                disabled={aiLoading.scoreExplanation}
              >
                {aiLoading.scoreExplanation ? '⏳ Analyzing...' : 
                 aiAnalysis.scoreExplanation ? '📝 Hide Analysis' : '🤖 Generate Analysis'}
              </button>
            </div>
            
            {aiAnalysis.scoreExplanation && (
              <div className="ai-response">
                <div className={`response-content ${aiAnalysis.scoreExplanation.success ? 'success' : 'error'}`}>
                  <p>{aiAnalysis.scoreExplanation.analysis}</p>
                  {aiAnalysis.scoreExplanation.timestamp && (
                    <small className="timestamp">
                      Generated: {new Date(aiAnalysis.scoreExplanation.timestamp).toLocaleString()}
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header">
              <div>
                <h3>📊 Peer Comparison</h3>
                <p>How does this company compare to industry leaders?</p>
              </div>
              <button 
                className="analysis-btn"
                onClick={handlePeerComparison}
                disabled={aiLoading.peerComparison}
              >
                {aiLoading.peerComparison ? '⏳ Analyzing...' : 
                 aiAnalysis.peerComparison ? '📝 Hide Analysis' : '🤖 Compare with Peers'}
              </button>
            </div>
            
            {aiAnalysis.peerComparison && (
              <div className="ai-response">
                <div className={`response-content ${aiAnalysis.peerComparison.success ? 'success' : 'error'}`}>
                  <p>{aiAnalysis.peerComparison.analysis}</p>
                  {aiAnalysis.peerComparison.timestamp && (
                    <small className="timestamp">
                      Generated: {new Date(aiAnalysis.peerComparison.timestamp).toLocaleString()}
                    </small>
                    )}
                </div>
              </div>
            )}
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header">
              <div>
                <h3>💡 Investment Recommendation</h3>
                <p>Should investors consider this company based on ESG metrics?</p>
              </div>
              <button 
                className="analysis-btn"
                onClick={handleInvestmentRecommendation}
                disabled={aiLoading.investmentRecommendation}
              >
                {aiLoading.investmentRecommendation ? '⏳ Analyzing...' : 
                 aiAnalysis.investmentRecommendation ? '📝 Hide Analysis' : '🤖 Get Recommendation'}
              </button>
            </div>
            
            {aiAnalysis.investmentRecommendation && (
              <div className="ai-response">
                <div className={`response-content ${aiAnalysis.investmentRecommendation.success ? 'success' : 'error'}`}>
                  <p>{aiAnalysis.investmentRecommendation.analysis}</p>
                  {aiAnalysis.investmentRecommendation.timestamp && (
                    <small className="timestamp">
                      Generated: {new Date(aiAnalysis.investmentRecommendation.timestamp).toLocaleString()}
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;