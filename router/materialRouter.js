const { Router } = require('express');
const materialRouter = Router();
const materialController = require('../controllers/materialController');

materialRouter.get('/', materialController.materialsGet);
materialRouter.get('/new', materialController.newMaterialGet);

module.exports = materialRouter;