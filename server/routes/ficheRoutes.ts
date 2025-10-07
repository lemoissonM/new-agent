import { Router } from 'express';
import { FicheService } from '../services/ficheService';
import { LessonAgent } from '../agents/LessonAgent';
import { Fiche, FicheStep } from '../../src/types/fiche.types';
import { getSteps } from '../../src/config/steps';

const router = Router();
const ficheService = new FicheService();

// Get API key from environment
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}
const agent = new LessonAgent(apiKey);

/**
 * Create a new lesson (fiche)
 */
router.post('/fiches', async (req, res) => {
  try {
    const ficheData: Partial<Fiche> = req.body;
    const fiche = await ficheService.createFiche(ficheData);
    res.json(fiche);
  } catch (error) {
    console.error('Error creating fiche:', error);
    res.status(500).json({ error: 'Failed to create fiche' });
  }
});

/**
 * Get all fiches
 */
router.get('/fiches', async (req, res) => {
  try {
    const fiches = await ficheService.getAllFiches();
    res.json(fiches);
  } catch (error) {
    console.error('Error fetching fiches:', error);
    res.status(500).json({ error: 'Failed to fetch fiches' });
  }
});

/**
 * Get fiche by ID
 */
router.get('/fiches/:id', async (req, res) => {
  try {
    const fiche = await ficheService.getFicheById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }
    res.json(fiche);
  } catch (error) {
    console.error('Error fetching fiche:', error);
    res.status(500).json({ error: 'Failed to fetch fiche' });
  }
});

/**
 * Update fiche
 */
router.patch('/fiches/:id', async (req, res) => {
  try {
    const fiche = await ficheService.updateFiche(req.params.id, req.body);
    res.json(fiche);
  } catch (error) {
    console.error('Error updating fiche:', error);
    res.status(500).json({ error: 'Failed to update fiche' });
  }
});

/**
 * Delete fiche
 */
router.delete('/fiches/:id', async (req, res) => {
  try {
    await ficheService.deleteFiche(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting fiche:', error);
    res.status(500).json({ error: 'Failed to delete fiche' });
  }
});

/**
 * Get steps for a specific fiche
 */
router.get('/fiches/:id/steps', async (req, res) => {
  try {
    const fiche = await ficheService.getFicheById(req.params.id);
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }
    const steps = getSteps(fiche.classe);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching steps:', error);
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

/**
 * Generate content for a specific step
 */
router.post('/fiches/:id/generate-step', async (req, res) => {
  try {
    const { step } = req.body;
    const fiche = await ficheService.getFicheById(req.params.id);
    
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }

    const result = await agent.generateStep(fiche, step as FicheStep);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Update fiche with generated content
    const updates: Partial<Fiche> = {
      currentStep: step,
      [stepToFieldName(step)]: result.content,
    };
    
    const updatedFiche = await ficheService.updateFiche(req.params.id, updates);
    
    // Save to step history
    await agent.saveStepToDatabase(req.params.id, step, result.content);

    res.json({
      step: result.step,
      content: result.content,
      fiche: updatedFiche,
    });
  } catch (error) {
    console.error('Error generating step:', error);
    res.status(500).json({ error: 'Failed to generate step' });
  }
});

/**
 * Approve a step
 */
router.post('/fiches/:id/approve-step', async (req, res) => {
  try {
    const { step, approved, feedback } = req.body;
    const fiche = await ficheService.getFicheById(req.params.id);
    
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }

    if (!approved && feedback) {
      // Regenerate with feedback
      const result = await agent.regenerateStep(fiche, step as FicheStep, feedback);
      
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      const updates: Partial<Fiche> = {
        [stepToFieldName(step)]: result.content,
      };
      
      const updatedFiche = await ficheService.updateFiche(req.params.id, updates);
      
      await agent.saveStepToDatabase(
        req.params.id,
        step,
        result.content,
        feedback,
        false
      );

      res.json({
        step: result.step,
        content: result.content,
        fiche: updatedFiche,
      });
    } else {
      // Mark as approved
      await agent.saveStepToDatabase(
        req.params.id,
        step,
        (fiche as any)[stepToFieldName(step)],
        feedback,
        true
      );

      res.json({ success: true, approved: true });
    }
  } catch (error) {
    console.error('Error approving step:', error);
    res.status(500).json({ error: 'Failed to approve step' });
  }
});

/**
 * Start lesson generation workflow
 */
router.post('/fiches/:id/generate-lesson', async (req, res) => {
  try {
    const fiche = await ficheService.getFicheById(req.params.id);
    
    if (!fiche) {
      return res.status(404).json({ error: 'Fiche not found' });
    }

    // Set response headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Start generation
    for await (const result of agent.generateLesson(fiche)) {
      res.write(`data: ${JSON.stringify(result)}\n\n`);
      
      if (result.success) {
        // Update fiche in database
        const updates: Partial<Fiche> = {
          currentStep: result.step,
          [stepToFieldName(result.step)]: result.content,
        };
        await ficheService.updateFiche(req.params.id, updates);
        
        // Save to history
        await agent.saveStepToDatabase(req.params.id, result.step, result.content);
      }
    }

    res.write('data: {"done": true}\n\n');
    res.end();
  } catch (error) {
    console.error('Error generating lesson:', error);
    res.status(500).json({ error: 'Failed to generate lesson' });
  }
});

/**
 * Helper to convert step enum to field name
 */
function stepToFieldName(step: string): string {
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
}

export default router;