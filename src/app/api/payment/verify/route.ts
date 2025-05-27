import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId, signature, paymentGateway, status, additionalParams } = await request.json();

    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log(`Verifying ${paymentGateway} payment:`, { paymentId, orderId, status });

    if (paymentGateway === 'razorpay') {
      if (!signature) {
        return NextResponse.json(
          { error: 'Signature is required for Razorpay verification' },
          { status: 400 }
        );
      }

      // Verify Razorpay signature
      const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
      const generatedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        console.error('Invalid Razorpay signature', {
          generated: generatedSignature,
          received: signature
        });
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 400 }
        );
      }

      // If signature is valid, record the payment success in your database
      try {
        // Here you would update your database to record the successful payment
        // This is just a placeholder for the actual implementation
        console.log('Recording successful Razorpay payment:', {
          paymentId,
          orderId,
          signature,
        });

        // Return success response
        return NextResponse.json({
          success: true,
          message: 'Payment verified successfully',
          paymentId,
          orderId,
        });
      } catch (dbError: any) {
        console.error('Database error during payment recording:', dbError);
        return NextResponse.json({
          success: false,
          error: 'Failed to record payment in database',
        }, { status: 500 });
      }
    } else if (paymentGateway === 'payu') {
      // For PayU, we verify the transaction status and payment ID
      try {
        // Log all the parameters for debugging
        console.log('PayU verification details:', { paymentId, orderId, status, additionalParams });
        
        // Check if the status parameter is provided and is 'success'
        if (status && status.toLowerCase() !== 'success') {
          return NextResponse.json({
            success: false,
            error: `Payment failed with status: ${status}`,
          }, { status: 400 });
        }
        
        // Verify the payment with PayU - in a production application you would:
        // 1. Verify the hash provided by PayU
        // 2. Call PayU's verification API to confirm the transaction
        // 3. Check that the amount paid matches the expected amount
        
        // For now, we'll just assume the payment is valid if we have a payment ID and order ID
        console.log('Recording successful PayU payment:', {
          paymentId, // mihpayid from PayU
          orderId,   // txnid from PayU
          status
        });
        
        // Return success response
        return NextResponse.json({
          success: true,
          message: 'PayU payment verification processed',
          paymentId,
          orderId,
        });
      } catch (dbError: any) {
        console.error('Error during PayU payment verification:', dbError);
        return NextResponse.json({
          success: false,
          error: 'Failed to verify PayU payment',
        }, { status: 500 });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid payment gateway' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while verifying payment' },
      { status: 500 }
    );
  }
} 