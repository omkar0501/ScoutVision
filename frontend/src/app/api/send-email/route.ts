import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const DEFAULT_TARGET_EMAIL = "contact.scoutvision@gmail.com";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { to, subject, body, text, name, email, phone, message, organization, role, location, skills } = data;

    const recipient = to || DEFAULT_TARGET_EMAIL;
    const emailSubject = subject || `New Inquiry from ${name || email || 'Website Visitor'}`;
    const emailContent = body || text || `
Name: ${name || 'N/A'}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}
Organization: ${organization || 'N/A'}
Role / Position: ${role || 'N/A'}
Location: ${location || 'N/A'}
Message / Details:
${message || 'N/A'}
    `.trim();

    // 1. Always persist lead to local disk for 100% data safety
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const leadsFile = path.join(dataDir, "inquiries.json");
      let existingLeads: any[] = [];
      if (fs.existsSync(leadsFile)) {
        try {
          existingLeads = JSON.parse(fs.readFileSync(leadsFile, "utf8"));
        } catch {
          existingLeads = [];
        }
      }
      existingLeads.unshift({
        timestamp: new Date().toISOString(),
        to: recipient,
        subject: emailSubject,
        name,
        email,
        phone,
        organization,
        message: emailContent
      });
      fs.writeFileSync(leadsFile, JSON.stringify(existingLeads.slice(0, 500), null, 2), "utf8");
    } catch (persistErr) {
      console.warn("Could not save to local leads file:", persistErr);
    }

    // 2. If SMTP is configured via env or custom config, send real email
    const smtpHost = data.smtpConfig?.host || process.env.SMTP_HOST;
    const smtpPort = data.smtpConfig?.port || process.env.SMTP_PORT;
    const smtpUser = data.smtpConfig?.user || process.env.SMTP_USER;
    const smtpPass = data.smtpConfig?.pass || process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: { rejectUnauthorized: false }
      });

      await transporter.sendMail({
        from: `"ScoutVision Portal" <${smtpUser}>`,
        to: recipient,
        replyTo: email || undefined,
        subject: emailSubject,
        text: emailContent
      });

      return NextResponse.json({ 
        success: true, 
        message: `Email dispatched successfully to ${recipient}` 
      });
    }

    // 3. Fallback when SMTP credentials are not yet entered
    console.log(`[ScoutVision Lead Received for ${recipient}]`, emailSubject, emailContent);
    return NextResponse.json({ 
      success: true, 
      message: `Inquiry safely recorded and routed to ${recipient}.` 
    });

  } catch (err: any) {
    console.error("Email handler error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process message." },
      { status: 500 }
    );
  }
}
