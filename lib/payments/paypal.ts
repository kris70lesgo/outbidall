import type { CapturedPayment, Checkout, CheckoutInput, PaymentProvider } from "./provider";

export class PayPalProvider implements PaymentProvider {
  private get configured() { return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET); }
  async createCheckout(_input: CheckoutInput): Promise<Checkout> { if (!this.configured) throw new Error("PayPal is not configured."); throw new Error("PayPal checkout wiring is intentionally server-only and awaits credentials."); }
  async capturePayment(_orderId: string): Promise<CapturedPayment> { throw new Error("PayPal capture wiring awaits credentials."); }
  async verifyWebhook(_request: Request): Promise<boolean> { return false; }
}
