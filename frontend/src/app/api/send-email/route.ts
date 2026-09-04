import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { to, subject, body, smtpConfig } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, body)" },
        { status: 400 }
      );
    }

    if (!smtpConfig || !smtpConfig.host || !smtpConfig.port || !smtpConfig.user || !smtpConfig.pass) {
      return NextResponse.json(
        { error: "SMTP Outgoing Mail Server has not been configured in Settings. Please configure it to send real emails." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: Number(smtpConfig.port),
      secure: smtpConfig.secure ?? (Number(smtpConfig.port) === 465),
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"ScoutVision" <${smtpConfig.user}>`,
      to,
      subject,
      text: body
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (err: any) {
    console.error("Nodemailer Error: ", err);
    return NextResponse.json(
      { error: err.message || "Failed to dispatch email via SMTP server." },
      { status: 500 }
    );
  }
}
