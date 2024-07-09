import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { setupDayjs } from './lib/dayjs';
import { createTrip } from './routes/trip/create';

setupDayjs();
const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);

app.listen({ port: 3000 }).then(() => {
  console.log('SERVER RUNNING');
});
