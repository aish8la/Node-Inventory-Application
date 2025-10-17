const { Router } = require('express');
const materialRouter = Router();
const materialController = require('../controllers/materialController');
const materialValidators = require('../validators/materialFormValidators');
const { validate } = require('../validators/validationHelpers');
const { auth } = require('../middleware/auth');

materialRouter.get('/', materialController.materialsGet);
materialRouter.get('/new', materialController.newMaterialGet);
materialRouter.post('/new', materialValidators.addValidation, validate, auth, materialController.newMaterialPost);
materialRouter.get('/:materialId/edit', materialValidators.paramValidation, validate, materialController.editMaterialGet);
materialRouter.post('/:materialId/edit', materialValidators.editValidation, validate, auth, materialController.editMaterialPost);

module.exports = materialRouter;