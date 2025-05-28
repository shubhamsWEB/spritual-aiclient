'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentButton from '@/components/PaymentButton';

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: 1000, // Default amount (₹1000)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    });
  };

  const handlePaymentSuccess = (data: any) => {
    // Navigate to a success page or order confirmation
    router.push('/payment/success?paymentId=' + data.paymentId + '&orderId=' + data.orderId);
  };

  const handlePaymentFailure = (error: any) => {
    // Navigate to a failure page
    router.push('/payment/failure?error=' + encodeURIComponent(error.message || 'Payment failed'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              step="1"
              required
            />
          </div>
        </div>
        
        <div className="mt-8">
          <PaymentButton
            amount={formData.amount}
            productName="Product Purchase"
            description="Payment for products"
            email={formData.email}
            contact={formData.phone}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
            buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md py-3 px-4"
          />
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            You will be redirected to the payment gateway based on your location:
          </p>
          <ul className="mt-2 list-disc list-inside">
            <li>Indian users: PayU payment gateway</li>
            <li>Other users: Razorpay payment gateway</li>
          </ul>
        </div>
      </div>
    </div>
  );
}