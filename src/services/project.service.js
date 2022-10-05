/* eslint-disable no-underscore-dangle */
const httpStatus = require('http-status');
const userService = require('./user.service');
const models = require('../models');
const ApiError = require('../utils/api-error');
const logger = require('../logger');
const { msgConsts, typeConsts: { projectUserRoles, sortBy } } = require('../utils/index');

const {
  ProjectModel,
} = models;

const getProjectByTitleAndOwnerId = async (title, ownerId) => {
  try {
    const project = await ProjectModel.findOne({
      title,
      'members.user': ownerId,
      'members.role': projectUserRoles.ADMIN,
    });
    return project;
  } catch (error) {
    logger.error('Error At => getProjectByTitleAndOwnerId', error);
    throw error;
  }
};

const createProject = async (projectBody, ownerId) => {
  try {
    const projectExists = await getProjectByTitleAndOwnerId(projectBody.title, ownerId);
    if (projectExists) {
      throw new ApiError(httpStatus.CONFLICT, msgConsts.PROJECT_EXISTS);
    }
    projectBody.members = [{ user: ownerId, role: projectUserRoles.ADMIN }];
    const projectInstance = await (await ProjectModel.create(projectBody)).populate('members.user');
    return projectInstance;
  } catch (error) {
    logger.error('Error At => createGroup', error);
    throw error;
  }
};

const checkProjectAccess = async (userId, projectId) => {
  try {
    const projectAccess = await ProjectModel.findOne({
      _id: projectId,
      'members.user': userId,
    }, { 'members.$': 1 });
    return projectAccess;
  } catch (error) {
    logger.error('Error At => projectAccess', error);
    throw new ApiError(httpStatus.BAD_REQUEST, msgConsts.PROJECT_NOT_FOUND);
  }
};

const shareProject = async (userId, projectId, email, role) => {
  try {
    const projectAccess = await checkProjectAccess(userId, projectId);
    if (!projectAccess) {
      throw new ApiError(httpStatus.NOT_FOUND, msgConsts.PROJECT_NOT_FOUND);
    }
    let user = await userService.getUserByEmail(email);
    if (!user) {
      user = await userService.createUser({ email });
    }

    if (projectAccess.members[0].role !== projectUserRoles.ADMIN) {
      throw new ApiError(httpStatus.FORBIDDEN, msgConsts.NOT_PROJECT_ADMIN);
    }
    const alreadyAdded = await ProjectModel.findOne({
      _id: projectId,
      'members.user': user._id,
    });
    if (alreadyAdded) {
      throw new ApiError(httpStatus.CONFLICT, msgConsts.USER_ALREADY_ADDED);
    }
    const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    }, { new: true }).populate('members.user');
    return updatedProject;
  } catch (error) {
    logger.error('Error At => shareProject', error);
    throw error;
  }
};

const unshareProject = async (userId, projectId, userToRemove) => {
  try {
    const projectAccess = await checkProjectAccess(userId, projectId);
    if (!projectAccess) {
      throw new ApiError(httpStatus.NOT_FOUND, msgConsts.PROJECT_NOT_FOUND);
    }

    if (userId === userToRemove) {
      throw new ApiError(httpStatus.FORBIDDEN, msgConsts.CANNOT_REMOVE_ADMIN);
    }

    if (projectAccess.members[0].role !== projectUserRoles.ADMIN) {
      throw new ApiError(httpStatus.FORBIDDEN, msgConsts.NOT_PROJECT_ADMIN);
    }

    const memberToRemove = await checkProjectAccess(userToRemove, projectId);
    if (!memberToRemove) {
      throw new ApiError(httpStatus.NOT_FOUND, msgConsts.USER_NOT_FOUND);
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, {
      $pull: {
        members: {
          user: userToRemove,
        },
      },
    }, { new: true }).populate('members.user');
    return updatedProject;
  } catch (error) {
    logger.error('Error At => removeMemberFromGroup', error);
    throw error;
  }
};

const deleteProject = async (projectId, userId) => {
  try {
    const projectAccess = await checkProjectAccess(userId, projectId);
    if (!projectAccess) {
      throw new ApiError(httpStatus.NOT_FOUND, msgConsts.PROJECT_NOT_FOUND);
    }
    if (projectAccess.members[0].role !== projectUserRoles.ADMIN) {
      throw new ApiError(httpStatus.FORBIDDEN, msgConsts.NOT_PROJECT_ADMIN);
    }
    await ProjectModel.findByIdAndDelete(projectId);
  } catch (error) {
    logger.error('Error At => deleteProject', error);
    throw error;
  }
};

const updateProject = async (projectId, userId, body) => {
  try {
    const allowedRoles = [projectUserRoles.ADMIN, projectUserRoles.EDIT];
    const projectAccess = await checkProjectAccess(userId, projectId);
    if (!projectAccess) {
      throw new ApiError(httpStatus.NOT_FOUND, msgConsts.PROJECT_NOT_FOUND);
    }
    if (!allowedRoles.includes(projectAccess.members[0].role)) {
      throw new ApiError(httpStatus.FORBIDDEN, msgConsts.NOT_PROJECT_ADMIN);
    }
    const updatedProject = await ProjectModel.findByIdAndUpdate(projectId,
      { $set: body },
      { new: true });
    return updatedProject;
  } catch (error) {
    logger.error('Error At => updateProject', error);
    throw error;
  }
};

const getProjectForUser = async userId => {
  try {
    const projects = await ProjectModel.find({ 'members.user': userId }).populate('members.user');
    return projects;
  } catch (error) {
    logger.error('Error At => getProjectDetails', error);
    throw error;
  }
};

const listAllProjects = async query => {
  try {
    const { limit, offset, type = { $ne: null } } = query;
    const [projects, count] = await Promise.all([
      ProjectModel.find({ type }).skip(offset).limit(limit).populate('members.user'),
      ProjectModel.count({ type })]);
    return { projects, count };
  } catch (error) {
    logger.error('Error At => listAllProjects', error);
    throw error;
  }
};

const listMultiUserProjects = async query => {
  try {
    const { limit, offset } = query;
    const sortByOrder = query.sortBy === sortBy.ASC ? 1 : '-1';
    const [projects, count] = await Promise.all([
      ProjectModel.find({ $expr: { $gt: [{ $size: '$members' }, 1] } }).skip(offset).limit(limit).sort({ updatedAt: sortByOrder })
        .populate('members.user'),
      ProjectModel.count({ $expr: { $gt: [{ $size: '$members' }, 1] } })]);
    return { projects, count };
  } catch (error) {
    logger.error('Error At => listMultiUserProjects', error);
    throw error;
  }
};

module.exports = {
  createProject,
  shareProject,
  unshareProject,
  deleteProject,
  updateProject,
  getProjectForUser,
  listAllProjects,
  listMultiUserProjects,
};
