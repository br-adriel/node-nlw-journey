import fastify from 'fastify';
import { createTrip } from './routes/trip/create';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);

app.listen({ port: 3000 }).then(() => {
  console.log('SERVER RUNNING');
});
