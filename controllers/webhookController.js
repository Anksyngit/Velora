import User from "../models/user.js";

export const clerkWebhook = async (req, res) => {
  try {
    const body = JSON.parse(req.body.toString());

    const { type, data } = body;

    console.log("Webhook event:", type);

    if (type === "user.created") {
      await User.create({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        full_name: `${data.first_name || ""} ${data.last_name || ""}`,
        username:
          data.username ||
          data.email_addresses[0].email_address.split("@")[0],
      });

      console.log("✅ User stored in DB");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("❌ Webhook Error:", error);
    res.status(500).json({ error: "Webhook failed" });
  }
};