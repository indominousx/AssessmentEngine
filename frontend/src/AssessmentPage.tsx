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
          <div className="assessment-container animate-fade-in">
            <div className="assessment-card">
              <h1 className="assessment-title">Mental Wellness Check-in</h1>
              <p className="assessment-subtitle font-caveat" style={{fontSize: '1.5rem', color: 'var(--brand-pink)'}}>
                Your Safe Space
              </p>
              <p className="assessment-subtitle">
                Please select which area you'd like to check in on today. Your responses are completely private and secure.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {availableAssessments.length > 0 ? (
                  availableAssessments.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectAssessment(item)}
                      className="assessment-button"
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <div className="loading-spinner"></div>
                )}
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