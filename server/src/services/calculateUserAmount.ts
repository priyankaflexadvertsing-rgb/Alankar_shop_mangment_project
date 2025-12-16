import PaymentDetailsModel from "../models/payment.model.js";
import { flexPrint } from "./flexprint.js";

class PaymentsService {
  static async calculateUserAmount({
    printing,
    rate,
  }: {
    printing: any;
    rate: any;
  }) {
    const paymentData = flexPrint(printing, rate);

    // ✅ Save payment separately
    const payment = await PaymentDetailsModel.create(paymentData);

    return payment; // returns full document with _id
  }
}

export default PaymentsService;
