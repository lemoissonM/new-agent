import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonForm } from '../components/LessonForm';
import { ficheApi } from '../services/api';
import { Fiche } from '../types/fiche.types';
import { GraduationCap, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateLesson = async (ficheData: Partial<Fiche>) => {
    setIsCreating(true);
    setError(null);

    try {
      const fiche = await ficheApi.create({
        ...ficheData,
        status: 'in_progress',
        currentStep: 0,
      });

      navigate(`/lesson/${fiche.id}`);
    } catch (err) {
      setError('Failed to create lesson. Please try again.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap size={48} className="text-primary-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              AI Lesson Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-yellow-500" />
            Create comprehensive, culturally-relevant lesson plans powered by AI
            <Sparkles size={20} className="text-yellow-500" />
          </p>
          <p className="text-gray-600 mt-2">
            For Maternelle, Primaire, and Secondaire levels in the DRC educational system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <LessonForm onSubmit={handleCreateLesson} isLoading={isCreating} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary-600 mb-2">3</div>
            <div className="text-gray-600">Educational Levels</div>
            <div className="text-sm text-gray-500 mt-1">Maternelle, Primaire, Secondaire</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary-600 mb-2">10+</div>
            <div className="text-gray-600">Lesson Steps</div>
            <div className="text-sm text-gray-500 mt-1">Comprehensive step-by-step generation</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary-600 mb-2">AI</div>
            <div className="text-gray-600">Powered</div>
            <div className="text-sm text-gray-500 mt-1">Using OpenAI GPT-4</div>
          </div>
        </div>
      </div>
    </div>
  );
};