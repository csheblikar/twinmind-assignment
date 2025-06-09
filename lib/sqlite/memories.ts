import { randomUUID } from 'expo-crypto';
import { SQLiteDatabase } from 'expo-sqlite';

export type Memory = {
  id: string;
  title: string;
  calendarId?: string;
  location?: string;
  createdAt: Date;
};

export function getAllMemories(db: SQLiteDatabase) {
  return db.getAllAsync<Memory>(`SELECT * FROM memories ORDER BY createdAt DESC`);
}

export function getMemoryById(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<Memory>(`SELECT * FROM memories WHERE id = ?`, [id]);
}

export async function insertMemory(db: SQLiteDatabase, memory: Omit<Memory, 'id' | 'createdAt'>) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const sql = `INSERT INTO memories (id, title, calendarId, location, createdAt) VALUES (?, ?, ?, ?, ?)`;
  const params = [id, memory.title, memory.calendarId || null, memory.location || null, createdAt];
  await db.runAsync(sql, params);
  return id;
}
