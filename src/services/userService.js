const UserModel = require('../models/userModel')
const validateLogin = require('../utils/validateLogin')
const validateEmail = require('../utils/validateEmail')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const role = ['admin', 'adopter']
class UserService {
  static async login(data) {
    const { email, password } = data
    const erroLogin = validateLogin(data)
    if (erroLogin) {
      throw new Error(erroLogin)
    }

    if (!validateEmail(email)) {
      throw new Error('Email Inválido')
    }

    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw new Error('E-mail ou senha incorretos')
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      throw new Error('E-mail ou senha incorretos')
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    return { token }
  }

  static async getAllUsers() {
    const users = await UserModel.findAll()
    if (users.length === 0) {
      throw new Error('Nenhum usuário encontrado')
    }
    return users
  }

  static async getUserById(id, usuarioLogado) {
    if (usuarioLogado.role !== 'admin' && String(usuarioLogado.userId) !== String(id)) {
      throw new Error('Acesso negado: você só pode visualizar o seu próprio perfil')
    }
    const user = await UserModel.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return user
  }

  static async findUserByEmail(email) {
    if (!validateEmail(email)) {
      throw new Error('Email Inválido')
    }
    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return user
  }

  static async createUser(data) {
    const camposObrigatorios = ['name', 'email', 'password', 'phone']
    for (const campo of camposObrigatorios) {
      if (!data[campo]) {
        throw new Error(`${campo} é obrigatório`)
      }
    }
    if (!validateEmail(data.email)) {
      throw new Error('Email Inválido')
    }
    const roleNormalizada = data.role ? data.role.trim().toLowerCase() : 'adopter'
    if (!role.includes(roleNormalizada)) {
      throw new Error('Role deve ser "admin" ou "adopter"')
    }
    const existingUser = await UserModel.findByEmail(data.email)
    if (existingUser) {
      throw new Error('E-mail já cadastrado')
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = { ...data, role: roleNormalizada, password: hashedPassword }
    return await UserModel.create(newUser)
  }

  static async updateUser(id, data, usuarioLogado) {
    if (usuarioLogado.role !== 'admin' && String(usuarioLogado.userId) !== String(id)) {
      throw new Error('Acesso negado: você só pode atualizar o seu próprio perfil')
    }

    const user = await UserModel.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const payload = { ...data }
    if (Object.keys(payload).length === 0) {
      throw new Error('Nenhum campo para atualizar')
    }

    if (payload.email) {
      if (!validateEmail(payload.email)) {
        throw new Error('Email Inválido')
      }

      const existingUser = await UserModel.findByEmail(payload.email)
      if (existingUser && String(existingUser.id) !== String(id)) {
        throw new Error('E-mail já cadastrado')
      }
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10)
    }
    return await UserModel.update(id, payload)
  }

  static async deleteUser(id) {
    const user = await UserModel.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return await UserModel.delete(id)
  }
}

module.exports = UserService
