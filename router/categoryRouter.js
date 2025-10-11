const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const categoryAddEditValidation = require('../validators/categoryFormValidators');
const { validate } = require('../validators/validationHelpers');
const { categoryOpAuth } = require('../middleware/auth');
const categoryRouter = Router();

categoryRouter.get('/', categoryController.categoryGet);
categoryRouter.get('/new',categoryController.newCategoryGet);
categoryRouter.post('/new', categoryAddEditValidation, validate, categoryController.newCategoryPost);
categoryRouter.get('/:categoryId/edit', categoryController.editCategoryGet);
categoryRouter.post('/:categoryId/edit', categoryAddEditValidation, categoryOpAuth, categoryController.editCategoryPost);
categoryRouter.get('/:categoryId/delete', categoryController.deleteCategoryGet);

module.exports = categoryRouter;