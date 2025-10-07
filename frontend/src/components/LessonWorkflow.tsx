import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonStore } from '../store/lessonStore';
import { ficheApi } from '../services/api';
import { StepCard } from './StepCard';
import { Fiche, FicheStep } from '../types/fiche.types';
import { ArrowLeft, Download, CheckCircle } from 'lucide-react';

export const LessonWorkflow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentFiche,
    steps,
    currentStepIndex,
    isGenerating,
    error,
    setFiche,
    setSteps,
    setCurrentStepIndex,
    setIsGenerating,
    setError,
    updateFicheField,
  } = useLessonStore();

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) {
      loadFiche();
    }
  }, [id]);

  const loadFiche = async () => {
    try {
      const fiche = await ficheApi.get(id!);
      setFiche(fiche);
      
      const stepsData = await ficheApi.getSteps(id!);
      setSteps(stepsData);
      
      setCurrentStepIndex(fiche.currentStep || 0);
    } catch (err) {
      setError('Failed to load lesson data');
      console.error(err);
    }
  };

  const executeStep = async (stepIndex: number, feedback?: string) => {
    if (!currentFiche || !id) return;

    setIsGenerating(true);
    setError(null);

    try {
      const step = steps[stepIndex];
      const result = await ficheApi.executeStep(id, step.slug, feedback);

      if (result.status === 'error') {
        setError(result.error || 'Failed to generate step');
        return;
      }

      // Update the fiche field with the result
      updateFicheField(step.slug, result.content);
      
      // Reload fiche to get updated data
      await loadFiche();
    } catch (err) {
      setError('Failed to execute step');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const approveStep = async (stepIndex: number) => {
    if (!id) return;

    try {
      const step = steps[stepIndex];
      const response = await ficheApi.approveStep(id, step.slug);
      
      setCompletedSteps((prev) => new Set(prev).add(stepIndex));
      setCurrentStepIndex(response.currentStep);
      
      // Reload fiche
      await loadFiche();
    } catch (err) {
      setError('Failed to approve step');
      console.error(err);
    }
  };

  const getStepContent = (stepSlug: FicheStep): string | undefined => {
    if (!currentFiche) return undefined;
    return (currentFiche as any)[stepSlug];
  };

  const downloadLesson = () => {
    if (!currentFiche) return;

    const content = JSON.stringify(currentFiche, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson-${currentFiche.lessonTitle?.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentFiche) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const isCompleted = currentStepIndex >= steps.length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {isCompleted && (
          <button
            onClick={downloadLesson}
            className="flex items-center gap-2 bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700"
          >
            <Download size={18} />
            Download Lesson
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentFiche.lessonTitle}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Subject: <strong>{currentFiche.subject}</strong></span>
          <span>Class: <strong>{currentFiche.classe}</strong></span>
          {currentFiche.domain && <span>Domain: <strong>{currentFiche.domain}</strong></span>}
        </div>

        {!isCompleted && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentStepIndex} / {steps.length} steps</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStepIndex / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isCompleted ? (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lesson Complete! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            All steps have been generated and approved. You can now download your lesson plan.
          </p>
          <button
            onClick={downloadLesson}
            className="bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 inline-flex items-center gap-2"
          >
            <Download size={18} />
            Download Complete Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {steps.map((step, index) => (
            <StepCard
              key={step.slug}
              step={step}
              index={index}
              isActive={index === currentStepIndex}
              isCompleted={completedSteps.has(index)}
              content={getStepContent(step.slug)}
              onExecute={(feedback) => executeStep(index, feedback)}
              onApprove={() => approveStep(index)}
              onReject={() => {}}
              isGenerating={isGenerating && index === currentStepIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};