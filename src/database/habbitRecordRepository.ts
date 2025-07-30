import { db } from './database';
import { HabbitRecord } from '../types/HabbitRecord';

export class HabbitRecordRepository {
  // Create a new habbit record
  static async create(record: HabbitRecord): Promise<void> {
    try {
      await db.runAsync(
        `INSERT INTO habbit_records (id, habbitId, requiredValue, requiredType, actualValue, completedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.habbitId,
          record.requiredValue,
          record.requiredType,
          record.actualValue,
          record.completedAt.toISOString(),
        ]
      );

    } catch (error) {
      console.error('Error creating habbit record:', error);
      throw error;
    }
  }

  // Get all habbit records
  static async getAll(): Promise<HabbitRecord[]> {
    try {
      const rows = await db.getAllAsync<HabbitRecord>('SELECT * FROM habbit_records ORDER BY completedAt DESC');
      
      return rows.map((row) => ({
        id: row.id,
        habbitId: row.habbitId,
        requiredValue: row.requiredValue,
        requiredType: row.requiredType,
        actualValue: row.actualValue,
        completedAt: new Date(row.completedAt),
      }));
    } catch (error) {
      console.error('Error getting all habbit records:', error);
      throw error;
    }
  }

  // Get habbit records by habbitId
  static async getByHabbitId(habbitId: string): Promise<HabbitRecord[]> {
    try {
      const rows = await db.getAllAsync<HabbitRecord>('SELECT * FROM habbit_records WHERE habbitId = ? ORDER BY completedAt DESC', [habbitId]);
      
      return rows.map((row) => ({
        id: row.id,
        habbitId: row.habbitId,
        requiredValue: row.requiredValue,
        requiredType: row.requiredType,
        actualValue: row.actualValue,
        completedAt: new Date(row.completedAt),
      }));
    } catch (error) {
      console.error('Error getting habbit records by habbitId:', error);
      throw error;
    }
  }

  // Get a single habbit record by id
  static async getById(id: string): Promise<HabbitRecord | null> {
    try {
      const row = await db.getFirstAsync<HabbitRecord>('SELECT * FROM habbit_records WHERE id = ?', [id]);
      
      if (row) {
        return {
          id: row.id,
          habbitId: row.habbitId,
          requiredValue: row.requiredValue,
          requiredType: row.requiredType,
          actualValue: row.actualValue,
          completedAt: new Date(row.completedAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting habbit record by id:', error);
      throw error;
    }
  }

  // Update a habbit record
  static async update(record: HabbitRecord): Promise<void> {
    try {
      await db.runAsync(
        `UPDATE habbit_records 
         SET habbitId = ?, requiredValue = ?, requiredType = ?, actualValue = ?, completedAt = ?
         WHERE id = ?`,
        [
          record.habbitId,
          record.requiredValue,
          record.requiredType,
          record.actualValue,
          record.completedAt.toISOString(),
          record.id,
        ]
      );
    } catch (error) {
      console.error('Error updating habbit record:', error);
      throw error;
    }
  }

  // Delete a habbit record
  static async delete(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM habbit_records WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting habbit record:', error);
      throw error;
    }
  }

  // Delete all records for a specific habbit
  static async deleteByHabbitId(habbitId: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM habbit_records WHERE habbitId = ?', [habbitId]);
    } catch (error) {
      console.error('Error deleting habbit records by habbitId:', error);
      throw error;
    }
  }

  // Get habbit records by habbitId and date range
  static async getByHabbitIdAndDate(habbitIds: string[], date: Date): Promise<HabbitRecord[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const placeholders = habbitIds.map(() => '?').join(',');
      const rows = await db.getAllAsync<HabbitRecord>(
        `SELECT * FROM habbit_records WHERE habbitId IN (${placeholders}) AND completedAt >= ? AND completedAt <= ? ORDER BY completedAt DESC`,
        [...habbitIds, startOfDay.toISOString(), endOfDay.toISOString()]
      );
      return rows.map((row) => ({
        id: row.id,
        habbitId: row.habbitId,
        requiredValue: row.requiredValue,
        requiredType: row.requiredType,
        actualValue: row.actualValue,
        completedAt: new Date(row.completedAt),
      }));
    } catch (error) {
      console.error('Error getting habbit records by habbitId and date:', error);
      throw error;
    }
  }
} 