const AdoptionController = require('../controllers/adoptionController')

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')
const router = express.Router()

router.get('/adoptions', authenticateToken, authorizeRole('admin'), AdoptionController.getAllAdoptions)
router.post('/adoptions', authenticateToken, authorizeRole('adopter'), AdoptionController.createAdoption)
router.delete('/adoptions/:id', authenticateToken, authorizeRole('admin'), AdoptionController.deleteAdoption)

module.exports = router
