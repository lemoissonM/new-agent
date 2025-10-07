import { v4 as uuidv4 } from 'uuid';
import { Fiche, LessonSession, FicheStep } from '../types/fiche.types';
import { query, getClient } from './db';

export class FicheRepository {
  async create(fiche: Partial<Fiche>): Promise<Fiche> {
    const id = fiche.id || uuidv4();
    const result = await query(
      `INSERT INTO fiches (
        id, subject, lesson_title, area_of_life, classe, domain, 
        content_outline, previous_lesson, status, current_step
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        id,
        fiche.subject,
        fiche.lessonTitle,
        fiche.areaOfLife || null,
        fiche.classe,
        fiche.domain || null,
        fiche.contentOutline || null,
        fiche.previousLesson || null,
        fiche.status || 'draft',
        fiche.currentStep || 0,
      ]
    );
    return this.mapRowToFiche(result.rows[0]);
  }

  async findById(id: string): Promise<Fiche | null> {
    const result = await query('SELECT * FROM fiches WHERE id = $1', [id]);
    return result.rows[0] ? this.mapRowToFiche(result.rows[0]) : null;
  }

  async update(id: string, updates: Partial<Fiche>): Promise<Fiche> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        const snakeKey = this.camelToSnake(key);
        fields.push(`${snakeKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE fiches SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return this.mapRowToFiche(result.rows[0]);
  }

  async updateStep(id: string, step: FicheStep, content: string): Promise<Fiche> {
    const stepField = this.camelToSnake(step);
    const result = await query(
      `UPDATE fiches 
       SET ${stepField} = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [content, id]
    );
    return this.mapRowToFiche(result.rows[0]);
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Fiche[]> {
    const result = await query(
      'SELECT * FROM fiches ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows.map(row => this.mapRowToFiche(row));
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM fiches WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Session management
  async createSession(ficheId: string): Promise<LessonSession> {
    const id = uuidv4();
    const result = await query(
      `INSERT INTO lesson_sessions (id, fiche_id, current_step_index, pending_approval)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, ficheId, 0, false]
    );
    return this.mapRowToSession(result.rows[0]);
  }

  async getSession(sessionId: string): Promise<LessonSession | null> {
    const result = await query(
      'SELECT * FROM lesson_sessions WHERE id = $1',
      [sessionId]
    );
    return result.rows[0] ? this.mapRowToSession(result.rows[0]) : null;
  }

  async updateSession(sessionId: string, updates: Partial<LessonSession>): Promise<LessonSession> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.currentStepIndex !== undefined) {
      fields.push(`current_step_index = $${paramIndex}`);
      values.push(updates.currentStepIndex);
      paramIndex++;
    }

    if (updates.completedSteps !== undefined) {
      fields.push(`completed_steps = $${paramIndex}`);
      values.push(updates.completedSteps);
      paramIndex++;
    }

    if (updates.pendingApproval !== undefined) {
      fields.push(`pending_approval = $${paramIndex}`);
      values.push(updates.pendingApproval);
      paramIndex++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(sessionId);

    const result = await query(
      `UPDATE lesson_sessions SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return this.mapRowToSession(result.rows[0]);
  }

  // Helper methods
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private mapRowToFiche(row: any): Fiche {
    return {
      id: row.id,
      subject: row.subject,
      lessonTitle: row.lesson_title,
      areaOfLife: row.area_of_life,
      classe: row.classe,
      domain: row.domain,
      contentOutline: row.content_outline,
      previousLesson: row.previous_lesson,
      objectives: row.objectives,
      revisionTeacher: row.revision_teacher,
      revisionStudent: row.revision_student,
      revisionTeacherRappel: row.revision_teacher_rappel,
      revisionStudentRappel: row.revision_student_rappel,
      revisionTeacherMotivation: row.revision_teacher_motivation,
      revisionStudentMotivation: row.revision_student_motivation,
      situation: row.situation,
      activitePrincipaleTeacher: row.activite_principale_teacher,
      activitePrincipaleStudent: row.activite_principale_student,
      syntheseTeacher: row.synthese_teacher,
      syntheseStudent: row.synthese_student,
      exercice: row.exercice,
      situationSimilaire: row.situation_similaire,
      activiteControleApplicationTeacher: row.activite_controle_application_teacher,
      activiteControleApplicationStudent: row.activite_controle_application_student,
      activiteControleResearchTeacher: row.activite_controle_research_teacher,
      activiteControleResearchStudent: row.activite_controle_research_student,
      activiteControleEvaluationTeacher: row.activite_controle_evaluation_teacher,
      activiteControleEvaluationStudent: row.activite_controle_evaluation_student,
      currentStep: row.current_step,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToSession(row: any): LessonSession {
    return {
      id: row.id,
      ficheId: row.fiche_id,
      currentStepIndex: row.current_step_index,
      completedSteps: row.completed_steps || [],
      pendingApproval: row.pending_approval,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const ficheRepository = new FicheRepository();