import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

function getDbInstance() {
  let dbUrl = process.env.DATABASE_URL || "file:./data/veloria.db";
  const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl.startsWith("libsql://") && !dbUrl.startsWith("https://") && !dbUrl.startsWith("file:")) {
    // If a simple relative path like ./data/veloria.db is passed
    const dbPath = path.isAbsolute(dbUrl) ? dbUrl : path.join(process.cwd(), dbUrl);
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    dbUrl = `file:${dbPath}`;
  } else if (dbUrl.startsWith("file:")) {
    const rawPath = dbUrl.replace("file:", "");
    const dbPath = path.isAbsolute(rawPath) ? rawPath : path.join(process.cwd(), rawPath);
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    dbUrl = `file:${dbPath}`;
  }

  const client = createClient({
    url: dbUrl,
    authToken: dbAuthToken,
  });

  return drizzle(client, { schema });
}

export const db = getDbInstance();
export { schema };
