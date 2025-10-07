import React, { useState } from 'react';
import LessonChat from './components/LessonChat';
import LessonWizard from './components/LessonWizard';
import LessonList from './components/LessonList';
import './App.css';

type View = 'list' | 'wizard' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedFicheId, setSelectedFicheId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setCurrentView('wizard');
  };

  const handleWizardComplete = (ficheId: string) => {
    setSelectedFicheId(ficheId);
    setCurrentView('chat');
  };

  const handleSelectFiche = (ficheId: string) => {
    setSelectedFicheId(ficheId);
    setCurrentView('chat');
  };

  const handleBackToList = () => {
    setSelectedFicheId(null);
    setCurrentView('list');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)" />
              <path
                d="M16 8L20 16L16 24L12 16L16 8Z"
                fill="white"
                opacity="0.9"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <h1>Lesson Generator</h1>
          </div>
          {currentView !== 'list' && (
            <button className="back-btn" onClick={handleBackToList}>
              ← Back to Lessons
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {currentView === 'list' && (
          <LessonList
            onCreateNew={handleCreateNew}
            onSelectFiche={handleSelectFiche}
          />
        )}
        {currentView === 'wizard' && (
          <LessonWizard onComplete={handleWizardComplete} />
        )}
        {currentView === 'chat' && selectedFicheId && (
          <LessonChat ficheId={selectedFicheId} />
        )}
      </main>
    </div>
  );
}

export default App;