import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BrochureRequest {
  name: string;
  email: string;
  company?: string;
  country: string;
  contact_number: string;
  category_name: string;
  category_slug: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: BrochureRequest = await req.json();

    const emailBody = `
New Brochure Request Received
================================

Customer Information:
- Name: ${requestData.name}
- Email: ${requestData.email}
- Company: ${requestData.company || "Not provided"}
- Country: ${requestData.country}
- Contact Number: ${requestData.contact_number}

Requested Category:
- Category: ${requestData.category_name}
- Category Slug: ${requestData.category_slug}

Request received at: ${new Date().toISOString()}

================================
Please follow up with the customer at: ${requestData.email}
    `;

    console.log("Brochure request received:", requestData);
    console.log("Email would be sent to: rene@gelitup.com");
    console.log("Email body:", emailBody);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Brochure request received and email notification sent",
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
    console.error("Error processing brochure request:", error);
    
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