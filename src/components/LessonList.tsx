import React, { useEffect, useState } from 'react';
import { Fiche } from '@/types/fiche.types';
import './LessonList.css';

interface LessonListProps {
  onCreateNew: () => void;
  onSelectFiche: (ficheId: string) => void;
}

function LessonList({ onCreateNew, onSelectFiche }: LessonListProps) {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiches();
  }, []);

  const fetchFiches = async () => {
    try {
      const response = await fetch('/api/fiches');
      const data = await response.json();
      setFiches(data);
    } catch (error) {
      console.error('Error fetching fiches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusMap = {
      draft: { label: 'Draft', className: 'status-draft' },
      in_progress: { label: 'In Progress', className: 'status-progress' },
      completed: { label: 'Completed', className: 'status-completed' },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return (
      <span className={`status-badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="lesson-list-loading">
        <div className="spinner"></div>
        <p>Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="lesson-list">
      <div className="lesson-list-header">
        <div>
          <h2>My Lessons</h2>
          <p className="subtitle">
            Create and manage your lesson plans with AI assistance
          </p>
        </div>
        <button className="btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Lesson
        </button>
      </div>

      {fiches.length === 0 ? (
        <div className="empty-state">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            opacity="0.3"
          >
            <rect
              x="20"
              y="30"
              width="80"
              height="70"
              rx="8"
              stroke="currentColor"
              strokeWidth="3"
            />
            <line
              x1="35"
              y1="50"
              x2="85"
              y2="50"
              stroke="currentColor"
              strokeWidth="3"
            />
            <line
              x1="35"
              y1="65"
              x2="75"
              y2="65"
              stroke="currentColor"
              strokeWidth="3"
            />
            <line
              x1="35"
              y1="80"
              x2="70"
              y2="80"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <h3>No lessons yet</h3>
          <p>Get started by creating your first AI-powered lesson plan</p>
          <button className="btn-primary" onClick={onCreateNew}>
            Create Your First Lesson
          </button>
        </div>
      ) : (
        <div className="lessons-grid">
          {fiches.map((fiche) => (
            <div
              key={fiche.id}
              className="lesson-card"
              onClick={() => onSelectFiche(fiche.id!)}
            >
              <div className="lesson-card-header">
                <h3>{fiche.lessonTitle}</h3>
                {getStatusBadge(fiche.status)}
              </div>
              <div className="lesson-card-body">
                <div className="lesson-meta">
                  <span className="meta-item">
                    <strong>Subject:</strong> {fiche.subject}
                  </span>
                  <span className="meta-item">
                    <strong>Class:</strong> {fiche.classe}
                  </span>
                  {fiche.domain && (
                    <span className="meta-item">
                      <strong>Domain:</strong> {fiche.domain}
                    </span>
                  )}
                  <span className="meta-item">
                    <strong>Area:</strong> {fiche.areaOfLife}
                  </span>
                </div>
                {fiche.currentStep && (
                  <div className="current-step">
                    Current: <strong>{fiche.currentStep}</strong>
                  </div>
                )}
              </div>
              <div className="lesson-card-footer">
                <span className="date">
                  {new Date(fiche.createdAt!).toLocaleDateString()}
                </span>
                <span className="arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LessonList;