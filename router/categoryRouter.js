const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const categoryAddEditValidation = require('../validators/categoryFormValidators');
const { validate } = require('../validators/validationHelpers');
const categoryRouter = Router();

categoryRouter.get('/', categoryController.categoryGet);
categoryRouter.get('/new',categoryController.newCategoryGet);
categoryRouter.post('/new', categoryAddEditValidation, validate, categoryController.newCategoryPost);
categoryRouter.get('/:categoryId/edit', categoryController.editCategoryGet);

module.exports = categoryRouter;