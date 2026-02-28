import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
})

console.log("email and password: ", process.env.EMAIL, process.env.EMAIL_PASSWORD)


export const sendWellcomeEmail = async (toEmail, name) => {
    try {
        const info = await transporter.sendMail({
            from:  `"Sport Zone" <${process.env.EMAIL}>`,
            to: toEmail,
            subject: "Welcome to Our Sport Zone App",
            html: ` <!DOCTYPE html>
                    <html lang="sq">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Mirësevjen në Sport Zone</title>
                    </head>
                    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:20px 0;">
                        <tr>
                            <td align="center">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                                
                                <!-- Header -->
                                <tr>
                                <td align="center" style="background:linear-gradient(135deg,#2563eb,#16a34a); padding:24px 16px;">
                                    <h1 style="margin:0; font-size:26px; color:#ffffff; letter-spacing:1px;">
                                    Sport Zone
                                    </h1>
                                    <p style="margin:8px 0 0; color:#e5e7eb; font-size:14px;">
                                    Rezervo sallat e lojës shpejt dhe lehtë
                                    </p>
                                </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                <td style="padding:24px 24px 16px;">
                                    <h2 style="margin:0 0 12px; font-size:20px; color:#111827;">
                                    Përshendetje, ${name}! 👋
                                    </h2>
                                    <p style="margin:0 0 12px; font-size:14px; color:#4b5563; line-height:1.6;">
                                    Mirësevjen në <strong>Sport Zone</strong> – aplikacioni yt për rezervimin e 
                                    <strong>sallave të lojës</strong>, futsall, basketboll, volejboll dhe më shumë.
                                    </p>
                                    <p style="margin:0 0 12px; font-size:14px; color:#4b5563; line-height:1.6;">
                                    Nga tani mund të:
                                    </p>
                                    <ul style="margin:0 0 16px 18px; padding:0; font-size:14px; color:#4b5563; line-height:1.6;">
                                    <li>Shikosh sallat e lira në kohë reale</li>
                                    <li>Rezervosh orare brenda pak klikimeve</li>
                                    <li>Menaxhosh rezervimet e tua në një vend</li>
                                    </ul>
                                    <p style="margin:0 0 16px; font-size:14px; color:#4b5563; line-height:1.6;">
                                    Fillo tani me rezervimin e sallës tënde të preferuar dhe organizo lojën me shoqërinë pa stres.
                                    </p>

                                    <!-- Button -->
                                    <div style="text-align:center; margin:24px 0 8px;">
                                    <a 
                                        href="https://sport-zone.example.com" 
                                        style="
                                        display:inline-block;
                                        padding:12px 28px;
                                        background:linear-gradient(135deg,#2563eb,#16a34a);
                                        color:#ffffff;
                                        text-decoration:none;
                                        border-radius:999px;
                                        font-size:14px;
                                        font-weight:bold;
                                        "
                                    >
                                        Rezervo sallën e lojës
                                    </a>
                                    </div>

                                    <p style="margin:0 0 8px; font-size:12px; color:#9ca3af; text-align:center;">
                                    Nëse butoni nuk funksionon, vizito: 
                                    <span style="color:#2563eb;">https://sport-zone.example.com</span>
                                    </p>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td style="padding:16px 24px 24px; border-top:1px solid #e5e7eb;">
                                    <p style="margin:0 0 4px; font-size:12px; color:#9ca3af;">
                                    Sport Zone &mdash; Sallat e lojës gjithmonë në dispozicion.
                                    </p>
                                    <p style="margin:0; font-size:11px; color:#9ca3af;">
                                    Nëse nuk e ke krijuar ti këtë llogari, mund ta injorosh këtë email.
                                    </p>
                                </td>
                                </tr>

                            </table>
                            </td>
                        </tr>
                        </table>
                    </body>
                    </html>
                    `

        });

    console.log("wellcome email send: ", info.messageId);

    } catch (error) {
        console.log(error, "error");
        throw error;
    }
}

export const sendBookingEmail = async (toEmail, name, fieldName, startDate, endDate, totalPrice) => {
    try {
        // Accept either Date objects or numeric timestamps (seconds)
        const makeDate = (d) => {
            if (!d) return null;
            if (d instanceof Date) return d;
            if (typeof d === "number") return new Date(d instanceof Number ? d * 1000 : d * 1000);
            return new Date(d);
        };

        const start = makeDate(startDate);
        const end = makeDate(endDate);

        const fmt = (d) =>
            d ? d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

        const info = await transporter.sendMail({
            from: `"Sport Zone" <${process.env.EMAIL}>`,
            to: toEmail,
            subject: "Your Booking is Confirmed!",
            html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8"/>
                  <meta name="viewport" content="width=device-width,initial-scale=1"/>
                  <title>Booking Confirmed</title>
                </head>
                <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:20px 0;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                          
                          <tr>
                            <td align="center" style="background:linear-gradient(135deg,#2563eb,#16a34a);padding:24px 16px;">
                              <h1 style="margin:0;font-size:24px;color:#fff;">Sport Zone</h1>
                              <p style="margin:6px 0 0;color:#e5e7eb;font-size:13px;">Booking Confirmation</p>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:20px 24px;">
                              <h2 style="margin:0 0 12px;font-size:18px;color:#111827;">Hello ${name},</h2>
                              <p style="margin:0 0 12px;font-size:14px;color:#4b5563;line-height:1.6;">
                                Your booking has been confirmed. Below are the details:
                              </p>

                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 18px;">
                                <tr>
                                  <td style="padding:8px 0;color:#374151;font-weight:600;width:40%;">Field</td>
                                  <td style="padding:8px 0;color:#374151;">${fieldName}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px 0;color:#374151;font-weight:600;">Start</td>
                                  <td style="padding:8px 0;color:#374151;">${fmt(start)}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px 0;color:#374151;font-weight:600;">End</td>
                                  <td style="padding:8px 0;color:#374151;">${fmt(end)}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px 0;color:#374151;font-weight:600;">Total Price</td>
                                  <td style="padding:8px 0;color:#374151;">${typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice} EUR</td>
                                </tr>
                              </table>

                              <div style="text-align:center;margin:18px 0;">
                                <a href="https://sport-zone.example.com/my-bookings" style="display:inline-block;padding:12px 26px;background:linear-gradient(135deg,#2563eb,#16a34a);color:#fff;text-decoration:none;border-radius:999px;font-weight:600;">
                                  View My Bookings
                                </a>
                              </div>

                              <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;">
                                If you did not make this booking, please contact our support immediately.
                              </p>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;">
                              <p style="margin:0;font-size:12px;color:#9ca3af;">Sport Zone — Bookings made simple.</p>
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>`,
            text: `Hello ${name}, your booking for ${fieldName} is confirmed. Start: ${fmt(start)}, End: ${fmt(end)}, Total: ${typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice} EUR`
        });

        console.log("booking email sent:", info.messageId);
    } catch (error) {
        console.log(error, "error");
        throw error;
    }
};