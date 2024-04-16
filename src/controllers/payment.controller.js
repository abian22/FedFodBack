const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function payment (req, res) {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur", 
            product_data: {
              name: "Donation",
            },
            unit_amount: amount, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173",
      cancel_url: "http://localhost:5173",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error al crear la sesión de checkout:", error);
    res.status(500).json({ error: "Error al crear la sesión de checkout" });
  }
}

module.exports = {
    payment,
  };
  
