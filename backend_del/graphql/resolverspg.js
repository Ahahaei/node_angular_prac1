const pool = require('../models/userspg');

module.exports = {
  users: async function () {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users');
      return {
        users: result.rows,
      };
    } catch (err) {
      console.error('Error fetching users:', err);
      throw new Error('Failed to fetch users');
    } finally {
      client.release();
    }
  },
  user: async ({ id }) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new Error('No user found!');
      }
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching user:', err);
      throw new Error('Failed to fetch user');
    } finally {
      client.release();
    }
  },
  createUser: async function ({ userInput }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
        [userInput.email, userInput.name]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw new Error('Failed to create user');
    } finally {
      client.release();
    }
  },
  updateUser: async function ({ id, userInput }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *',
        [userInput.email, userInput.name, id]
      );
      if (result.rowCount === 0) {
        throw new Error('No user found!');
      }
      return result.rows[0];
    } catch (err) {
      console.error('Error updating user:', err);
      throw new Error('Failed to update user');
    } finally {
      client.release();
    }
  },
  deleteUser: async function ({ id }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        throw new Error('No user found!');
      }
      return result.rows[0];
    } catch (err) {
      console.error('Error deleting users:', err);
      throw new Error('Failed to delete user');
    } finally {
      client.release();
    }
  },
};
