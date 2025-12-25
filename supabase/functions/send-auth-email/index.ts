import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  otp: string;
  type: "signup" | "login" | "magic_link";
  fullName?: string;
}

const getEmailTemplate = (otp: string, type: string, fullName?: string) => {
  const name = fullName || "there";
  
  if (type === "signup") {
    return {
      subject: "Welcome to LuxFit AI - Verify Your Email",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid #2a2a2a; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                        <span style="font-size: 24px;">✨</span>
                      </div>
                      <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #ffffff;">
                        Welcome to <span style="background: linear-gradient(135deg, #d4af37, #f4e4bc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LuxFit</span> AI
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 20px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                        Hello ${name},
                      </p>
                      <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                        Thank you for joining LuxFit AI! Use the verification code below to complete your registration:
                      </p>
                      
                      <!-- OTP Code -->
                      <div style="background: linear-gradient(135deg, #1f1f1f 0%, #171717 100%); border: 1px solid #3a3a3a; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                        <p style="margin: 0 0 10px; color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; background: linear-gradient(135deg, #d4af37, #f4e4bc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${otp}</p>
                      </div>
                      
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                        This code will expire in 10 minutes. If you didn't create an account with LuxFit AI, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                      <p style="margin: 0; color: #555; font-size: 12px; text-align: center;">
                        © 2024 LuxFit AI. Your personal AI style assistant.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
  }
  
  return {
    subject: "Your LuxFit AI Login Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid #2a2a2a; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                      <span style="font-size: 24px;">🔐</span>
                    </div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #ffffff;">
                      Login to <span style="background: linear-gradient(135deg, #d4af37, #f4e4bc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LuxFit</span> AI
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="margin: 0 0 20px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      Hello ${name},
                    </p>
                    <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      Use the code below to log in to your LuxFit AI account:
                    </p>
                    
                    <!-- OTP Code -->
                    <div style="background: linear-gradient(135deg, #1f1f1f 0%, #171717 100%); border: 1px solid #3a3a3a; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                      <p style="margin: 0 0 10px; color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your Login Code</p>
                      <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; background: linear-gradient(135deg, #d4af37, #f4e4bc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${otp}</p>
                    </div>
                    
                    <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                      This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                    <p style="margin: 0; color: #555; font-size: 12px; text-align: center;">
                      © 2024 LuxFit AI. Your personal AI style assistant.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-auth-email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, type, fullName }: AuthEmailRequest = await req.json();
    
    console.log(`Sending ${type} email to ${email}`);
    
    const { subject, html } = getEmailTemplate(otp, type, fullName);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LuxFit AI <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });

    const emailData = await emailResponse.json();

    console.log("Email sent successfully:", emailData);

    if (!emailResponse.ok) {
      throw new Error(emailData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending email:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
