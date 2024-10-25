import express from "express";
import pg from "pg";
import cors from "cors";
import env from "dotenv";

env.config();
const app = express();
const port = 5000;
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

const getTableName = (name) => {
  switch (name) {
    case "To Do":
      return "to_do";
    case "In Progress":
      return "in_progress";
    case "Done":
      return "done";
    default:
      throw new Error("Invalid table name");
  }
};

app.get("/api/items/:table", async (req, res) => {
  try {
    const table = getTableName(req.params.table);
    const result = await pool.query(
      `SELECT id, text, TO_CHAR(date, 'YYYY-MM-DD') AS date FROM ${table}`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/api/items/:table", async (req, res) => {
  const table = getTableName(req.params.table);
  const { text, date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ${table} (text, date) VALUES ($1, $2) RETURNING id, text, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [text, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/api/items/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  const tableName = getTableName(table);
  try {
    const result = await pool.query(
      `DELETE FROM ${tableName} WHERE id = ($1) RETURNING id, text, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Item not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/api/items/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  const { field, value } = req.body;
  const tableName = getTableName(table);
  try {
    const result = await pool.query(
      `UPDATE ${tableName} SET ${field} = ($1) WHERE id = ($2) RETURNING id, text, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [value, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
