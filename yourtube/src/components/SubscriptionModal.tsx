"use client";

import React, { useState } from "react";
import { Check, Sparkles, Zap, Shield, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import InvoiceModal from "./InvoiceModal";
import { toast } from "sonner";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    name: "Free",
    price: 0,
    icon: Shield,
    color: "bg-gray-100 text-gray-800",
    badgeColor: "bg-gray-200 text-gray-700",
    description: "Basic access for casual viewers",
    features: [
      "Standard Watch Time",
      "1 Video Download per day",
      "Standard Video Quality (480p)",
      "Ad-supported viewing",
    ],
  },
  {
    name: "Bronze",
    price: 99,
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    badgeColor: "bg-amber-100 text-amber-800",
    description: "Great for frequent viewers",
    features: [
      "Unlimited Watch Time",
      "5 Video Downloads per day",
      "HD Video Quality (720p)",
      "Ad-free viewing experience",
      "Join Watch Parties",
    ],
  },
  {
    name: "Silver",
    price: 199,
    icon: Sparkles,
    color: "bg-slate-500/10 text-slate-600 border-slate-500/30",
    badgeColor: "bg-slate-200 text-slate-800",
    popular: true,
    description: "Best balance of performance & downloads",
    features: [
      "Unlimited Watch Time",
      "20 Video Downloads per day",
      "Full HD Quality (1080p)",
      "Ad-free viewing experience",
      "Host & Screen Share in Watch Parties",
    ],
  },
  {
    name: "Gold",
    price: 499,
    icon: Crown,
    color: "bg-amber-400/20 text-amber-700 border-amber-400/50",
    badgeColor: "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold",
    description: "Ultimate VIP unlimited experience",
    features: [
      "Unlimited Watch Time",
      "Unlimited Video Downloads",
      "Ultra HD 4K Quality",
      "Complete Ad-Free Experience",
      "Host Unlimited Watch Parties",
      "Priority VIP Support",
    ],
  },
];

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { user, login } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (planName: string) => {
    if (!user) {
      toast.error("Please sign in to upgrade your subscription plan.");
      return;
    }

    if (planName === "Free") {
      toast.info("You are already on the Free plan.");
      return;
    }

    setLoadingPlan(planName);

    try {
      // 1. Create Razorpay order
      const orderRes = await axiosInstance.post("/payment/create-order", {
        plan: planName,
        userId: user._id || user.id,
      });

      const { order, key } = orderRes.data;

      const verifyPaymentCall = async (paymentId: string) => {
        const verifyRes = await axiosInstance.post("/payment/verify", {
          userId: user._id || user.id,
          plan: planName,
          razorpayOrderId: order.id,
          razorpayPaymentId: paymentId,
        });

        toast.success(`Plan upgraded to ${planName}!`);
        if (login && user) {
          login({ ...user, plan: planName });
        }
        setActiveInvoice(verifyRes.data.invoice);
        setIsInvoiceOpen(true);
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "YouTube 2.0 Premium",
          description: `${planName} Subscription Upgrade`,
          order_id: order.id,
          handler: function (response: any) {
            verifyPaymentCall(response.razorpay_payment_id);
          },
          prefill: {
            name: user.name || "Subscriber",
            email: user.email,
          },
          theme: {
            color: "#dc2626",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Direct test payment verification for development / test mode
        await verifyPaymentCall(`pay_test_${Date.now()}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white text-gray-900 rounded-2xl max-w-5xl w-full p-6 shadow-2xl relative border my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Upgrade Subscription
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 text-gray-900">
              Unlock Full YouTube 2.0 Power
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose the perfect plan for unlimited watch time, offline downloads, and ad-free entertainment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = (user?.plan || "Free") === plan.name;

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 relative ${
                    plan.popular ? "border-red-500 ring-2 ring-red-500/20 shadow-lg scale-102" : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl ${plan.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${plan.badgeColor}`}>
                        {plan.name}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900">{plan.name} Plan</h3>
                    <p className="text-xs text-gray-500 mb-4">{plan.description}</p>

                    <div className="mb-4">
                      <span className="text-3xl font-extrabold text-gray-900">₹{plan.price}</span>
                      <span className="text-xs text-gray-500"> / month</span>
                    </div>

                    <div className="space-y-2 border-t pt-4 text-xs">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-700">
                          <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <Button
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={isCurrent || loadingPlan === plan.name}
                      className={`w-full font-semibold ${
                        isCurrent
                          ? "bg-gray-100 text-gray-500 hover:bg-gray-100"
                          : plan.popular
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {isCurrent
                        ? "Current Plan"
                        : loadingPlan === plan.name
                        ? "Processing..."
                        : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={activeInvoice}
      />
    </>
  );
}
