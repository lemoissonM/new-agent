import React, { useState } from 'react';
import { StepDefinition, FicheStep } from '../types/fiche.types';
import { CheckCircle, XCircle, Loader2, MessageSquare, User, BookOpen } from 'lucide-react';

interface StepCardProps {
  step: StepDefinition;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  content?: string;
  onExecute: (feedback?: string) => Promise<void>;
  onApprove: () => Promise<void>;
  onReject: () => void;
  isGenerating: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  isActive,
  isCompleted,
  content,
  onExecute,
  onApprove,
  onReject,
  isGenerating,
}) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const getTypeIcon = () => {
    switch (step.type) {
      case 'teacher':
        return <User className="text-blue-600" size={20} />;
      case 'student':
      case 'eleve':
        return <BookOpen className="text-green-600" size={20} />;
      default:
        return <MessageSquare className="text-purple-600" size={20} />;
    }
  };

  const getTypeLabel = () => {
    switch (step.type) {
      case 'teacher':
        return 'Teacher';
      case 'student':
      case 'eleve':
        return 'Student';
      default:
        return 'General';
    }
  };

  const handleExecute = async () => {
    await onExecute(feedback || undefined);
    setFeedback('');
    setShowFeedback(false);
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 transition-all ${
        isActive
          ? 'border-primary-500 bg-primary-50 shadow-lg'
          : isCompleted
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              {getTypeIcon()}
              <span>{getTypeLabel()}</span>
            </div>
          </div>
        </div>
        
        {isCompleted && (
          <CheckCircle className="text-green-600" size={24} />
        )}
      </div>

      {content && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{content}</div>
          </div>
        </div>
      )}

      {isActive && !content && (
        <button
          onClick={() => onExecute()}
          disabled={isGenerating}
          className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            'Generate This Step'
          )}
        </button>
      )}

      {isActive && content && !isCompleted && (
        <div className="mt-4 space-y-3">
          {showFeedback && (
            <div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback for regeneration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onApprove}
              disabled={isGenerating}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Approve & Continue
            </button>
            
            {!showFeedback ? (
              <button
                onClick={() => setShowFeedback(true)}
                disabled={isGenerating}
                className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Request Changes
              </button>
            ) : (
              <button
                onClick={handleExecute}
                disabled={isGenerating || !feedback}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Regenerating...
                  </>
                ) : (
                  'Regenerate'
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};