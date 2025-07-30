import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('habbit-tracker.db');

// Initialize the database with tables
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {

  try {
    // Use execAsync for bulk operations like table creation
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habbit_records (
        id TEXT PRIMARY KEY,
        habbitId TEXT NOT NULL,
        requiredValue REAL NOT NULL,
        requiredType TEXT NOT NULL,
        actualValue REAL NOT NULL,
        completedAt DATETIME NOT NULL
      );
    `);
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

