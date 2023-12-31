const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "https://buddy-masri.github.io",
  credentials: true,
};
const bodyparser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors(corsOptions));

const stripe = require("stripe")(
  "sk_test_51OEH94FzdGfXZ9Dk7PJMqu6VIaaCKHCoyuSGXzgpl7KbZfwgpWjaeFjR0ZSxwr7JDYZeNmZ3zJvs9cd8x6GPzcby007ff9Lkmi"
);

app.post("/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "https://node-server-c9am.onrender.com/success.html",
      cancel_url: "https://node-server-c9am.onrender.com/cancel.html",
    });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

app.listen(4242, () => console.log("app is running on 4242"));
