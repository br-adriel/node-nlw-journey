import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { NotFoundError } from '../../errors/not-found-error';
import { prisma } from '../../lib/prisma';

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/trips/:tripId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
        }),
      },
    },
    async (req) => {
      const { starts_at, ends_at, destination } = req.body;
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) throw new NotFoundError('Trip not found');

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError('Invalid trip start date');
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError('Invalid trip end date');
      }

      await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          destination,
          ends_at,
          starts_at,
        },
      });

      return {
        tripId: trip.id,
      };
    }
  );
}
