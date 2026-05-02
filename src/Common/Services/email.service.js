import envConfig from "../../config/env.config.js";

import { transporter } from "../Clients/email.client.js";
import { EventEmitter } from "node:events";
const fromEmail = envConfig.emails.user;
export const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${envConfig.appName}" <${fromEmail}>`, // sender address
      to,
      subject,
      html,
      attachments: attachments || [],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export const emailEvent = new EventEmitter();
 emailEvent.on("sendEmail", async ({to , subject, html}) => {
  await sendEmail({ to, subject, html });
});