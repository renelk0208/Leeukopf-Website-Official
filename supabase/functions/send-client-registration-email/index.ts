import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ClientRegistration {
  company: string;
  contact: string;
  role?: string;
  email: string;
  phone?: string;
  country: string;
  website?: string;
  instagram?: string;
  businessType: string;
  interests: string[];
  monthlyVolume?: string;
  vatEori?: string;
  billingAddress?: string;
  shippingAddress?: string;
  language?: string;
  notes?: string;
  attachments?: Array<{ filename: string; url: string }>;
  honeypot?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const registrationData: ClientRegistration = await req.json();

    // Anti-spam: reject if honeypot is filled
    if (registrationData.honeypot) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid submission",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const timestamp = new Date().toISOString();
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown";

    // Email to admin
    const adminEmailBody = `
New Client Registration Received
========================================

Company/Brand Information:
- Company/Brand Name: ${registrationData.company}
- Contact Name: ${registrationData.contact}
- Role/Title: ${registrationData.role || "Not provided"}
- Email: ${registrationData.email}
- Phone: ${registrationData.phone || "Not provided"}
- Country: ${registrationData.country}
- Website: ${registrationData.website || "Not provided"}
- Instagram: ${registrationData.instagram || "Not provided"}

Business Details:
- Business Type: ${registrationData.businessType}
- Product Interests: ${registrationData.interests.join(", ")}
- Estimated Monthly Volume: ${registrationData.monthlyVolume || "Not provided"}
- VAT/EORI: ${registrationData.vatEori || "Not provided"}
- Preferred Language: ${registrationData.language || "EN"}

Addresses:
- Billing Address: ${registrationData.billingAddress || "Not provided"}
- Shipping Address: ${registrationData.shippingAddress || "Not provided"}

Additional Information:
${registrationData.notes || "No additional notes provided"}

Attachments:
${registrationData.attachments && registrationData.attachments.length > 0 
  ? registrationData.attachments.map(a => `- ${a.filename}: ${a.url}`).join("\n")
  : "No attachments"}

Submission Details:
- Submitted at: ${timestamp}
- IP Address: ${ipAddress}

========================================
Please follow up with the client at: ${registrationData.email}
    `;

    // Auto-reply to client
    const clientEmailBody = `
Dear ${registrationData.contact},

Thank you for registering with Leeukopf Laboratories!

We have successfully received your registration for ${registrationData.company}. Our team will review your information and respond within 2 business days.

What happens next:
1. Our team will review your registration and business details
2. We will prepare a personalized proposal based on your product interests
3. A dedicated account manager will contact you to discuss next steps

If you have any urgent questions, please don't hesitate to reach out to us at info@leeukopf.com.

Best regards,
The Leeukopf Laboratories Team

GMP-Certified Manufacturing | Premium Beauty Products
www.leeukopf.com
    `;

    console.log("Client registration received:", registrationData);
    console.log("Admin email would be sent to: info@leeukopf.com");
    console.log("Subject: New Client Registration – " + registrationData.company + " (" + registrationData.country + ")");
    console.log("Admin email body:", adminEmailBody);
    console.log("\nClient auto-reply would be sent to:", registrationData.email);
    console.log("Subject: We've received your registration – Leeukopf Laboratories");
    console.log("Client email body:", clientEmailBody);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Client registration received successfully",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing client registration:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});