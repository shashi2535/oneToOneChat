import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const mesageValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validateMessage = (user) => {
    const JoiSchema = Joi.object({
      message: Joi.string().required(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateMessage(req.body);
  if (response.error) {
    console.log(req.body);

    const msg = response.error.details[0].message;
    return res
      .status(422)
      .json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, '') });
  }
  next();
  return true;
};
