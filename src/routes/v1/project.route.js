const express = require('express');
const validate = require('../../middlewares/validate');
const authMiddleware = require('../../middlewares/auth');
const { projectValidations } = require('../../utils/validations');
const projectController = require('../../controllers/project.controller');

const router = express.Router();

router.get('/', authMiddleware(), validate(projectValidations.listProjects), projectController.getAllProjects);

router.post('/', authMiddleware(), validate(projectValidations.createProject), projectController.createProject);

router.get('/user/:userId', authMiddleware(), validate(projectValidations.listUserProjects), projectController.getUserProjects);

router.patch('/:projectId', authMiddleware(), validate(projectValidations.updateProject), projectController.updateProject);

router.delete('/:projectId', authMiddleware(), validate(projectValidations.deleteProject), projectController.deleteProject);

router.get('/multi-user', authMiddleware(), validate(projectValidations.listProjects), projectController.getMultiUserProjects);

router.patch('/share/:projectId', authMiddleware(), validate(projectValidations.shareProject), projectController.shareProject);

router.delete('/unshare/:projectId', authMiddleware(), validate(projectValidations.unshareProject), projectController.unshareProject);

module.exports = router;
