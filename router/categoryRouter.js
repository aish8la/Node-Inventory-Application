const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const categoryRouter = Router();

categoryRouter.get('/', categoryController.categoryGet);
categoryRouter.get('/new',categoryController.newCategoryGet);
categoryRouter.post('/new',categoryController.newCategoryPost);

module.exports = categoryRouter;