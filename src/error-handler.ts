import { FastifyInstance } from 'fastify';
import { ClientError } from './errors/client-error';
import { ZodError } from 'zod';
import { NotFoundError } from './errors/not-found-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .send({ message: error.message, errors: error.flatten().fieldErrors });
  }
  if (error instanceof ClientError) {
    return res.status(400).send({ message: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send({ message: error.message });
  }
  return res.status(500).send({ message: 'Internal server error' });
};
