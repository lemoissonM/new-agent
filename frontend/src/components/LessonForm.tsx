import React, { useState } from 'react';
import { Fiche } from '../types/fiche.types';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';

interface LessonFormProps {
  onSubmit: (fiche: Partial<Fiche>) => void;
  isLoading?: boolean;
}

const classes = [
  { id: '1', name: '1ère Maternelle', level: 'Maternelle' },
  { id: '2', name: '2ème Maternelle', level: 'Maternelle' },
  { id: '3', name: '3ème Maternelle', level: 'Maternelle' },
  { id: '4', name: '1ère Primaire', level: 'Primaire' },
  { id: '5', name: '2ème Primaire', level: 'Primaire' },
  { id: '6', name: '3ème Primaire', level: 'Primaire' },
  { id: '7', name: '4ème Primaire', level: 'Primaire' },
  { id: '8', name: '5ème Primaire', level: 'Primaire' },
  { id: '9', name: '6ème Primaire', level: 'Primaire' },
  { id: '10', name: '1ère Secondaire', level: 'Secondaire' },
  { id: '11', name: '2ème Secondaire', level: 'Secondaire' },
  { id: '12', name: '3ème Secondaire', level: 'Secondaire' },
  { id: '13', name: '4ème Secondaire', level: 'Secondaire' },
  { id: '14', name: '5ème Secondaire', level: 'Secondaire' },
  { id: '15', name: '6ème Secondaire', level: 'Secondaire' },
];

export const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Fiche>>({
    subject: '',
    lessonTitle: '',
    classe: '10',
    areaOfLife: '',
    domain: '',
    previousLesson: '',
    contentOutline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Fiche, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <GraduationCap className="text-primary-600" size={36} />
          Create New Lesson
        </h2>
        <p className="text-gray-600 mt-2">Fill in the details to generate a comprehensive lesson plan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="inline mr-2" size={16} />
            Subject *
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Mathematics, French, Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class Level *
          </label>
          <select
            required
            value={formData.classe}
            onChange={(e) => handleChange('classe', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.level})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Title *
          </label>
          <input
            type="text"
            required
            value={formData.lessonTitle}
            onChange={(e) => handleChange('lessonTitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Introduction to Fractions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline mr-2" size={16} />
            Area of Life
          </label>
          <input
            type="text"
            value={formData.areaOfLife}
            onChange={(e) => handleChange('areaOfLife', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Finance, Health, Environment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain
          </label>
          <input
            type="text"
            value={formData.domain}
            onChange={(e) => handleChange('domain', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Algebra, Grammar"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Lesson
          </label>
          <input
            type="text"
            value={formData.previousLesson}
            onChange={(e) => handleChange('previousLesson', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Basic Number Operations"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Outline (Optional)
          </label>
          <textarea
            value={formData.contentOutline}
            onChange={(e) => handleChange('contentOutline', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Provide a brief outline of what this lesson should cover..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Creating...' : 'Start Lesson Generation'}
      </button>
    </form>
  );
};