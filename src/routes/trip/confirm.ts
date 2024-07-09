import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from '../../lib/nodemailer';
import { prisma } from '../../lib/prisma';

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/confirm',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, res) => {
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });
      if (!trip) {
        throw new Error('Trip not found');
      }

      if (trip.is_confirmed) {
        return res.redirect(`http://localhost:5173/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      const formattedStartDate = dayjs(trip.starts_at).format('D[ de ]MMMM');
      const formattedEndDate = dayjs(trip.ends_at).format('D[ de ]MMMM');

      const confirmationLink = `http://localhost:3000/trips/${trip.id}/confirm/`;
      const mail = await getMailClient();

      Promise.all(
        trip.participants.map(async (p) => {
          const link = confirmationLink + p.id;
          const message = await mail.sendMail({
            from: {
              name: 'Equipe plann.er',
              address: 'equipe@plann.er',
            },
            to: p.email,
            subject: `Confirme sua viagem para ${trip.destination}`,
            html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${link}">Confirmar viagem</a>
              </p>
              <p></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
            `.trim(),
          });
          console.log(nodemailer.getTestMessageUrl(message));
        })
      );

      return res.redirect(`http://localhost:5173/trips/${tripId}`);
    }
  );
}
