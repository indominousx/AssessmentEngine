// /assessment_engine/frontend/components/QuestionCard.tsx

import React from 'react';
import { Question } from '../types/assessment';

interface Props {
  question: Question;
  onAnswer: (questionId: string, value: any) => void;
}

export const QuestionCard = ({ question, onAnswer }: Props) => (
  <div
    style={{
      marginTop: '2.5rem',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f4f7 100%)',
      borderRadius: '18px',
      boxShadow: '0 8px 32px rgba(0, 87, 134, 0.10)',
      padding: '36px 28px',
      maxWidth: '520px',
      marginLeft: 'auto',
      marginRight: 'auto',
      border: '1.5px solid #b2ebf2',
      position: 'relative',
      minHeight: '180px',
    }}
  >
    <h3
      style={{
        fontSize: '1.45rem',
        fontWeight: 700,
        color: '#005786',
        minHeight: '3em',
        marginBottom: '2rem',
        textAlign: 'center',
        letterSpacing: '-0.5px',
      }}
    >
      {question.text}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '0.5rem' }}>
      {question.answerOptions.map(option => (
        <button
          key={option.value}
          onClick={() => onAnswer(question.questionId, option.value)}
          style={{
            padding: '16px',
            fontSize: '1.08rem',
            background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 87, 134, 0.07)',
            color: '#005786',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
            outline: 'none',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #b2ebf2 0%, #e0f7fa 100%)')}
          onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)')}
          onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px #b2ebf2')}
          onBlur={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 87, 134, 0.07)')}
        >
          {option.text}
        </button>
      ))}
    </div>
  </div>
);