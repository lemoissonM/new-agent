import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LessonWorkflow } from './components/LessonWorkflow';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:id" element={<LessonWorkflow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;