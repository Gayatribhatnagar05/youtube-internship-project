"use client";

import React from "react";
import { CheckCircle2, Download, Printer, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invoice {
  invoiceId: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  date: string;
  tax: number;
  total: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export default function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden border">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-xs text-gray-500">Invoice and confirmation email issued.</p>
          </div>
        </div>

        {/* Invoice Box */}
        <div className="bg-gray-50 border rounded-xl p-5 text-sm space-y-4 mb-6">
          <div className="flex justify-between items-start border-b pb-3">
            <div>
              <h3 className="font-extrabold text-base text-red-600">YouTube 2.0 Premium</h3>
              <p className="text-xs text-gray-500">Invoice #{invoice.invoiceId}</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                PAID VIA RAZORPAY
              </span>
              <p className="text-xs text-gray-500 mt-1">Date: {invoice.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs py-1">
            <div>
              <span className="text-gray-400 font-medium">Billed To:</span>
              <p className="font-semibold text-gray-800">{invoice.userName}</p>
              <p className="text-gray-600">{invoice.userEmail}</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Transaction Info:</span>
              <p className="font-semibold text-gray-800">ID: {invoice.paymentId}</p>
              <p className="text-gray-600">Order: {invoice.orderId}</p>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="border-t border-b py-3 space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{invoice.plan} Subscription Membership (1 Month)</span>
              <span>₹{invoice.amount}.00</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>GST / Taxes (18%)</span>
              <span>₹{invoice.tax}.00</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-900 border-t pt-2 mt-1">
              <span>Total Paid</span>
              <span className="text-red-600">₹{invoice.total}.00</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Plan benefits active immediately on your account.</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </Button>
          <Button size="sm" onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
