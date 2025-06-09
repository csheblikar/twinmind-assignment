import { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDatabase(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if (!result) {
    console.error('Failed to retrieve user_version from database');
    return;
  }

  const currentVersion = result.user_version;
  if (currentVersion >= DATABASE_VERSION) {
    console.log(`Database is already at version ${currentVersion}. No migration needed.`);
    return;
  }

  // Perform migrations based on the current version
  if (currentVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';

CREATE TABLE IF NOT EXISTS memories (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  calendarId  TEXT,
  location    TEXT,
  createdAt   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audio_chunks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  uri         TEXT NOT NULL,
  timestamp   TEXT NOT NULL,
  uploaded    INTEGER NOT NULL DEFAULT 0,
  memoryId    TEXT NOT NULL,
  FOREIGN KEY (memoryId) REFERENCES memories (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  summary     TEXT NOT NULL,
  startTime   TEXT NOT NULL,
  endTime     TEXT NOT NULL
);
`);
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
    console.log(`Database migrated to version ${DATABASE_VERSION}`);
  }
}
