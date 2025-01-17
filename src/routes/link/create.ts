import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { NotFoundError } from '../../errors/not-found-error';
import { prisma } from '../../lib/prisma';

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/links ',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (req) => {
      const { tripId } = req.params;
      const { url, title } = req.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) throw new NotFoundError('Trip not found');

      const link = await prisma.link.create({
        data: {
          url,
          title,
          trip_id: tripId,
        },
      });

      return {
        linkId: link.id,
      };
    }
  );
}
