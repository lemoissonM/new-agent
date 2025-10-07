import pool from '../database/db';
import { Fiche } from '../../src/types/fiche.types';

export class FicheService {
  /**
   * Create a new fiche
   */
  async createFiche(fiche: Partial<Fiche>): Promise<Fiche> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO fiches (
          subject, lesson_title, area_of_life, classe, domain, 
          content_outline, previous_lesson, status, current_step
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          fiche.subject,
          fiche.lessonTitle,
          fiche.areaOfLife,
          fiche.classe,
          fiche.domain,
          fiche.contentOutline,
          fiche.previousLesson,
          'draft',
          null,
        ]
      );
      return this.mapRowToFiche(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Get fiche by ID
   */
  async getFicheById(id: string): Promise<Fiche | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM fiches WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      return this.mapRowToFiche(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Update fiche
   */
  async updateFiche(id: string, updates: Partial<Fiche>): Promise<Fiche> {
    const client = await pool.connect();
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${this.camelToSnake(key)} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      values.push(id);
      const query = `
        UPDATE fiches 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);
      return this.mapRowToFiche(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Get all fiches
   */
  async getAllFiches(): Promise<Fiche[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM fiches ORDER BY created_at DESC'
      );
      return result.rows.map((row) => this.mapRowToFiche(row));
    } finally {
      client.release();
    }
  }

  /**
   * Delete fiche
   */
  async deleteFiche(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM fiches WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  /**
   * Map database row to Fiche object
   */
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
      resumeTeacher: row.resume_teacher,
      resumeStudent: row.resume_student,
      activiteControleApplicationTeacher: row.activite_controle_application_teacher,
      activiteControleApplicationStudent: row.activite_controle_application_student,
      activiteControleResearchTeacher: row.activite_controle_research_teacher,
      activiteControleResearchStudent: row.activite_controle_research_student,
      activiteControleEvaluationTeacher: row.activite_controle_evaluation_teacher,
      activiteControleEvaluationStudent: row.activite_controle_evaluation_student,
      status: row.status,
      currentStep: row.current_step,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}