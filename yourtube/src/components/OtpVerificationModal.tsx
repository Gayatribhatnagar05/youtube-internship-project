"use client";

import React, { useState } from "react";
import { ShieldAlert, KeyRound, CheckCircle2, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  deviceHash: string;
  onSuccess: (user: any) => void;
}

export default function OtpVerificationModal({
  isOpen,
  onClose,
  email,
  deviceHash,
  onSuccess,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/security/verify-otp", {
        email,
        otpCode: otp,
        deviceHash,
      });

      toast.success(res.data.message || "OTP verified successfully!");
      onSuccess(res.data.user);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Security Verification</h2>
          <p className="text-xs text-gray-500 mt-1">
            New device, city, or state login detected for{" "}
            <span className="font-semibold text-gray-800">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Enter 6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl font-mono text-center text-lg tracking-widest focus:outline-none focus:border-red-500"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 text-center">
              Check your registered email console log for your one-time password.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl gap-2"
          >
            <Lock className="w-4 h-4" />
            {loading ? "Verifying..." : "Verify & Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
