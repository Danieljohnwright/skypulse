import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Daniel@980116",
  database: "skypulse",
});
