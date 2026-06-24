const PetsService = require('../services/petsService')

class PetsController {
  static async getAvailablePets(req, res, next) {
    try {
      const pets = await PetsService.getAvailablePets()
      return res.status(200).json(pets)
    } catch (err) {
      next(err)
    }
  }

  static async getAllPets(req, res, next) {
    try {
      const pets = await PetsService.getAllPets()
      return res.status(200).json(pets)
    } catch (err) {
      next(err)
    }
  }

  static async getPetById(req, res, next) {
    try {
      const { id } = req.params
      const pet = await PetsService.getPetById(id)
      return res.status(200).json(pet)
    } catch (err) {
      next(err)
    }
  }

  static async createPet(req, res, next) {
    try {
      const pet = await PetsService.createPet(req.body)
      return res.status(201).json({ message: 'Pet criado com sucesso', pet })
    } catch (err) {
      next(err)
    }
  }

  static async updatePet(req, res, next) {
    try {
      const { id } = req.params
      await PetsService.updatePet(id, req.body)
      return res.status(200).json({ message: 'Pet atualizado com sucesso' })
    } catch (err) {
      next(err)
    }
  }

  static async deletePet(req, res, next) {
    try {
      const { id } = req.params
      await PetsService.deletePet(id)
      return res.status(204).json({ message: 'Pet deletado com sucesso' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = PetsController
