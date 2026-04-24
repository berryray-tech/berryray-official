import React, { useEffect, useState } from "react";
import NewsBanner from "../components/NewsBanner";
import Testimonies from "./Admin/Testimonies";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import supabase from "../lib/supabaseClient";

// Updated imports - make sure the file name matches exactly
import { 
  fetchActiveBanners, 
  fetchPublicTestimonies  // Changed from fetchApprovedTestimonies
} from "../services/adminContentService";

export default function Home() {
  const [quote, setQuote] = useState({
    text: "Science is a way of thinking much more than it is a body of knowledge.",
    author: "Carl Sagan",
  });
  const [banners, setBanners] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ banners: null, testimonies: null, quote: null });
  
  // New state for certificates
  const [certificates, setCertificates] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrors({ banners: null, testimonies: null, quote: null });

        // Load all data in parallel
        const [bannerData, testimonyData, quoteData, certificateData] = await Promise.allSettled([
          fetchActiveBanners(),
          fetchPublicTestimonies(), // Use the safer public function
          fetchQuote(),
          fetchCertificates() // New function to fetch certificates
        ]);

        // Handle banners
        if (bannerData.status === 'fulfilled') {
          setBanners(bannerData.value || []);
        } else {
          console.error("Error loading banners:", bannerData.reason);
          setErrors(prev => ({ ...prev, banners: "Failed to load news banners" }));
        }

        // Handle testimonies
        if (testimonyData.status === 'fulfilled') {
          setTestimonies(testimonyData.value || []);
        } else {
          console.error("Error loading testimonies:", testimonyData.reason);
          setErrors(prev => ({ ...prev, testimonies: "Failed to load testimonials" }));
        }

        // Handle quote
        if (quoteData.status === 'fulfilled') {
          setQuote(quoteData.value);
        } else {
          console.error("Error loading quote:", quoteData.reason);
          setErrors(prev => ({ ...prev, quote: "Using default quote" }));
        }

        // Handle certificates
        if (certificateData.status === 'fulfilled') {
          setCertificates(certificateData.value || []);
        } else {
          console.error("Error loading certificates:", certificateData.reason);
        }

      } catch (error) {
        console.error("Unexpected error loading home page data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchQuote() {
      try {
        const { data, error } = await supabase
          .from("site_meta")
          .select("value")
          .eq("key", "home_quote")
          .single();

        if (error) {
          console.log("No custom quote found, using default");
          throw error;
        }

        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value);
            return parsed;
          } catch (parseError) {
            console.error("Error parsing quote:", parseError);
          }
        }
        
        // Return default quote
        return {
          text: "Science is a way of thinking much more than it is a body of knowledge.",
          author: "Carl Sagan",
        };
      } catch (error) {
        // Return default quote on any error
        return {
          text: "Science is a way of thinking much more than it is a body of knowledge.",
          author: "Carl Sagan",
        };
      }
    }

    // New function to fetch certificates
    async function fetchCertificates() {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching certificates:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in fetchCertificates:", error);
        return [];
      }
    }

    loadData();
  }, []);

  // Function to handle PDF viewing
  const handleViewPdf = (certificate) => {
    setSelectedPdf(certificate);
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
  };

  // Show a loading state while fetching critical content
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-lg font-medium mt-6">Preparing Your Experience</p>
        <p className="text-sm text-slate-400 mt-2 max-w-md text-center">
          Loading the latest content and resources for you...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={handleClosePdf}>
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <a
                href={selectedPdf.file_url}
                download={selectedPdf.title}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                title="Download PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <button
                onClick={handleClosePdf}
                className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <iframe
              src={`${selectedPdf.file_url}#toolbar=0&navpanes=0`}
              className="w-full h-full"
              title={selectedPdf.title}
            />
          </div>
        </div>
      )}

      {/* Show error messages if any */}
      {errors.banners && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-300 p-4 text-center backdrop-blur-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.banners}</span>
          </div>
        </motion.div>
      )}
      
      {/* Pass the fetched banners data as a prop */}
      <NewsBanner banners={banners} />

      {/* Navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              to="/services" 
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Services</span>
            </Link>
            <Link 
              to="/courses" 
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Courses</span>
            </Link>
            <Link 
              to="/portfolio" 
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Founder</span>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Link 
              to="/services" 
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              aria-label="Services"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Main Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center py-8 lg:py-16">
          {/* Left Column - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="block">Teach. Empower.</span>
                <span className="block mt-2">Transform.</span>
                <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Learn with BerryRay.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                Practical courses, guided registration services, and trusted student support — designed for real success in today's digital world.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                to="/portfolio"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl glass hover:scale-[1.02] transition-all duration-300 border border-white/10 hover:border-white/20"
                aria-label="Our Founder"
              >
                <span className="font-semibold text-base sm:text-lg">Meet Our Founder</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/courses"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                aria-label="View Courses"
              >
                <span className="font-semibold text-base sm:text-lg">Explore Courses</span>
                <svg className="ml-2 w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg italic text-white leading-relaxed">"{quote.text}"</p>
                  <footer className="mt-4 text-sm text-slate-300 font-medium">— {quote.author}</footer>
                  {errors.quote && (
                    <p className="text-xs text-yellow-400 mt-2">{errors.quote}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Features Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="glass rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm border border-white/10">
              {/* Logo & Title */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-white">BR</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-slate-900"></div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Why BerryRay?</h3>
                  <p className="text-slate-300 mt-2">
                    Hands-on courses, friendly support, and secure enrollment. Everything built for students.
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    icon: "⏱️",
                    title: "Flexible Learning",
                    desc: "Self-paced & live sessions",
                    color: "from-blue-500/20 to-blue-600/20"
                  },
                  {
                    icon: "🔒",
                    title: "Trusted Payments",
                    desc: "Bank transfer & proof upload",
                    color: "from-green-500/20 to-green-600/20"
                  },
                  {
                    icon: "👨‍🏫",
                    title: "Expert Mentors",
                    desc: "Industry professionals",
                    color: "from-purple-500/20 to-purple-600/20"
                  },
                  {
                    icon: "📱",
                    title: "Mobile Friendly",
                    desc: "Learn on any device",
                    color: "from-amber-500/20 to-amber-600/20"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className={`p-5 rounded-xl bg-gradient-to-br ${feature.color} border border-white/10 hover:border-white/20 transition-all duration-300`}
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h4 className="font-bold text-white">{feature.title}</h4>
                        <p className="text-sm text-slate-300 mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400">100+</div>
                    <div className="text-sm text-slate-400">Students Trained</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400">24/7</div>
                    <div className="text-sm text-slate-400">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* NEW SECTION: Government Certificates */}
        {certificates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="py-12 lg:py-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Government Certifications</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                BerryRay Technologies is officially recognized and certified by Nigerian government agencies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewPdf(cert)}
                >
                  <div className="flex items-start gap-4">
                    {/* Certificate Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{cert.description}</p>
                      
                      {/* Certificate Number (if available) */}
                      {cert.certificate_number && (
                        <p className="text-xs text-slate-500 font-mono mb-3">
                          Cert. No: {cert.certificate_number}
                        </p>
                      )}

                      {/* Issue Date (if available) */}
                      {cert.issue_date && (
                        <p className="text-xs text-slate-500">
                          Issued: {new Date(cert.issue_date).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}

                      {/* View Button */}
                      <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="text-sm font-medium">View Certificate</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-400">Verified & Authentic Government Certifications</span>
              </div>
            </div>
          </motion.section>
        )}

        {/* Testimonials Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-12 lg:py-16"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Student Success Stories</h2>
              <p className="text-slate-400 mt-2">Real feedback from our learning community</p>
            </div>
            {errors.testimonies && (
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-900/20 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{errors.testimonies}</span>
              </div>
            )}
          </div>
          
          {testimonies.length === 0 ? (
            <div className="text-center py-12 lg:py-16 rounded-2xl glass border border-white/10">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Testimonials Yet</h3>
                <p className="text-slate-400">Be the first to share your BerryRay experience!</p>
                <Link 
                  to="/contact" 
                  className="inline-block mt-6 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  Share Your Story
                </Link>
              </div>
            </div>
          ) : (
            <Testimonies testimonies={testimonies} />
          )}
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="py-12 lg:py-16"
        >
          <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-blue-900/30 via-slate-900/50 to-purple-900/30 border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="lg:w-2/3">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  Ready to Begin Your Journey?
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Choose from our curated courses or reach out directly — we'll guide you through every step of registration, payment, and learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <div className="flex items-center text-slate-400">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Enrollment</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Flexible Scheduling</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Certification</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                <Link 
                  to="/Courses" 
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="font-semibold text-lg">Browse All Courses</span>
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  to="/contact" 
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-xl glass border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300"
                >
                  <span className="font-semibold text-lg">Contact Our Team</span>
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="py-12 text-center border-t border-white/10 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-white">BR</span>
            </div>
            <p className="text-2xl font-bold mb-4">BerryRay Technologies</p>
            <p className="text-slate-400 mb-6">Practical education for real-world success</p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              <a href="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} BerryRay Technologies. All rights reserved.
            </p>
            <p className="text-xs text-slate-600 mt-2">
              RC:  9351504 {certificates.find(c => c.title.includes('CAC'))?.certificate_number || 'XXXXX'} | 
              SMEDAN Reg: SUID-3622-7935-0075-7139 {certificates.find(c => c.title.includes('SMEDAN'))?.certificate_number || 'XXXXX'}
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}