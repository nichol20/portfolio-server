import express, { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", cors({ origin: "*" }), (req, res) => {
  return res.send("My portfolio server🥵🥶🤡");
});

app.post("/email", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message)
    return res.status(400).json({ message: "Missing information" });

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: `<${email}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: String(subject),
      text: `
        from: <${email}> 
        message:
        ${message}
      `,
    });
    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({ message: "Send successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}🥵🥶🤡`));
