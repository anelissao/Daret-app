import httpStatus from 'http-status';
import { GroupService } from '../services/GroupService.js';
import { validateCreateGroup, validateGroupId } from '../validation/group.validation.js';

export class GroupController {
  constructor() {
    this.service = new GroupService();
  }

  create = async (req, res, next) => {
    try {
      const data = validateCreateGroup(req.body);
      const group = await this.service.createGroup(req.user.id, data);
      res.status(httpStatus.CREATED).json({ group });
    } catch (e) {
      next(e);
    }
  };

  join = async (req, res, next) => {
    try {
      const groupId = validateGroupId(req.params);
      const group = await this.service.joinGroup(groupId, req.user.id);
      res.status(httpStatus.OK).json({ group });
    } catch (e) {
      next(e);
    }
  };

  contribute = async (req, res, next) => {
    try {
      const groupId = validateGroupId(req.params);
      const contribution = await this.service.contribute(groupId, req.user.id);
      res.status(httpStatus.OK).json({ contribution });
    } catch (e) {
      next(e);
    }
  };

  myGroups = async (req, res, next) => {
    try {
      const groups = await this.service.listMyGroups(req.user.id);
      res.status(httpStatus.OK).json({ groups });
    } catch (e) {
      next(e);
    }
  };

  get = async (req, res, next) => {
    try {
      const groupId = validateGroupId(req.params);
      const result = await this.service.getGroup(groupId, req.user.id);
      res.status(httpStatus.OK).json(result);
    } catch (e) {
      next(e);
    }
  };

  // Admin
  adminList = async (_req, res, next) => {
    try {
      const groups = await this.service.adminList();
      res.status(httpStatus.OK).json({ groups });
    } catch (e) {
      next(e);
    }
  };

  adminGet = async (req, res, next) => {
    try {
      const groupId = validateGroupId(req.params);
      const group = await this.service.adminGet(groupId);
      res.status(httpStatus.OK).json({ group });
    } catch (e) {
      next(e);
    }
  };
}
