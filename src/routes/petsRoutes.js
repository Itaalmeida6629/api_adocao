const PetsController = require('../controllers/petsController')

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')
const router = express.Router()

router.get('/pets/available', PetsController.getAvailablePets)

router.get('/pets', authenticateToken, authorizeRole('admin'), PetsController.getAllPets)
router.get('/pets/:id', authenticateToken, authorizeRole('admin'), PetsController.getPetById)
router.post('/pets', authenticateToken, authorizeRole('admin'), PetsController.createPet)
router.put('/pets/:id', authenticateToken, authorizeRole('admin'), PetsController.updatePet)
router.delete('/pets/:id', authenticateToken, authorizeRole('admin'), PetsController.deletePet)

module.exports = router
