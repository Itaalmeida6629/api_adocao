const PetsModel = require('../models/petModel')

const validSizes = ['small', 'medium', 'large']
const validStatuses = ['available', 'adopted']

class PetsService {
  static async getAllPets() {
    const pets = await PetsModel.findAll()
    if (pets.length === 0) {
      throw new Error('Nenhum pet encontrado')
    }
    return pets
  }

  static async getAvailablePets() {
    const pets = await PetsModel.findAvailable()
    if (pets.length === 0) {
      throw new Error('Nenhum pet disponível encontrado')
    }
    return pets
  }

  static async getPetById(id) {
    const pet = await PetsModel.findById(id)
    if (!pet) {
      throw new Error('Pet não encontrado')
    }
    return pet
  }

  static async createPet(data) {
    const camposObrigatorios = ['name', 'age', 'species', 'size']

    for (const campo of camposObrigatorios) {
      if (!data[campo]) {
        throw new Error(`${campo} é obrigatório`)
      }
    }
    if (data.name.trim() === '') {
      throw new Error('Nome inválido.')
    }
    const sizeNormalized = data.size.toLowerCase()
    if (!validSizes.includes(sizeNormalized)) {
      throw new Error(`Tamanho inválido. Tamanho válidos: small, medium, large`)
    }
    if (isNaN(data.age) || data.age < 0) {
      throw new Error('Idade inválida. A idade deve ser um número não negativo')
    }
    if (data.species.trim() === '') {
      throw new Error('Espécie inválida.')
    }
    if (data.description && data.description.trim() === '') {
      throw new Error('Descrição inválida.')
    }
    const pet = { ...data, size: sizeNormalized, status: 'available' }
    return await PetsModel.create(pet)
  }

  static async updatePet(id, data) {
    const pet = await PetsModel.findById(id)
    if (!pet) {
      throw new Error('Pet não encontrado')
    }
    const payload = { ...data }
    if (Object.keys(payload).length === 0) {
      throw new Error('Nenhum campo para atualizar')
    }
    if (payload.name !== undefined) {
      if (payload.name.trim() === '') {
        throw new Error('Nome inválido.')
      }
    }
    if (payload.age !== undefined) {
      if (isNaN(payload.age) || payload.age < 0) {
        throw new Error('Idade inválida. A idade deve ser um número não negativo')
      }
    }

    if (payload.species !== undefined) {
      if (payload.species.trim() === '') {
        throw new Error('Espécie inválida')
      }
    }
    if (payload.size !== undefined) {
      const sizeNormalized = payload.size.toLowerCase()
      if (!validSizes.includes(sizeNormalized)) {
        throw new Error(`Tamanho inválido. Tamanho válidos: small, medium, large`)
      }
      payload.size = sizeNormalized
    }
    if (payload.status !== undefined) {
      const statusNormalized = payload.status.toLowerCase()
      if (!validStatuses.includes(statusNormalized)) {
        throw new Error(`Status inválido. Status válidos: available, adopted`)
      }
      payload.status = statusNormalized
    }
    if (payload.description !== undefined) {
      if (payload.description.trim() === '') {
        throw new Error('Descrição inválida.')
      }
    }
    return await PetsModel.update(id, payload)
  }

  static async deletePet(id) {
    const pet = await PetsModel.findById(id)
    if (!pet) {
      throw new Error('Pet não encontrado')
    }

    if (pet.status !== 'available') {
      throw new Error('Pet só pode ser removido quando estiver disponível')
    }

    return await PetsModel.delete(id)
  }
}

module.exports = PetsService
