import React from 'react';
import { FinalReport } from '../types/assessment';

export const ReportDisplay = ({ report }: { report: FinalReport }) => (
  <div
    style={{
      maxWidth: '540px',
      margin: '2.5rem auto',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f4f7 100%)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 87, 134, 0.13)',
      padding: '40px 32px',
      border: '1.5px solid #b2ebf2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
    }}
  >
    <h1 style={{
      textAlign: 'center',
      color: '#005786',
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: '1.5rem',
      letterSpacing: '-1px',
    }}>
      <span role="img" aria-label="report">📊</span> Your Personalized Report
    </h1>
    {report.escalation.isRequired && (
      <div style={{
        border: '2px solid #ff5252',
        background: 'rgba(255,82,82,0.08)',
        padding: '1.2rem',
        margin: '1.5rem 0',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
      }}>
        <span style={{ fontSize: '2rem', color: '#ff5252' }}>⚠️</span>
        <div>
          <h3 style={{ color: '#ff5252', margin: 0, fontWeight: 700 }}>Important Note</h3>
          <p style={{ margin: 0 }}>{report.escalation.note}</p>
        </div>
      </div>
    )}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      margin: '2rem 0 1.5rem 0',
      flexWrap: 'wrap',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #b2ebf2 0%, #e0f7fa 100%)',
        borderRadius: '14px',
        padding: '1.2rem 2.2rem',
        boxShadow: '0 2px 8px rgba(0, 87, 134, 0.07)',
        textAlign: 'center',
        minWidth: '120px',
      }}>
        <div style={{ fontSize: '1.1rem', color: '#5a7a8b', marginBottom: '0.3rem' }}>Score</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#007bff' }}>{report.rawScore}</div>
      </div>
      <div style={{
        background: '#00e5ee',
        borderRadius: '14px',
        padding: '1.2rem 2.2rem',
        boxShadow: '0 2px 8px rgba(0, 87, 134, 0.07)',
        textAlign: 'center',
        minWidth: '120px',
      }}>
        <div style={{ fontSize: '1.1rem', color: '#5a7a8b', marginBottom: '0.3rem' }}>Severity</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: report.severity === 'Severe' ? '#ff5252' : report.severity === 'Moderate' ? '#ffb300' : '#ffffffff' }}>{report.severity}</div>
        <div style={{ fontSize: '1rem', color: '#005786', marginTop: '0.2rem' }}>{report.interpretation}</div>
      </div>
    </div>
    <div style={{ marginTop: '2.2rem', marginBottom: '1.5rem' }}>
      <h4 style={{ color: '#005786', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem' }}>
        <span role="img" aria-label="summary">📝</span> Summary
      </h4>
      <p style={{ color: '#333', fontSize: '1.08rem', lineHeight: 1.7 }}>{report.personalizedSummary}</p>
    </div>
    <div style={{ marginTop: '1.5rem' }}>
      <h4 style={{ color: '#005786', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem' }}>
        <span role="img" aria-label="recommendations">💡</span> Recommendations
      </h4>
      <ul style={{ paddingLeft: '20px', color: '#005786', fontSize: '1.08rem', lineHeight: 1.7 }}>
        {report.personalizedRecommendations.map((rec, i) => (
          <li key={i} style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>✔️</span> <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);