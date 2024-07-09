import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from '../../lib/nodemailer';
import { prisma } from '../../lib/prisma';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
        }),
      },
    },
    async (req, res) => {
      const { starts_at, ends_at, owner_name, owner_email, destination } =
        req.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error('Invalid trip start date');
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error('Invalid trip end date');
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          ends_at,
          starts_at,
          participants: {
            create: {
              email: owner_email,
              name: owner_name,
              is_owner: true,
              is_confirmed: true,
            },
          },
        },
      });

      const mail = await getMailClient();
      const message = await mail.sendMail({
        from: {
          name: 'Equipe plann.er',
          address: 'equipe@plann.er',
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: 'Testando o envio de email',
        html: '<p>Teste do envio de email</p>',
      });
      return {
        tripId: trip.id,
      };
    }
  );
}
