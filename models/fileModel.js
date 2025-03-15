const pool = require("../config/db");

// Save file metadata
const saveFile = async (file_name, url) => {
  const query = `INSERT INTO files (file_name, url, upload_date) VALUES (?, ?, NOW())`;
  await pool.execute(query, [file_name, url]);
};

// Get file metadata by name
const getFileByName = async (file_name) => {
  const [files] = await pool.execute(`SELECT * FROM files WHERE file_name = ?`, [file_name]);
  return files.length ? files[0] : null;
};

// Delete file metadata
const deleteFile = async (file_name) => {
  await pool.execute(`DELETE FROM files WHERE file_name = ?`, [file_name]);
};

module.exports = { saveFile, getFileByName, deleteFile };
