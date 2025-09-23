import React, { useState, useEffect } from 'react';
import { useAssessment } from './hooks/useAssessment';
import { QuestionCard } from './components/QuestionCard';
import { ReportDisplay } from './components/ReportDisplay';
import { ProgressBar } from './components/ProgressBar';
import { DemographicsForm } from './components/DemographicsForm';
import { UserDemographics, AvailableAssessment } from './types/assessment';
import { listAssessments } from './services/api';

export const AssessmentPage = () => {
  const [step, setStep] = useState<'selection' | 'demographics' | 'assessment' | 'report'>('selection');
  const [availableAssessments, setAvailableAssessments] = useState<AvailableAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AvailableAssessment | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    assessment,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    handleAnswer,
    report,
    isLoading,
    startAssessment,
    setAssessmentId,
    resetAssessment,
  } = useAssessment();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const assessments = await listAssessments();
        setAvailableAssessments(assessments);
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      }
    };
    fetchAssessments();
  }, []);

  useEffect(() => {
    if (report && step !== 'report') {
      setStep('report');
    }
  }, [report, step]);

  const handleSelectAssessment = (assessmentInfo: AvailableAssessment) => {
    setSelectedAssessment(assessmentInfo);
    setAssessmentId(assessmentInfo.id);
    setStep('demographics');
  };

  const handleDemographicsSubmit = (age: number, gender: string, status: string) => {
    const userDemographics: UserDemographics = { userId: `user_${Date.now()}`, age, gender, status };
    startAssessment(userDemographics);
    setStep('assessment');
  };

  const handleReset = () => {
    resetAssessment(); // Reset the assessment hook state
    setStep('selection');
    setSelectedAssessment(null);
    setShowResetConfirm(false);
  };

  if (showResetConfirm) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '5rem auto', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Reset Assessment?</h3>
        <p>Are you sure you want to restart? Your progress will be lost.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
          <button onClick={handleReset} style={{ backgroundColor: '#dc3545', color: 'white' }}>Yes, Reset</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'selection':
        return (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f4f7 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '18px',
              boxShadow: '0 8px 32px rgba(0, 87, 134, 0.12)',
              padding: '48px 36px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              margin: '24px',
            }}>
              <h1 style={{
                fontWeight: 700,
                fontSize: '2.2rem',
                marginBottom: '0.5rem',
                color: '#005786',
                letterSpacing: '-1px',
              }}>Mental Wellness Check-in</h1>
              <p style={{
                color: '#5a7a8b',
                fontSize: '1.1rem',
                marginBottom: '2.5rem',
              }}>
                Please select which area you'd like to check in on today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {availableAssessments.length > 0 ? (
                  availableAssessments.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectAssessment(item)}
                      style={{
                        padding: '20px',
                        fontSize: '1.15rem',
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
                      {item.name}
                    </button>
                  ))
                ) : <p>Loading available assessments...</p>}
              </div>
            </div>
          </div>
        );
      case 'demographics':
        return <DemographicsForm onSubmit={handleDemographicsSubmit} isLoading={isLoading} onBack={() => setStep('selection')} />;
      case 'assessment':
        if (isLoading && !assessment) return <div>Personalizing your questions...</div>;
        if (currentQuestion) {
          return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem' }}>{selectedAssessment?.name}</h1>
                <button onClick={() => setShowResetConfirm(true)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Reset</button>
              </div>
              <h2 style={{ fontWeight: 'normal', marginBottom: '2rem' }}>{assessment?.timeframe_instruction}</h2>
              <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
              <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
            </div>
          );
        }
        return <div>Loading assessment questions...</div>;
      case 'report':
        return report ? (
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <ReportDisplay report={report} />
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button onClick={handleReset} style={{ padding: '12px 24px', fontSize: '16px' }}>Take Another Assessment</button>
            </div>
          </div>
        ) : <div>Generating your report...</div>;
      default:
        return <div>Something went wrong. Please refresh the page.</div>;
    }
  };

  return <div>{renderContent()}</div>;
};