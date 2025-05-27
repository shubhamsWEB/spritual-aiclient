import Razorpay from 'razorpay';
import * as PayU from 'payu-sdk';
import api from './api';

// Payment types
export interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId: string;
  email: string;
  contact: string;
  successCallback: (paymentId: string, orderId: string, signature?: string) => void;
  failureCallback: (error: any) => void;
  isIndia?: boolean; // Optional parameter to specify location
}

// Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    key_secret: 'RAZORPAY_KEY_SECRET', // This should be used only on server-side
  });
};

// PayU configuration
const getPayUConfig = () => {
  return {
    merchantKey: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || '',
    salt: process.env.NEXT_PUBLIC_PAYU_SALT || '',
    authHeader: process.env.NEXT_PUBLIC_PAYU_AUTH_HEADER || '',
  };
};

/**
 * Initialize a payment based on user's location
 * - For Indian users: Use PayU
 * - For others: Use Razorpay
 */
export const initializePayment = async (options: PaymentOptions) => {
  // Use isIndia from options if provided, otherwise default to false
  const isIndia = options.isIndia !== undefined ? options.isIndia : false;
  
  if (isIndia) {
    return initializePayUPayment(options);
  } else {
    return initializeRazorpayPayment(options);
  }
};

/**
 * Initialize Razorpay payment
 */
const initializeRazorpayPayment = (options: PaymentOptions) => {
  const {
    amount,
    currency,
    name,
    description,
    orderId,
    email,
    contact,
    successCallback,
    failureCallback
  } = options;

  const rzp = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100, // Razorpay takes amount in paise
    currency,
    name,
    description,
    order_id: orderId,
    handler: function (response: any) {
      successCallback(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
    prefill: {
      email,
      contact,
    },
    modal: {
      ondismiss: function () {
        failureCallback({ error: 'Payment window closed' });
      },
    },
  });

  rzp.open();
  return rzp;
};

/**
 * Initialize PayU payment
 */
const initializePayUPayment = (options: PaymentOptions) => {
  const {
    amount,
    currency,
    name,
    description,
    orderId,
    email,
    contact,
    successCallback,
    failureCallback
  } = options;

  // Create the payment data
  const paymentData = {
    txnid: orderId, // Transaction ID
    amount: amount.toString(),
    productinfo: description,
    firstname: name.split(' ')[0],
    email,
    phone: contact,
    surl: window.location.origin + '/payment/success', // Success URL
    furl: window.location.origin + '/payment/failure', // Failure URL
  };
  
  // Get hash from server - this should be implemented on your server for security
  // Here we're mocking a call to get the hash
  const getHashFromServer = async (data: any) => {
    try {
      const response = await api.post('/payment/hash', data);
      return response.data.hash;
    } catch (error) {
      console.error('Error getting hash:', error);
      failureCallback(error);
      return null;
    }
  };

  const initializePayment = async () => {
    try {
      const hash = await getHashFromServer({
        ...paymentData,
        key: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY,
      });

      if (!hash) {
        throw new Error('Could not generate payment hash');
      }

      // Create the form to submit to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.payu.in/_payment'; // Production URL

      // Add input fields
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField('key', process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || '');
      addField('hash', hash);
      addField('txnid', paymentData.txnid);
      addField('amount', paymentData.amount);
      addField('productinfo', paymentData.productinfo);
      addField('firstname', paymentData.firstname);
      addField('email', paymentData.email);
      addField('phone', paymentData.phone);
      addField('surl', paymentData.surl);
      addField('furl', paymentData.furl);

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('PayU payment error:', error);
      failureCallback(error);
    }
  };

  // Start the payment process
  initializePayment();
  
  // Return null since PayU doesn't provide an instance like Razorpay
  return null;
};

/**
 * Create a server-side payment order
 * @param amount - Amount to pay
 * @param currency - Currency code (INR, USD, etc.)
 * @param isIndia - Whether the user is from India
 * @returns Order details from the server
 */
export const createPaymentOrder = async (amount: number, currency: string = 'INR', isIndia?: boolean) => {
  try {
    const paymentGateway = isIndia ? 'payu' : 'razorpay';
    
    const response = await api.post('/payment/create-order', {
      amount,
      currency,
      paymentGateway
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

/**
 * Verify payment after completion
 * @param paymentId - Payment ID from gateway
 * @param orderId - Order ID
 * @param signature - Payment signature (for Razorpay)
 * @param paymentGateway - 'razorpay' or 'payu'
 * @param isIndia - Whether the user is from India
 * @returns Verification result from server
 */
export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature?: string,
  paymentGateway?: string,
  isIndia?: boolean
) => {
  try {
    if (!paymentGateway && isIndia !== undefined) {
      paymentGateway = isIndia ? 'payu' : 'razorpay';
    }
    
    const response = await api.post('/payment/verify', {
      paymentId,
      orderId,
      signature,
      paymentGateway
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 