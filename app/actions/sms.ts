"use server";

export async function sendSellerSMS(sellerPhone: string, productTitle: string) {
  if (!sellerPhone) return;

  // Check if the API key exists
  if (!process.env.ARKESEL_API_KEY) {
    console.log("⚠️ No ARKESEL_API_KEY found. Skipping SMS.");
    return;
  }

  // Format the phone number (e.g. 024... becomes 23324...)
  let phone = sellerPhone;
  if (phone.startsWith("0")) {
    phone = "233" + phone.slice(1);
  }

  const message = `Ghana UNI Market: A student is interested in your item "${productTitle}". Check your WhatsApp!`;

  try {
    const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "api-key": process.env.ARKESEL_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "GhanaUNI",
        message: message,
        recipients: [phone],
      }),
    });

    const data = await response.json();
    console.log("SMS API Response:", data);
  } catch (error: any) {
    console.error("Error sending SMS:", error.message);
  }
}