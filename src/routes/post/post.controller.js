import _ from 'lodash';
import express from 'express';
import Joi from 'joi';
import models from '../../models';
import { listQuery, getPostByIdQuery } from './query';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { BadRequestError, SuccessResponse, getErrorMessages } from '../../utils/helper';
import { postUpdateSchema } from './validationSchemas';

const { Post } = models;
class PostController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createPost);
    this.router.get('/:id', this.getPostById);
    this.router.put('/:id', this.updatePost);
    this.router.delete('/deletePosts', this.deletePosts);

    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { title, pageNumber = 1, pageSize = PAGE_SIZE },
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
      const posts = await Post.findAndCountAll(query);
      return SuccessResponse(res, posts);
    } catch (e) {
      next(e);
    }
  }

  static async getPostById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`Post id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const query = getPostByIdQuery({ id });
      const post = await Post.findOne(query);
      // UserController.generatePreSignedUrl([post]);
      return SuccessResponse(res, post);
    } catch (e) {
      next(e);
    }
  }

  static async createPost(req, res, next) {
    const {
      body: postPayload,
      user: { id },
    } = req;
    try {
      const post = await Post.create({ ...postPayload, userId: id });
      const postResponse = post.toJSON();
      return SuccessResponse(res, postResponse);
    } catch (e) {
      next(e);
    }
  }

  static async updatePost(req, res, next) {
    const {
      body: postPayload,
      params: { id: postId },
    } = req;
    try {
      const result = Joi.validate(postPayload, postUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: postId,
        },
      };

      const postExists = await Post.findOne(query);
      if (postExists) {
        await Post.update(postPayload, query);
        return SuccessResponse(res, postPayload);
      }
      BadRequestError(`Post does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async deletePosts(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Post ids required`, STATUS_CODES.INVALID_INPUT);
      }

      const post = await Post.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      return SuccessResponse(res, { count: post });
    } catch (e) {
      next(e);
    }
  }
}

export default PostController;
