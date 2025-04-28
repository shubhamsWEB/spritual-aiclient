'use client'
import React from 'react';
import Link from 'next/link';
import ChatNowButton from '../common/ChatNowButton';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import CurrencyToggle from '../common/CurrencyToggle';

interface PricingPlan {
  name: string;
  priceUSD: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  plan?: string;
  strickoffUSD?: number;
  highlighted: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    priceUSD: 0,
    period: "forever",
    description: "Begin your spiritual journey with basic guidance from the Bhagavad Gita.",
    features: [
      "10 messages per day",
      "Basic Gita wisdom",
      "Mobile app access",
      "Access to PDF viewer"
    ],
    buttonText: "Start Free",
    buttonLink: "/chat",
    highlighted: false
  },
  {
    name: "Devotee",
    priceUSD: 4.99,
    strickoffUSD: 9.99,
    period: "per month",
    description: "Deepen your spiritual practice with comprehensive Gita teachings.",
    features: [
      "Unlimited messages",
      "Advanced spiritual insights",
      "Personalized guidance",
      "Verse references & explanations",
      "Priority support"
    ],
    buttonText: "Become a Devotee",
    plan: "devotee",
    highlighted: true
  },
  {
    name: "Guru",
    priceUSD: 49.99,
    period: "per year",
    description: "Full immersion in the divine wisdom for serious spiritual seekers.",
    features: [
      "All Devotee features",
      "Save 15% with annual billing",
      "Exclusive meditations",
      "Personalized spiritual path",
      "Community access"
    ],
    buttonText: "Choose Guru",
    plan: "guru",
    highlighted: false
  }
];

export default function PricingSection() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { formatPrice, currency } = useCurrency();
  const isHomePage = pathname === '/';

  // If user has an active subscription and we're on the home page, show thank you message
  if (user?.subscription?.hasActiveSubscription && isHomePage) {
    return (
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4">
              Thank You for Your Subscription
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You are already subscribed to the {user.subscription.plan === 'devotee' ? 'Devotee' : 'Guru'} plan. 
              Enjoy unlimited access to the wisdom of the Bhagavad Gita.
            </p>
          </div>
          <div className="text-center">
            <ChatNowButton />
          </div>
        </div>
      </section>
    );
  }

  const handlePlanSelection = (plan: string, amount: number) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    router.push(`/payment?plan=${plan}&amount=${amount}`);
  };

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4">
            Choose Your Spiritual Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Select the offering that best supports your journey with the timeless wisdom of the Bhagavad Gita
          </p>
          <div className="flex justify-center">
            <CurrencyToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 relative ${
                plan.highlighted 
                  ? 'dark:bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-[#973B00] transform scale-105 md:scale-110 z-10' 
                  : 'dark:bg-white'
              }`}
            >
              <div className={`p-6 ${plan.highlighted ? 'dark:bg-[#973B00] dark:text-white' : 'dark:bg-amber-100 dark:text-gray-800'}`}>
                <h3 className="text-2xl font-serif mb-2">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {plan.strickoffUSD && (
                      <span className="line-through dark:text-[#999999] text-md mr-2">
                        {formatPrice(plan.strickoffUSD)}
                      </span>
                    )}
                    {formatPrice(plan.priceUSD)}
                  </span>
                  <span className="ml-1 text-sm opacity-80">/{plan.period}</span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="dark:text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="dark:text-[#973B00] mr-2">✓</span>
                      <span className="dark:text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.name === "Free" ? (
                  <Link 
                    href={plan.buttonLink || '/'}
                    className={`block text-center py-2 px-4 rounded-full ${
                      plan.highlighted 
                        ? 'bg-[#973B00] dark:text-white hover:bg-[#BA4D00]' 
                        : 'border border-[#973B00] dark:text-[#973B00] hover:bg-[#973B00] hover:text-white'
                    } transition-colors`}
                  >
                    {plan.buttonText}
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePlanSelection(plan.plan || '', currency === 'USD' ? plan.priceUSD : (plan.priceUSD === 4.99 ? 199 : 1999))}
                    className={`w-full text-center py-2 px-4 rounded-full ${
                      plan.highlighted 
                        ? 'bg-[#973B00] dark:text-white hover:bg-[#BA4D00]' 
                        : 'border border-[#973B00] dark:text-[#973B00] hover:bg-[#973B00] hover:text-white'
                    } transition-colors`}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
              
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="dark:text-gray-600 mb-4">
            Not sure which plan is right for you? Start with the free plan and upgrade anytime.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/chat"
              className="text-[#973B00] hover:text-[#BA4D00] underline"
            >
              Try for free
            </Link>
            <span className="dark:text-gray-400">|</span>
            <Link 
              href="/contact"
              className="dark:text-[#973B00] hover:text-[#BA4D00] underline"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 