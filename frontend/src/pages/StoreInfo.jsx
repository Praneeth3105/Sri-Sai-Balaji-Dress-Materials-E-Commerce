import React from "react";

const CONTENT = {
  faq: {
    label: "Help",
    title: "Frequently Asked Questions",
    intro: "Quick answers about products, payments, delivery and returns.",
    sections: [
      [
        "How can I track my order?",
        "Open My Orders from the footer, profile or order-success page. Select Track Full Order to see the live order stage and timestamps.",
      ],
      [
        "Can I choose different sizes for different colors?",
        "Yes. Each color variant can have its own images, available sizes and stock quantity.",
      ],
      [
        "What happens when a size sells out?",
        "That size becomes unavailable. The product remains visible while another color or size still has stock.",
      ],
      [
        "What happens when the complete product sells out?",
        "The product is removed from the customer catalogue and remains available to the admin in Out of Stock.",
      ],
      [
        "Can I use a coupon?",
        "Yes. Enter a valid coupon during cart or checkout. The server rechecks the coupon before creating the Razorpay order.",
      ],
    ],
  },
  shipping: {
    label: "Customer Care",
    title: "Shipping & Returns",
    intro: "Information about delivery and returning an order.",
    sections: [
      [
        "Shipping",
        "Orders are prepared after payment confirmation. The customer can follow Order Placed, Accepted, Processing, Ready for Dispatch, Dispatched, Out for Delivery and Delivered.",
      ],
      [
        "Free shipping",
        "The current checkout provides free shipping when the discounted subtotal is above ₹299; otherwise shipping is ₹10.",
      ],
      [
        "Returns",
        "Return eligibility depends on the store's return policy and product condition. Contact Customer Care before sending an item back.",
      ],
    ],
  },
  size: {
    label: "Customer Care",
    title: "Size Guide",
    intro:
      "Use the size shown for the selected color. Availability can differ between colors.",
    sections: [
      [
        "How sizes work",
        "Every color can have a different size list. A size is selectable only when that color has stock for it.",
      ],
      [
        "Custom sizes",
        "The admin can add custom size labels such as 38 / 2.5m when creating a product.",
      ],
    ],
  },
  payment: {
    label: "Customer Care",
    title: "Payment Methods",
    intro: "Secure checkout information for your order.",
    sections: [
      [
        "Razorpay",
        "Online payments are processed through Razorpay. The order is confirmed only after payment verification succeeds.",
      ],
      [
        "Payment failure",
        "If payment fails or the Razorpay window is dismissed, the order is marked failed and inventory is not reduced.",
      ],
    ],
  },
  refund: {
    label: "Customer Care",
    title: "Cancellation & Refund Policy",
    intro: "Order cancellation and refund information.",
    sections: [
      [
        "Cancellation",
        "The admin can cancel an order before the late delivery stages. Delivered orders cannot be moved back or cancelled through the admin workflow.",
      ],
      [
        "Refunds",
        "For a payment/refund issue, contact Customer Care with the order ID and payment details. Actual refund processing should be handled according to the payment provider and store policy.",
      ],
    ],
  },
  privacy: {
    label: "Legal",
    title: "Privacy Policy",
    intro: "How customer account and order information is used.",
    sections: [
      [
        "Information",
        "The store uses account, contact, delivery and order information to provide ecommerce services, payment processing and customer support.",
      ],
      [
        "Security",
        "Keep your password and account access information private. Payment card information is handled by the payment provider rather than stored as raw card data by the store.",
      ],
    ],
  },
  terms: {
    label: "Legal",
    title: "Terms & Conditions",
    intro:
      "General terms for using the Sri Sai Balaji Dress Materials website.",
    sections: [
      [
        "Orders",
        "An order is placed after successful payment verification. Product availability is subject to the stock recorded by the store.",
      ],
      [
        "Product information",
        "Colors can look different depending on the customer's screen. The available sizes, colors and stock shown on the product page are the current catalogue information.",
      ],
    ],
  },
};

const StoreInfo = ({ type }) => {
  const content = CONTENT[type] || CONTENT.faq;
  return (
    <main className="min-h-screen bg-[#f8f4ee] pt-28 pb-20 text-[#3d3028]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
            {content.label}
          </p>
          <h1 className="font-[Cormorant_Garamond] text-5xl sm:text-6xl text-[#382b24] mt-2">
            {content.title}
          </h1>
          <div className="w-12 h-px bg-[#b99a6b] mx-auto mt-5" />
          <p className="text-sm text-[#7b6d64] max-w-2xl mx-auto mt-5 leading-7">
            {content.intro}
          </p>
        </div>
        <div className="space-y-4">
          {content.sections.map(([title, body]) => (
            <section
              key={title}
              className="bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl p-6 sm:p-7"
            >
              <h2 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                {title}
              </h2>
              <p className="text-sm text-[#75675e] leading-7 mt-3">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default StoreInfo;
