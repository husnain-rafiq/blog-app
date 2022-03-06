import Joi from 'joi';

export const postUpdateSchema = Joi.object()
  .keys({
    title: Joi.string(),
    description: Joi.string().min(2).max(100),
  })
  .unknown(true);
