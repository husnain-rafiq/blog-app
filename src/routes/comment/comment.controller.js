import _ from 'lodash';
import express from 'express';
import sequelize from 'sequelize';
import Joi from 'joi';
import models from '../../models';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { BadRequestError, SuccessResponse, getErrorMessages } from '../../utils/helper';
import { listQuery } from './query';
import { commentUpdateSchema } from './validationSchemas';

const { Op, fn, cast, col } = sequelize;

const { Comment } = models;
class CommentController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createComment);
    this.router.put('/:id', this.updateComment);
    this.router.delete('/deleteComments', this.deleteComments);

    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { title = '', pageNumber = 1, pageSize = PAGE_SIZE },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', STATUS_CODES.INVALID_INPUT);
      }

      const query = listQuery({
        title,
        pageNumber,
        pageSize,
      });
      const comments = await Comment.findAndCountAll(query);
      return SuccessResponse(res, comments);
    } catch (e) {
      next(e);
    }
  }

  static async createComment(req, res, next) {
    const {
      body: commentPayload,
      user: { id },
    } = req;

    try {
      const comment = await Comment.create({ ...commentPayload, userId: id });
      const commentResponse = comment.toJSON();
      return SuccessResponse(res, commentResponse);
    } catch (e) {
      next(e);
    }
  }

  static async deleteComments(req, res, next) {
    const {
      body: { ids = [] },
      user: { id: LoggedInId },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Delete ids required`, STATUS_CODES.INVALID_INPUT);
      }

      const comment = await Comment.findOne({
        where: {
          id: ids,
        },
      });

      if (comment.userId !== LoggedInId) {
        return BadRequestError(
          `You are not allowed to perform this action`,
          STATUS_CODES.FORBIDDEN
        );
      }

      const comments = await Comment.destroy({
        where: {
          [Op.and]: [{ id: ids }, { userId: LoggedInId }],
        },
        force: true,
      });
      return SuccessResponse(res, { count: comments });
    } catch (e) {
      next(e);
    }
  }

  static async updateComment(req, res, next) {
    const {
      body: commentPayload,
      params: { id: commentId },
      user: { id: LoggedInId },
    } = req;
    try {
      const result = Joi.validate(commentPayload, commentUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: commentId,
        },
      };

      const commenttExists = await Comment.findOne(query);

      if (commenttExists && commenttExists.userId !== LoggedInId) {
        return BadRequestError(
          `You are not allowed to perform this action`,
          STATUS_CODES.FORBIDDEN
        );
      }

      if (commenttExists) {
        await Comment.update(commentPayload, query);
        return SuccessResponse(res, commentPayload);
      }
      BadRequestError(`Comment does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }
}

export default CommentController;
