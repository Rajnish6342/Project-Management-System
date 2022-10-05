/* eslint-disable no-underscore-dangle */
const httpStatus = require('http-status');

const catchAsync = require('../utils/catch-async');
const projectService = require('../services/project.service');
const { generateJsonResponse } = require('../utils/response');
const { msgConsts } = require('../utils');

const createProject = catchAsync(async (req, res) => {
  const { title, description, type } = req.body;
  const projectCreateObj = {
    title,
    description,
    type,
  };
  const project = await projectService.createProject(projectCreateObj, req.user._id);
  const response = generateJsonResponse(project, httpStatus.OK, msgConsts.PROJECT_CREATED);
  return res.send(response);
});

const updateProject = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  const { projectId } = req.params;
  const projectUpdateObj = {
    title, description,
  };
  const userId = req.user._id;

  const project = await projectService.updateProject(projectId, userId, projectUpdateObj);
  const response = generateJsonResponse(project, httpStatus.OK, msgConsts.PROJECT_UPDATED);

  return res.send(response);
});

const deleteProject = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;

  await projectService.deleteProject(projectId, userId);
  const response = generateJsonResponse(null, httpStatus.OK, msgConsts.PROJECT_DELETED);

  return res.send(response);
});

const shareProject = catchAsync(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  const userId = req.user._id;

  const member = await projectService.shareProject(userId, projectId, email, role);
  const response = generateJsonResponse(member, httpStatus.OK, msgConsts.MEMBER_ADDED_SUCCESSFULLY);

  return res.send(response);
});

const unshareProject = catchAsync(async (req, res) => {
  const { userId: userToRemove } = req.body;
  const { projectId } = req.params;
  const userId = req.user.id;

  await projectService.unshareProject(userId, projectId, userToRemove);
  const response = generateJsonResponse(null, httpStatus.OK, msgConsts.MEMBER_REMOVED_SUCCESSFULLY);

  return res.send(response);
});

const getUserProjects = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const projects = await projectService.getProjectForUser(userId);

  const response = generateJsonResponse(projects, httpStatus.OK,
    msgConsts.PROJECT_FETCHED_SUCCESSFULLY);

  return res.send(response);
});

const getAllProjects = catchAsync(async ({ query }, res) => {
  const projects = await projectService.listAllProjects(query);

  const response = generateJsonResponse(projects, httpStatus.OK,
    msgConsts.PROJECT_FETCHED_SUCCESSFULLY);

  return res.send(response);
});

const getMultiUserProjects = catchAsync(async ({ query }, res) => {
  const projects = await projectService.listMultiUserProjects(query);

  const response = generateJsonResponse(projects, httpStatus.OK,
    msgConsts.PROJECT_FETCHED_SUCCESSFULLY);

  return res.send(response);
});

module.exports = {
  createProject,
  shareProject,
  unshareProject,
  updateProject,
  deleteProject,
  getUserProjects,
  getAllProjects,
  getMultiUserProjects,
};
