import React, { useState } from 'react';
import { classes } from '@/config/classes';
import './LessonWizard.css';

interface LessonWizardProps {
  onComplete: (ficheId: string) => void;
}

function LessonWizard({ onComplete }: LessonWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: '',
    lessonTitle: '',
    areaOfLife: '',
    classe: '',
    domain: '',
    contentOutline: '',
    previousLesson: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/fiches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      onComplete(data.id);
    } catch (error) {
      console.error('Error creating fiche:', error);
      alert('Failed to create lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.subject && formData.lessonTitle;
      case 2:
        return formData.classe && formData.areaOfLife;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="lesson-wizard">
      <div className="wizard-container">
        <div className="wizard-header">
          <h2>Create New Lesson</h2>
          <div className="wizard-steps">
            <div className={`wizard-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className="step-connector"></div>
            <div className={`wizard-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Details</div>
            </div>
            <div className="step-connector"></div>
            <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Additional</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="wizard-form">
          {step === 1 && (
            <div className="wizard-step-content fade-in">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label htmlFor="subject">
                  Subject <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, French, Sciences"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lessonTitle">
                  Lesson Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lessonTitle"
                  name="lessonTitle"
                  value={formData.lessonTitle}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to Fractions"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step-content fade-in">
              <h3>Class Details</h3>
              <div className="form-group">
                <label htmlFor="classe">
                  Class Level <span className="required">*</span>
                </label>
                <select
                  id="classe"
                  name="classe"
                  value={formData.classe}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.ageRange})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="areaOfLife">
                  Area of Life <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="areaOfLife"
                  name="areaOfLife"
                  value={formData.areaOfLife}
                  onChange={handleChange}
                  placeholder="e.g., Family, Environment, Health"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step-content fade-in">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="domain">Domain (Optional)</label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="e.g., Algebra, Geometry"
                />
              </div>
              <div className="form-group">
                <label htmlFor="previousLesson">Previous Lesson (Optional)</label>
                <input
                  type="text"
                  id="previousLesson"
                  name="previousLesson"
                  value={formData.previousLesson}
                  onChange={handleChange}
                  placeholder="What was covered in the previous lesson?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contentOutline">Content Outline (Optional)</label>
                <textarea
                  id="contentOutline"
                  name="contentOutline"
                  value={formData.contentOutline}
                  onChange={handleChange}
                  placeholder="Provide an outline of the content you want to cover..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <div className="wizard-actions">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
                disabled={loading}
              >
                ← Back
              </button>
            )}
            <div className="flex-spacer"></div>
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                disabled={!isStepValid()}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !isStepValid()}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Creating...
                  </>
                ) : (
                  'Create Lesson'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LessonWizard;