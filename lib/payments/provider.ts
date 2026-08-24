export type CheckoutInput = { listingId: string; amountCents: number; currency: "USD"; returnUrl: string; cancelUrl: string };
export type Checkout = { orderId: string; approvalUrl: string };
export type CapturedPayment = { orderId: string; captureId: string; status: "COMPLETED"; amountCents: number; currency: "USD"; payerEmail?: string };

export interface PaymentProvider { createCheckout(input: CheckoutInput): Promise<Checkout>; capturePayment(orderId: string): Promise<CapturedPayment>; verifyWebhook(request: Request): Promise<boolean>; }
