import Joi from 'joi';

export const commentUpdateSchema = Joi.object()
  .keys({
    comment: Joi.string(),
  })
  .unknown(true);
