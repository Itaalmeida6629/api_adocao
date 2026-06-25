const AdoptionModel = require('../models/adoptionModel')
const PetsModel = require('../models/petModel')

class AdoptionService {
  static async getAllAdoptions() {
    const adoptions = await AdoptionModel.findAll()
    if (adoptions.length === 0) {
      throw new Error('Nenhuma adoção encontrada')
    }
    return adoptions
  }

  static async createAdoption(data, usuarioLogado) {
    if (usuarioLogado.role !== 'adopter') {
      throw new Error('Acesso negado: apenas adotantes podem adotar pets')
    }

    const camposObrigatorios = ['pet_id']

    for (const campo of camposObrigatorios) {
      if (!data[campo]) {
        throw new Error(`${campo} é obrigatório`)
      }
    }

    if (isNaN(data.pet_id) || data.pet_id <= 0) {
      throw new Error('Pet inválido')
    }

    const pet = await PetsModel.findById(data.pet_id)
    if (!pet) {
      throw new Error('Pet não encontrado')
    }

    const existingAdoption = await AdoptionModel.findByUserAndPet(usuarioLogado.userId, data.pet_id)
    if (existingAdoption) {
      throw new Error('O usuário já adotou este pet anteriormente')
    }

    if (pet.status !== 'available') {
      throw new Error('Pet não está disponível para adoção')
    }

    const newAdoption = { ...data, user_id: usuarioLogado.userId }
    const adoption = await AdoptionModel.create(newAdoption)
    await PetsModel.update(data.pet_id, { status: 'adopted' })
    return adoption
  }

  static async deleteAdoption(id) {
    const adoption = await AdoptionModel.findById(id)
    if (!adoption) {
      throw new Error('Adoção não encontrada')
    }

    await PetsModel.update(adoption.pet_id, { status: 'available' })
    return await AdoptionModel.delete(id)
  }
}

module.exports = AdoptionService
