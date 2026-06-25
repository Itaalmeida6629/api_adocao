const AdoptionService = require('../services/adoptionService')

class AdoptionController {
  static async getAllAdoptions(req, res, next) {
    try {
      const adoptions = await AdoptionService.getAllAdoptions()
      return res.status(200).json(adoptions)
    } catch (err) {
      next(err)
    }
  }

  static async createAdoption(req, res, next) {
    try {
      const adoption = await AdoptionService.createAdoption(req.body, req.user)
      return res.status(201).json({ message: 'Adoção realizada com sucesso', adoption })
    } catch (err) {
      next(err)
    }
  }

  static async deleteAdoption(req, res, next) {
    try {
      const { id } = req.params
      await AdoptionService.deleteAdoption(id)
      return res.status(204).json({ message: 'Adoção deletada com sucesso' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AdoptionController
