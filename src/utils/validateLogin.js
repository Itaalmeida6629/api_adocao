function validateLogin(body) {
  if (!body) {
    return 'Corpo da requisição é obrigatório'
  }

  const { email, password } = body

  if (!email) {
    return 'email é obrigatório'
  }

  if (!password) {
    return 'senha é obrigatória'
  }

  if (typeof email !== 'string') {
    return 'email deve ser string'
  }

  if (typeof password !== 'string') {
    return 'senha deve ser string'
  }

  return null
}

module.exports = validateLogin
