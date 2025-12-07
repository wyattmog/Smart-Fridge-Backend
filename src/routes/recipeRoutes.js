const express = require('express');
const router = express.Router();
const { generateRecipe } = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/generate', generateRecipe);

module.exports = router;
