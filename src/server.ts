import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/trip/confirm';
import { createTrip } from './routes/trip/create';
import './lib/dayjs';

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);

app.listen({ port: 3000 }).then(() => {
  console.log('SERVER RUNNING');
});
