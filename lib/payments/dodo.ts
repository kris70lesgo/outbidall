import "server-only";
import DodoPayments from "dodopayments";

type CheckoutInput = {
  amountCents: number;
  paymentRecordId: string;
  returnUrl: string;
  cancelUrl: string;
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

export function dodoClient() {
  return new DodoPayments({
    bearerToken: required("DODO_PAYMENTS_API_KEY"),
    webhookKey: required("DODO_PAYMENTS_WEBHOOK_KEY"),
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
  });
}

export async function validateDodoProductAmount(amountCents: number) {
  const productId = required("DODO_CONTRIBUTION_PRODUCT_ID");
  const client = dodoClient();
  const product = await client.products.retrieve(productId);

  if (product.is_recurring || product.price.type !== "one_time_price" || !product.price.pay_what_you_want) {
    throw new Error("The Dodo product must be a one-time USD Pay What You Want product before bids can be collected.");
  }

  if (product.price.currency !== "USD" || amountCents < product.price.price) {
    throw new Error("The bid does not meet the configured Dodo product minimum.");
  }
}

export async function createDodoCheckout(input: CheckoutInput) {
  const productId = required("DODO_CONTRIBUTION_PRODUCT_ID");
  const client = dodoClient();
  await validateDodoProductAmount(input.amountCents);

  const session = await client.checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1, amount: input.amountCents }],
    cancel_url: input.cancelUrl,
    return_url: input.returnUrl,
    billing_currency: "USD",
    customization: { theme: "dark" },
    feature_flags: { allow_currency_selection: false, allow_discount_code: false },
    metadata: { outbidall_payment_id: input.paymentRecordId },
  });

  if (!session.checkout_url) throw new Error("Dodo did not return a checkout URL.");
  return { checkoutUrl: session.checkout_url, sessionId: session.session_id };
}

export type DodoPaymentEvent = {
  paymentId: string;
  amountCents: number;
  currency: string;
  payerEmail: string | null;
  paymentRecordId: string | null;
  metadata: Record<string, string>;
};

export function unwrapDodoWebhook(rawBody: string, headers: Headers): { type: string; payment: DodoPaymentEvent | null } {
  const event = dodoClient().webhooks.unwrap(rawBody, {
    headers: {
      "webhook-id": headers.get("webhook-id") ?? "",
      "webhook-signature": headers.get("webhook-signature") ?? "",
      "webhook-timestamp": headers.get("webhook-timestamp") ?? "",
    },
  });
  if (event.type !== "payment.succeeded" && event.type !== "payment.failed" && event.type !== "payment.cancelled") return { type: event.type, payment: null };
  const payment = event.data as { payment_id: string; total_amount: number; currency: string; customer?: { email?: string | null }; metadata?: Record<string, string> };
  const metadata = payment.metadata ?? {};
  return { type: event.type, payment: { paymentId: payment.payment_id, amountCents: payment.total_amount, currency: payment.currency, payerEmail: payment.customer?.email ?? null, paymentRecordId: metadata.outbidall_payment_id ?? null, metadata } };
}
