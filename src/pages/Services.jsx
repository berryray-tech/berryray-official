import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import supabase from '../lib/supabaseClient'; 

export default function Services() {
  // Data state
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true); 
  const [error, setError] = useState(null);

  // UI state
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // selection state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // registration form state
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    additionalInfo: "",
  });

  // payment/proof state
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Default Bank Info
  const DEFAULT_BANK = {
    accountName: "Berryray Technologies-lco",
    accountNumber: "9642518074",
    bankName: "Providus Bank",
  };
  
  /* -------------------------
      DATA FETCHING HOOK - FIXED VERSION
      ------------------------- */
  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true);
      setError(null);
      
      try {
        // Fixed query - removed any potential hidden characters
        const { data, error } = await supabase
          .from('services')
          .select(`
            id,
            title,
            summary,
            description,
            policy_document,
            packages:service_packages (
              id,
              name,
              price,
              priceLabel,
              desc
            )
          `)
          .order('id', { ascending: true });

        if (error) {
          console.error("Error fetching services:", error);
          setError("Unable to load services at this time. Please try again later.");
        } else {
          console.log("Services loaded successfully:", data);
          setServices(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please refresh the page.");
      } finally {
        setLoadingServices(false);
      }
    }
    
    fetchServices();
  }, []);

  /* -------------------------
      HELPER FUNCTIONS
      ------------------------- */
  const toggleExpand = (i) => {
    setExpandedIndex((prev) => (prev === i ? null : i));
  };

  const openPackages = (service, ev) => {
    if (ev) ev.stopPropagation();
    setSelectedService(service);
    setSelectedPackage(null);
    setPackagesOpen(true);
    // Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
  };

  const choosePackage = (pkg) => {
    setSelectedPackage(pkg);
    setPackagesOpen(false);
    setFormOpen(true);
  };

  const openPolicy = (policyUrl, ev) => {
    if (ev) ev.stopPropagation();
    setSelectedPolicy(policyUrl);
    setPolicyOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAllModals = () => {
    setPackagesOpen(false);
    setFormOpen(false);
    setPaymentOpen(false);
    setPolicyOpen(false);
    setSelectedPackage(null);
    setSelectedService(null);
    setSelectedPolicy(null);
    setProofFile(null);
    setProofPreview("");
    // Restore body scroll
    document.body.style.overflow = 'auto';
  };

  const onProofChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Validate file size (max 5MB)
    if (f.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      e.target.value = "";
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(f.type)) {
      alert("Please upload an image file (JPEG, PNG, WEBP, GIF)");
      e.target.value = "";
      return;
    }
    
    setProofFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email) {
      alert("Please enter your name and email.");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    // Phone validation (if provided)
    if (regData.phone && !/^[\d\s\-\+]+$/.test(regData.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    
    setFormOpen(false);
    setPaymentOpen(true);
  };
  
  /* -------------------------
      SUPABASE SUBMISSION FUNCTION
      ------------------------- */
  const onPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      alert("Please upload proof of payment.");
      return;
    }

    setSubmitting(true);

    try {
      const fileExtension = proofFile.name.split('.').pop();
      const fileName = `${selectedService.id}-${selectedPackage.id}-${Date.now()}.${fileExtension}`;
      
      const BUCKET_NAME = 'payment-proofs';
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, proofFile);

      if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);
      
      const proofUrl = publicUrlData.publicUrl;
      
      const cleanedPrice = parseFloat(
        String(selectedPackage.price).replace(/[^\d.]/g, '')
      );
      
      if (isNaN(cleanedPrice)) throw new Error("Price data is corrupted or missing.");
      
      const { error: dbError } = await supabase.from('service_registrations').insert({
        full_name: regData.name,
        email: regData.email,
        phone: regData.phone || null,
        additional_info: regData.additionalInfo || null,
        service_id: selectedService.id,
        service_title: selectedService.title,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        package_price: cleanedPrice,
        payment_proof_url: proofUrl,
        status: 'pending',
      });

      if (dbError) throw new Error(`Database insert failed: ${dbError.message}`);

      alert("✅ Registration submitted successfully! We will verify your payment and contact you soon.");
      
    } catch (err) {
      console.error("Submission failed:", err.message);
      alert(`❌ Submission failed. Please try again or contact support. Error: ${err.message}`);
      
    } finally {
      setSubmitting(false);
      setRegData({ name: "", email: "", phone: "", additionalInfo: "" });
      closeAllModals();
    }
  };

  /* -------------------------
      RENDER LOADING & ERROR STATES
      ------------------------- */
  if (loadingServices) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-500/30 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Loading Services</h2>
        <p className="text-slate-400 text-center max-w-md">
          We're preparing our service catalog for you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Unable to Load Services</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0 && !loadingServices) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6">
        <div className="text-center max-w-lg p-8 rounded-2xl glass border border-white/10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Services Available</h2>
          <p className="text-slate-300 mb-6">
            We're currently updating our service offerings. Please check back soon or contact us directly.
          </p>
          <a
            href="mailto:berryraytechnologies@gmail.com"
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-8 sm:mb-12"
      >
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Services</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto px-4">
            Choose from our professional services. Each service offers multiple packages to fit your specific needs and budget.
          </p>
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <div 
                className="glass rounded-2xl p-6 cursor-pointer h-full flex flex-col border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                onClick={() => toggleExpand(idx)}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {s.packages?.length || 0} package{s.packages?.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400">
                      {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Service Summary */}
                <p className="text-slate-300 mb-6 flex-grow">
                  {s.summary}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button
                    onClick={(ev) => openPackages(s, ev)}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300 group/btn"
                  >
                    <span>Start Registration</span>
                    <svg className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <button
                    onClick={(ev) => { ev.stopPropagation(); toggleExpand(idx); }}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300"
                  >
                    <span>{expandedIndex === idx ? "Hide Details" : "View Details"}</span>
                    <svg className={`ml-2 w-4 h-4 transition-transform ${expandedIndex === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-white/10"
                    >
                      {/* Full Description */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-white mb-3">About This Service</h4>
                        <p className="text-slate-300 leading-relaxed">{s.description}</p>
                      </div>

                      {/* Policy Document Link */}
                      {s.policy_document && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-white mb-3">Service Policy</h4>
                          <button
                            onClick={(ev) => { ev.stopPropagation(); openPolicy(s.policy_document, ev); }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>View Policy Document</span>
                          </button>
                        </div>
                      )}

                      {/* Packages */}
                      {s.packages && s.packages.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-white mb-4">Available Packages</h4>
                          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {s.packages.map((pkg) => (
                              <div 
                                key={pkg.id} 
                                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                      <h5 className="font-semibold text-white">{pkg.name}</h5>
                                    </div>
                                    <p className="text-sm text-slate-300">{pkg.desc}</p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <div className="text-lg font-bold text-blue-300 mb-3">
                                      {pkg.priceLabel || `₦${pkg.price}`}
                                    </div>
                                    <button
                                      onClick={(ev) => { ev.stopPropagation(); setSelectedService(s); choosePackage(pkg); }}
                                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-all duration-300"
                                    >
                                      <span>Select Package</span>
                                      <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <div className="rounded-2xl glass p-8 border border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-2/3">
                <h3 className="text-2xl font-bold text-white mb-4">Need Help Choosing?</h3>
                <p className="text-slate-300 mb-6">
                  Our team is ready to help you select the perfect service package for your needs. 
                  Contact us for personalized assistance and recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:berraynia@gmail.com" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Us
                  </a>
                  <a 
                    href="tel:+2347018504718" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us
                  </a>
                </div>
              </div>
              <div className="lg:w-1/3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------------- MODALS ---------------- */}
      
      {/* Packages Modal */}
      <AnimatePresence>
        {packagesOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl glass border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Packages — {selectedService.title}</h2>
                    <p className="text-slate-300 mt-1">{selectedService.summary}</p>
                  </div>
                  <button 
                    onClick={() => { setPackagesOpen(false); setSelectedService(null); }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedService.packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.03 }}
                      className="rounded-xl p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-3">
                            Popular Choice
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                          <p className="text-slate-300 text-sm mb-4">{pkg.desc}</p>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="text-3xl font-bold text-blue-300 mb-6">
                            {pkg.priceLabel || `₦${pkg.price}`}
                          </div>
                          <button
                            onClick={() => choosePackage(pkg)}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300"
                          >
                            Choose Package
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Registration Form Modal */}
      <AnimatePresence>
        {formOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl glass border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Registration Form</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                        {selectedPackage.name}
                      </span>
                      <span className="text-lg font-bold text-blue-300">
                        {selectedPackage.priceLabel || `₦${selectedPackage.price}`}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setFormOpen(false); setSelectedPackage(null); }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={onFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      placeholder="Any special requirements or notes..."
                      value={regData.additionalInfo}
                      onChange={(e) => setRegData({ ...regData, additionalInfo: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300"
                    >
                      Proceed to Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFormOpen(false); setSelectedPackage(null); }}
                      className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl glass border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Complete Payment</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-slate-300">Package:</span>
                      <span className="font-medium text-white">{selectedPackage.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-300 mt-1">
                      {selectedPackage.priceLabel || `₦${selectedPackage.price}`}
                    </div>
                  </div>
                  <button 
                    onClick={() => setPaymentOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Bank Details */}
                <div className="rounded-xl p-5 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 mb-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bank Transfer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-slate-300">Account Name:</span>
                      <span className="font-medium text-blue-300">{DEFAULT_BANK.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-slate-300">Account Number:</span>
                      <span className="font-medium text-blue-300">{DEFAULT_BANK.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-300">Bank:</span>
                      <span className="font-medium text-blue-300">{DEFAULT_BANK.bankName}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-blue-900/30 border border-blue-700/30">
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-white">Important:</span> Transfer the exact amount and upload proof below.
                    </p>
                  </div>
                </div>

                {/* Payment Proof Form */}
                <form onSubmit={onPaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload Payment Proof (Image) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onProofChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <p className="text-xs text-slate-400 mt-2">Max 5MB • JPEG, PNG, WEBP, GIF</p>
                    
                    {proofPreview && (
                      <div className="mt-4">
                        <p className="text-sm text-slate-300 mb-2">Preview:</p>
                        <img
                          src={proofPreview}
                          alt="Payment proof preview"
                          className="w-full max-h-48 object-contain rounded-lg border border-white/10"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                        submitting
                          ? "bg-green-700 opacity-70 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      }`}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Processing...
                        </span>
                      ) : (
                        "Submit Registration"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeAllModals}
                      className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Policy Document Modal */}
      <AnimatePresence>
        {policyOpen && selectedPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl glass border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Policy Document</h2>
                <button 
                  onClick={() => setPolicyOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <iframe
                  src={selectedPolicy}
                  className="w-full h-[70vh] rounded-lg border border-white/10"
                  title="Policy Document"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}