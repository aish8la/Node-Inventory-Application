const { Router } = require('express');
const materialRouter = Router();
const materialController = require('../controllers/materialController');
const materialValidators = require('../validators/materialFormValidators');
const { validate } = require('../validators/validationHelpers');

materialRouter.get('/', materialController.materialsGet);
materialRouter.get('/new', materialController.newMaterialGet);
materialRouter.post('/new', materialValidators.addValidation, validate, materialController.newMaterialPost);
materialRouter.get('/:materialId/edit', materialController.editMaterialGet);

module.exports = materialRouter;