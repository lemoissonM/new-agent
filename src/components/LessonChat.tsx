import React, { useEffect, useState, useRef } from 'react';
import { Fiche, FicheStepConfig } from '@/types/fiche.types';
import StepCard from './StepCard';
import './LessonChat.css';

interface LessonChatProps {
  ficheId: string;
}

interface StepState {
  step: string;
  content: string;
  approved: boolean;
  loading: boolean;
}

function LessonChat({ ficheId }: LessonChatProps) {
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [steps, setSteps] = useState<FicheStepConfig[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStates, setStepStates] = useState<Record<string, StepState>>({});
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFiche();
  }, [ficheId]);

  useEffect(() => {
    scrollToBottom();
  }, [stepStates, currentStepIndex]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadFiche = async () => {
    try {
      const [ficheRes, stepsRes] = await Promise.all([
        fetch(`/api/fiches/${ficheId}`),
        fetch(`/api/fiches/${ficheId}/steps`),
      ]);

      const ficheData = await ficheRes.json();
      const stepsData = await stepsRes.json();

      setFiche(ficheData);
      setSteps(stepsData);

      // Initialize step states
      const initialStates: Record<string, StepState> = {};
      stepsData.forEach((step: FicheStepConfig) => {
        const fieldName = stepToFieldName(step.slug);
        initialStates[step.slug] = {
          step: step.slug,
          content: (ficheData as any)[fieldName] || '',
          approved: !!(ficheData as any)[fieldName],
          loading: false,
        };
      });
      setStepStates(initialStates);

      // Find current step index
      const currentIndex = stepsData.findIndex(
        (s: FicheStepConfig) => !(ficheData as any)[stepToFieldName(s.slug)]
      );
      setCurrentStepIndex(currentIndex >= 0 ? currentIndex : stepsData.length);
    } catch (error) {
      console.error('Error loading fiche:', error);
    } finally {
      setLoading(false);
    }
  };

  const stepToFieldName = (step: string): string => {
    const mapping: Record<string, string> = {
      objectives: 'objectives',
      revisionTeacher: 'revisionTeacher',
      revisionStudent: 'revisionStudent',
      situation: 'situation',
      activitePrincipaleTeacher: 'activitePrincipaleTeacher',
      activitePrincipaleStudent: 'activitePrincipaleStudent',
      syntheseTeacher: 'syntheseTeacher',
      syntheseStudent: 'syntheseStudent',
      exercice: 'exercice',
      situationSimilaire: 'situationSimilaire',
      revisionTeacherRappel: 'revisionTeacherRappel',
      revisionStudentRappel: 'revisionStudentRappel',
      revisionTeacherMotivation: 'revisionTeacherMotivation',
      revisionStudentMotivation: 'revisionStudentMotivation',
      activiteControleApplicationTeacher: 'activiteControleApplicationTeacher',
      activiteControleApplicationStudent: 'activiteControleApplicationStudent',
      activiteControleResearchTeacher: 'activiteControleResearchTeacher',
      activiteControleResearchStudent: 'activiteControleResearchStudent',
      activiteControleEvaluationTeacher: 'activiteControleEvaluationTeacher',
      activiteControleEvaluationStudent: 'activiteControleEvaluationStudent',
    };
    return mapping[step] || step;
  };

  const handleGenerateStep = async (stepSlug: string) => {
    setStepStates({
      ...stepStates,
      [stepSlug]: { ...stepStates[stepSlug], loading: true },
    });

    try {
      const response = await fetch(`/api/fiches/${ficheId}/generate-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step: stepSlug }),
      });

      const data = await response.json();

      setStepStates({
        ...stepStates,
        [stepSlug]: {
          step: stepSlug,
          content: data.content,
          approved: false,
          loading: false,
        },
      });

      setFiche(data.fiche);
    } catch (error) {
      console.error('Error generating step:', error);
      setStepStates({
        ...stepStates,
        [stepSlug]: { ...stepStates[stepSlug], loading: false },
      });
    }
  };

  const handleApproveStep = async (stepSlug: string, approved: boolean, feedback?: string) => {
    try {
      const response = await fetch(`/api/fiches/${ficheId}/approve-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step: stepSlug, approved, feedback }),
      });

      const data = await response.json();

      if (approved) {
        // Move to next step
        setStepStates({
          ...stepStates,
          [stepSlug]: { ...stepStates[stepSlug], approved: true },
        });
        setCurrentStepIndex(currentStepIndex + 1);
      } else if (feedback) {
        // Update with regenerated content
        setStepStates({
          ...stepStates,
          [stepSlug]: {
            step: stepSlug,
            content: data.content,
            approved: false,
            loading: false,
          },
        });
        setFiche(data.fiche);
      }
    } catch (error) {
      console.error('Error approving step:', error);
    }
  };

  const handleGenerateAll = async () => {
    for (let i = currentStepIndex; i < steps.length; i++) {
      const step = steps[i];
      await handleGenerateStep(step.slug);
      // In a real implementation, you'd want to wait for user approval before continuing
      // This is just a simplified version
    }
  };

  const getProgress = () => {
    const completed = Object.values(stepStates).filter((s) => s.approved).length;
    return (completed / steps.length) * 100;
  };

  if (loading) {
    return (
      <div className="lesson-chat-loading">
        <div className="spinner"></div>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (!fiche) {
    return <div className="lesson-chat-error">Lesson not found</div>;
  }

  return (
    <div className="lesson-chat">
      <div className="lesson-chat-header">
        <div className="lesson-info">
          <h2>{fiche.lessonTitle}</h2>
          <div className="lesson-metadata">
            <span className="metadata-item">📚 {fiche.subject}</span>
            <span className="metadata-item">👥 Class {fiche.classe}</span>
            <span className="metadata-item">🎯 {fiche.areaOfLife}</span>
          </div>
        </div>
        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${getProgress()}%` }}></div>
          </div>
          <div className="progress-text">
            {Object.values(stepStates).filter((s) => s.approved).length} / {steps.length} steps
            completed
          </div>
        </div>
      </div>

      <div className="lesson-chat-content">
        <div className="chat-messages">
          <div className="welcome-message">
            <div className="ai-avatar">🤖</div>
            <div className="message-content">
              <h3>Welcome to the Lesson Generator!</h3>
              <p>
                I'll help you create a complete lesson plan step by step. For each step, I'll
                generate content and you can approve it or provide feedback to improve it.
              </p>
              <p>
                We have <strong>{steps.length} steps</strong> to complete. Let's get started!
              </p>
            </div>
          </div>

          {steps.map((step, index) => {
            const stepState = stepStates[step.slug];
            const isCurrentStep = index === currentStepIndex;
            const isPastStep = index < currentStepIndex;
            const isFutureStep = index > currentStepIndex;

            if (!stepState) return null;

            return (
              <StepCard
                key={step.slug}
                step={step}
                stepState={stepState}
                isCurrentStep={isCurrentStep}
                isPastStep={isPastStep}
                isFutureStep={isFutureStep}
                onGenerate={() => handleGenerateStep(step.slug)}
                onApprove={(approved, feedback) =>
                  handleApproveStep(step.slug, approved, feedback)
                }
              />
            );
          })}

          {currentStepIndex >= steps.length && (
            <div className="completion-message">
              <div className="completion-icon">🎉</div>
              <h3>Lesson Complete!</h3>
              <p>
                All steps have been completed. Your lesson plan for "{fiche.lessonTitle}" is ready!
              </p>
              <button className="btn-primary" onClick={() => window.print()}>
                📄 Download/Print Lesson
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {currentStepIndex < steps.length && (
        <div className="lesson-chat-footer">
          <div className="quick-actions">
            <button
              className="btn-secondary"
              onClick={() => handleGenerateStep(steps[currentStepIndex].slug)}
              disabled={stepStates[steps[currentStepIndex].slug]?.loading}
            >
              {stepStates[steps[currentStepIndex].slug]?.loading ? (
                <>
                  <div className="spinner small"></div>
                  Generating...
                </>
              ) : (
                <>✨ Generate Current Step</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonChat;