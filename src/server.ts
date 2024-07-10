import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from './env';
import { errorHandler } from './error-handler';
import './lib/dayjs';
import { createActivity } from './routes/activity/create';
import { listActivities } from './routes/activity/list';
import { createLink } from './routes/link/create';
import { listLinks } from './routes/link/list';
import { confirmParticipant } from './routes/participant/confirm';
import { getParticipant } from './routes/participant/get';
import { listParticipants } from './routes/participant/list';
import { confirmTrip } from './routes/trip/confirm';
import { createTrip } from './routes/trip/create';
import { createTripInvite } from './routes/trip/create-invite';
import { getTrip } from './routes/trip/get';
import { updateTrip } from './routes/trip/update';

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(createTripInvite);
app.register(updateTrip);
app.register(getTrip);

app.register(confirmParticipant);
app.register(listParticipants);
app.register(getParticipant);

app.register(createActivity);
app.register(listActivities);

app.register(createLink);
app.register(listLinks);

app.listen({ port: env.PORT }).then(() => {
  console.log('SERVER RUNNING');
});
