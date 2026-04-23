import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courseService } from "../services/courseService";

const EnhancedPaymentModal = ({ open, course, enrollmentMethod, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [installmentPlan, setInstallmentPlan] = useState("3months");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    email: "",
    phone: ""
  });
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setPaymentMethod("card");
      setInstallmentPlan("3months");
      setFormData({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
        email: "",
        phone: ""
      });
      setError("");
    }
  }, [open]);

  if (!open || !course) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Calculate total amount
      const amount = enrollmentMethod === "full" 
        ? course.price 
        : calculateInstallment().total;

      // Create enrollment record
      const enrollmentData = {
        course_id: course.id,
        user_email: formData.email,
        user_phone: formData.phone,
        payment_method: paymentMethod,
        enrollment_type: enrollmentMethod,
        installment_plan: enrollmentMethod === "installment" ? installmentPlan : null,
        amount_paid: Math.round(amount),
        status: "completed" // In production, verify payment first
      };

      await courseService.createEnrollment(enrollmentData);

      // Show success message
      alert(`Payment successful! A confirmation has been sent to ${formData.email}`);
      onClose();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateInstallment = () => {
    const baseAmount = course.price;
    const interest = installmentPlan === "3months" ? 0.05 : 
                    installmentPlan === "6months" ? 0.08 : 0.12;
    
    const total = baseAmount * (1 + interest);
    const months = parseInt(installmentPlan);
    const monthly = total / months;
    
    return { total, monthly, months };
  };

  const { total, monthly, months } = installmentPlan && course ? calculateInstallment() : { total: 0, monthly: 0, months: 0 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white">Complete Your Enrollment</h2>
              <p className="text-white/80 mt-1">{course.title}</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between px-6 pt-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                    ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`w-20 h-1 mx-2 rounded
                      ${step > num ? 'bg-blue-600' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Payment Method Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-white">Select Payment Method</h3>
                    
                    {/* Full Payment Option */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition
                        ${enrollmentMethod === "full" ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="full"
                        checked={enrollmentMethod === "full"}
                        onChange={() => {}}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Full Payment</h4>
                          <p className="text-sm text-gray-400">Pay once and get instant access</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-white">₦{course.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.label>

                    {/* Installment Options */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition
                        ${enrollmentMethod === "installment" ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="installment"
                        checked={enrollmentMethod === "installment"}
                        onChange={() => {}}
                        className="hidden"
                      />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">Installment Plan</h4>
                            <p className="text-sm text-gray-400">Pay in flexible monthly installments</p>
                          </div>
                        </div>

                        {enrollmentMethod === "installment" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3 pt-3"
                          >
                            <select
                              value={installmentPlan}
                              onChange={(e) => setInstallmentPlan(e.target.value)}
                              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            >
                              <option value="3months">3 Months (5% interest) - ₦{Math.round(monthly).toLocaleString()}/month</option>
                              <option value="6months">6 Months (8% interest) - ₦{Math.round(monthly).toLocaleString()}/month</option>
                              <option value="12months">12 Months (12% interest) - ₦{Math.round(monthly).toLocaleString()}/month</option>
                            </select>

                            <div className="bg-gray-800 p-4 rounded-lg">
                              <p className="text-sm text-gray-400">Total with interest:</p>
                              <p className="text-2xl font-bold text-white">₦{Math.round(total).toLocaleString()}</p>
                              <p className="text-xs text-gray-400 mt-1">{months} monthly payments of ₦{Math.round(monthly).toLocaleString()}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.label>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-white">Payment Details</h3>

                    {/* Payment Method Tabs */}
                    <div className="flex gap-2 mb-6">
                      {["card", "transfer", "ussd"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`flex-1 py-2 rounded-lg capitalize transition ${
                            paymentMethod === method
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardName"
                            placeholder="John Doe"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              name="expiry"
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={handleInputChange}
                              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Bank Transfer Option */}
                    {paymentMethod === "transfer" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-800 p-6 rounded-lg text-center"
                      >
                        <p className="text-white mb-4">Transfer the exact amount to:</p>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-white">
                            ₦{enrollmentMethod === "full" ? course.price.toLocaleString() : Math.round(total).toLocaleString()}
                          </p>
                          <p className="text-gray-400">Bank: Access Bank</p>
                          <p className="text-gray-400">Account: 1234567890</p>
                          <p className="text-gray-400">Name: Tech Academy</p>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">You'll need to provide your email and phone for verification</p>
                      </motion.div>
                    )}

                    {/* USSD Option */}
                    {paymentMethod === "ussd" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-800 p-6 rounded-lg"
                      >
                        <p className="text-white mb-4">Dial the USSD code on your phone:</p>
                        <div className="bg-gray-900 p-4 rounded-lg text-center">
                          <p className="text-3xl font-bold text-white">*123*4567#</p>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">Follow the prompts and use your email as reference</p>
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Information & Review */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-white">Contact Information</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+234 XXX XXX XXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                          required
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Course:</span>
                          <span className="text-white">{course.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-white capitalize">
                            {paymentMethod} - {enrollmentMethod === "full" ? "Full Payment" : `Installment (${months} months)`}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-700">
                          <span className="text-white font-semibold">Total:</span>
                          <span className="text-white font-bold">
                            ₦{enrollmentMethod === "full" ? course.price.toLocaleString() : Math.round(total).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Complete Payment"
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedPaymentModal;