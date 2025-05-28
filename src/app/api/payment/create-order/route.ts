import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Initialize Razorpay with your credentials (server-side only)
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '', // This should be stored securely on the server
});

// PayU payment data interface
interface PayUPaymentData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash?: string;
  [key: string]: string | undefined; // Allow for additional fields
}

export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'INR', 
      paymentGateway = 'razorpay',
      plan,
      userId,
      email,
      notes = {}
    } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }


    // Generate a unique order ID
    const orderId = `txn_${Date.now()}${Math.floor(Math.random() * 10000)}`;

    if (paymentGateway === 'razorpay') {
      // Create Razorpay order
      const options = {
        amount: amount, // Razorpay expects amount in smallest currency unit (paise for INR)
        currency,
        receipt: `receipt_${orderId}`,
        notes: {
          orderType: 'subscription',
          plan,
          userId,
          email,
          ...notes
        },
      };

      try {
        const order = await razorpay.orders.create(options);

        return NextResponse.json({
          success: true,
          orderId: order.id,
          currency: order.currency,
          amount: Number(order.amount) / 100, // Ensure it's a number and convert back to main currency unit
          gateway: 'razorpay',
        });
      } catch (razorpayError: any) {
        console.error("Razorpay order creation error:", razorpayError);
        return NextResponse.json({
          success: false,
          error: razorpayError.message || 'Failed to create Razorpay order'
        }, { status: 500 });
      }
    } else if (paymentGateway === 'payu') {
      // For PayU, we generate all the necessary parameters including the hash
      try {
        // Create PayU payment data
        const key = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || '';
        const salt = process.env.NEXT_PUBLIC_PAYU_SALT || '';
        
        // Get actual amount (not in paise)
        const payuAmount = (Number(amount) / 100).toString();
        
        // Default to plan name for product info
        const productinfo = plan || 'subscription';
        
        // Get user details (fallback to defaults if not provided)
        const userEmail = email || 'customer@example.com';
        const firstName = userId || 'Customer';
        const phone = '9999999999'; // Default phone number
        
        // Set up success and failure URLs
        const origin = request.headers.get('origin') || 'http://localhost:3001';
        const surl = `${origin}/payment/success`;
        const furl = `${origin}/payment/failure`;
        
        // Create the payment data object
        const paymentData: PayUPaymentData = {
          key,
          txnid: orderId,
          amount: payuAmount,
          productinfo,
          firstname: firstName,
          email: userEmail,
          phone,
          surl,
          furl,
        };
        
        // Generate hash
        // Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt)
        const udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '';
        const udf6 = '', udf7 = '', udf8 = '', udf9 = '', udf10 = '';
        
        const hashString = `${key}|${orderId}|${payuAmount}|${productinfo}|${firstName}|${userEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${salt}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        // Add hash to payment data
        paymentData.hash = hash;
        
        
        return NextResponse.json({
          success: true,
          orderId,
          currency,
          amount: payuAmount,
          gateway: 'payu',
          paymentData // Include the complete payment data for the client
        });
      } catch (payuError: any) {
        console.error("PayU order creation error:", payuError);
        return NextResponse.json({
          success: false,
          error: payuError.message || 'Failed to create PayU order'
        }, { status: 500 });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid payment gateway' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating payment order' },
      { status: 500 }
    );
  }
} 