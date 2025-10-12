const { Router } = require('express');
const materialRouter = Router();
const materialController = require('../controllers/materialController');

materialRouter.get('/', materialController.materialsGet);

module.exports = materialRouter;