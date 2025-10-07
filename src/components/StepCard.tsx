import React, { useState } from 'react';
import { FicheStepConfig } from '@/types/fiche.types';
import './StepCard.css';

interface StepState {
  step: string;
  content: string;
  approved: boolean;
  loading: boolean;
}

interface StepCardProps {
  step: FicheStepConfig;
  stepState: StepState;
  isCurrentStep: boolean;
  isPastStep: boolean;
  isFutureStep: boolean;
  onGenerate: () => void;
  onApprove: (approved: boolean, feedback?: string) => void;
}

function StepCard({
  step,
  stepState,
  isCurrentStep,
  isPastStep,
  isFutureStep,
  onGenerate,
  onApprove,
}: StepCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleApprove = () => {
    onApprove(true);
    setShowFeedback(false);
    setFeedback('');
  };

  const handleReject = () => {
    setShowFeedback(true);
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      onApprove(false, feedback);
      setFeedback('');
      setShowFeedback(false);
    }
  };

  const getStepIcon = () => {
    if (stepState.approved) return '✅';
    if (stepState.loading) return '⏳';
    if (isCurrentStep) return '▶️';
    if (isFutureStep) return '⭕';
    return '📝';
  };

  const getStepTypeColor = () => {
    switch (step.type) {
      case 'teacher':
        return 'type-teacher';
      case 'student':
      case 'eleve':
        return 'type-student';
      default:
        return 'type-general';
    }
  };

  if (isFutureStep && !stepState.content) {
    return (
      <div className="step-card future-step">
        <div className="step-header">
          <span className="step-icon">{getStepIcon()}</span>
          <h4>{step.title}</h4>
          <span className={`step-type ${getStepTypeColor()}`}>{step.type}</span>
        </div>
        <p className="step-placeholder">This step will be unlocked after completing previous steps</p>
      </div>
    );
  }

  return (
    <div className={`step-card ${isCurrentStep ? 'current-step' : ''} ${stepState.approved ? 'approved-step' : ''}`}>
      <div className="step-header">
        <span className="step-icon">{getStepIcon()}</span>
        <div className="step-title-group">
          <h4>{step.title}</h4>
          <span className={`step-type ${getStepTypeColor()}`}>{step.type}</span>
        </div>
      </div>

      {!stepState.content && !stepState.loading && (
        <div className="step-empty">
          <p>Ready to generate content for this step</p>
          <button className="btn-generate" onClick={onGenerate}>
            ✨ Generate Content
          </button>
        </div>
      )}

      {stepState.loading && (
        <div className="step-loading">
          <div className="spinner"></div>
          <p>AI is generating content...</p>
        </div>
      )}

      {stepState.content && (
        <div className="step-content">
          <div className="content-box">
            <pre className="content-text">{stepState.content}</pre>
          </div>

          {!stepState.approved && !showFeedback && (
            <div className="step-actions">
              <button className="btn-approve" onClick={handleApprove}>
                ✓ Approve & Continue
              </button>
              <button className="btn-reject" onClick={handleReject}>
                ✎ Request Changes
              </button>
              <button className="btn-regenerate" onClick={onGenerate}>
                🔄 Regenerate
              </button>
            </div>
          )}

          {showFeedback && (
            <div className="feedback-section">
              <label htmlFor="feedback">What would you like to change?</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide specific feedback on what you'd like to improve..."
                rows={3}
                autoFocus
              />
              <div className="feedback-actions">
                <button
                  className="btn-submit-feedback"
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim()}
                >
                  Submit Feedback
                </button>
                <button className="btn-cancel" onClick={() => setShowFeedback(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {stepState.approved && (
            <div className="step-approved">
              <span className="approved-badge">✓ Approved</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StepCard;