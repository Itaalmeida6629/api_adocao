const db = require('../config/database.js')

class UserModel {
  static async findAll() {
    const [rows] = await db.query('SELECT id, name, email, phone, role FROM users')
    return rows
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [id])
    return rows[0]
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT id, name, email, password, phone, role FROM users WHERE email = ?', [email])
    return rows[0]
  }

  static async create(user) {
    const { name, email, password, phone, role } = user
    const [result] = await db.query('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)', [
      name,
      email,
      password,
      phone,
      role,
    ])
    return result.insertId
  }

  static async update(id, data) {
    const fields = []
    const values = []
    for (const key in data) {
      fields.push(`${key} = ?`)
      values.push(data[key])
    }
    values.push(id)
    const [result] = await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
    return result.affectedRows > 0
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = UserModel
