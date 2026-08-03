import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

async function checkAuth() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
}

export async function POST(req: NextRequest) {
  await checkAuth();
  try {
    const { email, message } = await req.json();
    
    // In a real production app, you would integrate Resend, SendGrid, or AWS SES here.
    // Example: await resend.emails.send({ from: 'post@oneframestudios.com', to: email, subject: 'Re: Transmission', text: message });
    
    // For this environment, we will simulate the email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`[SIMULATED EMAIL SENT] To: ${email}\nMessage: ${message}`);

    return NextResponse.json({ success: true, simulated: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
