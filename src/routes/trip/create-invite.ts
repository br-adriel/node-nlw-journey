import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { env } from '../../env';
import { NotFoundError } from '../../errors/not-found-error';
import { getMailClient } from '../../lib/nodemailer';
import { prisma } from '../../lib/prisma';

export async function createTripInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/invites ',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (req) => {
      const { tripId } = req.params;
      const { email } = req.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) throw new NotFoundError('Trip not found');

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format('D[ de ]MMMM');
      const formattedEndDate = dayjs(trip.ends_at).format('D[ de ]MMMM');

      const mail = await getMailClient();

      const confirmationLink = `${env.API_BASE_URL}/participants/${trip.id}/confirm/`;
      const message = await mail.sendMail({
        from: {
          name: 'Equipe plann.er',
          address: 'equipe@plann.er',
        },
        to: participant.email,
        subject: `Confirme sua viagem para ${trip.destination}`,
        html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
            <p></p>
            <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
            <p></p>
            <p>
              <a href="${confirmationLink}">Confirmar viagem</a>
            </p>
            <p></p>
            <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
          </div>
          `.trim(),
      });
      console.log(nodemailer.getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}
