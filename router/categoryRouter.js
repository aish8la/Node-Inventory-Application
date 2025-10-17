const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const categoryValidators = require('../validators/categoryFormValidators');
const { validate } = require('../validators/validationHelpers');
const { categoryOpAuth } = require('../middleware/auth');
const categoryRouter = Router();

categoryRouter.get('/', categoryController.categoryGet);
categoryRouter.get('/new',categoryController.newCategoryGet);
categoryRouter.post('/new', categoryValidators.addValidation, validate, categoryController.newCategoryPost);
categoryRouter.get('/:categoryId/edit', categoryValidators.paramValidation, validate, categoryController.editCategoryGet);
categoryRouter.post('/:categoryId/edit', categoryValidators.editValidation, validate, categoryOpAuth, categoryController.editCategoryPost);
categoryRouter.get('/:categoryId/delete', categoryValidators.paramValidation, validate, categoryController.deleteCategoryGet);
categoryRouter.post('/:categoryId/delete', categoryValidators.paramValidation, validate, categoryOpAuth, categoryController.deleteCategoryPost);

module.exports = categoryRouter;