import nodemailer from 'nodemailer';
import env from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass
  }
});

export const sendMail = async (options: { to: string; subject: string; html: string }) => {
  if (!env.smtp.user || !env.smtp.pass) {
    console.warn('SMTP credentials missing, skipping email send');
    return;
  }
  await transporter.sendMail({
    from: `Marketplace <${env.smtp.user}>`,
    ...options
  });
};

