import { Router, Request, Response } from 'express';
import { ficheRepository } from '../database/fiche.repository';
import { createLessonAgent } from '../agents/lesson-agent';
import { FicheSchema, FicheStep } from '../types/fiche.types';
import { getSteps } from '../utils/prompts';

const router = Router();
const agent = createLessonAgent();

// Create a new fiche
router.post('/', async (req: Request, res: Response) => {
  try {
    const ficheData = FicheSchema.parse(req.body);
    const fiche = await ficheRepository.create(ficheData);
    res.status(201).json(fiche);
  } catch (error) {
    console.error('Error creating fiche:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

// Get fiche by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const fiche = await ficheRepository.findById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }
    res.json(fiche);
  } catch (error) {
    console.error('Error fetching fiche:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all fiches
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const fiches = await ficheRepository.findAll(limit, offset);
    res.json(fiches);
  } catch (error) {
    console.error('Error fetching fiches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update fiche
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const fiche = await ficheRepository.update(req.params.id, req.body);
    res.json(fiche);
  } catch (error) {
    console.error('Error updating fiche:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete fiche
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await ficheRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Fiche not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting fiche:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get steps for a fiche
router.get('/:id/steps', async (req: Request, res: Response) => {
  try {
    const fiche = await ficheRepository.findById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }
    const steps = getSteps(fiche);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching steps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Execute a specific step
router.post('/:id/steps/:step/execute', async (req: Request, res: Response) => {
  try {
    const fiche = await ficheRepository.findById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }

    const step = req.params.step as FicheStep;
    const { userFeedback } = req.body;

    const result = await agent.executeStep(fiche, step, userFeedback);
    
    // Save the result
    if (result.status !== 'error') {
      await ficheRepository.updateStep(req.params.id, step, result.content);
    }

    res.json(result);
  } catch (error) {
    console.error('Error executing step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve a step and move to next
router.post('/:id/steps/:step/approve', async (req: Request, res: Response) => {
  try {
    const fiche = await ficheRepository.findById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }

    const steps = getSteps(fiche);
    const currentStepIndex = steps.findIndex(s => s.slug === req.params.step);
    
    if (currentStepIndex === -1) {
      return res.status(400).json({ error: 'Invalid step' });
    }

    // Update current step
    const nextStepIndex = currentStepIndex + 1;
    const isCompleted = nextStepIndex >= steps.length;

    await ficheRepository.update(req.params.id, {
      currentStep: nextStepIndex,
      status: isCompleted ? 'completed' : 'in_progress',
    });

    res.json({
      currentStep: nextStepIndex,
      nextStep: isCompleted ? null : steps[nextStepIndex],
      isCompleted,
    });
  } catch (error) {
    console.error('Error approving step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start a lesson generation session
router.post('/:id/session/start', async (req: Request, res: Response) => {
  try {
    const fiche = await ficheRepository.findById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }

    const session = await ficheRepository.createSession(req.params.id);
    res.status(201).json(session);
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get session
router.get('/:id/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const session = await ficheRepository.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;