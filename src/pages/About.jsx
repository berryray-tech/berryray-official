import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const hoverScale = {
    whileHover: { scale: 1.02, transition: { duration: 0.3 } },
    whileTap: { scale: 0.98 }
  };

  const iconHover = {
    whileHover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } }
  };

  return (
    <section className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop')",
            opacity: 0.15
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.5, 2],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            About BerryRay Technologies
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Innovating technology solutions with a focus on security, education, and empowerment
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="space-y-10 lg:space-y-12"
        >
          {/* Company Overview */}
          <motion.div 
            variants={fadeInUp}
            {...hoverScale}
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-6">
              <motion.div {...iconHover} className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 p-3 rounded-xl backdrop-blur-sm border border-blue-500/20">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Who We Are</h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  BerryRay Technologies is a forward-thinking technology solutions company committed to empowering individuals, students, and businesses through innovative digital services and cybersecurity-driven systems.
                </p>
                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                  Founded by Osuji Chinonso Charles, a cybersecurity professional and multi-skilled digital creator, BerryRay Technologies blends technology, education, and safety-focused solutions to help clients stay secure, productive, and future-ready.
                </p>
                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                  We specialize in system installation, smartphone tracking support, digital services, web development, cybersecurity tools, youth mentorship, and educational technologies. Our mission is to bridge the technology gap for students, communities, and small businesses by providing accessible, reliable, and modern solutions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision Grid */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Mission */}
            <motion.div 
              variants={fadeInLeft}
              {...hoverScale}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-green-500/30 transition-all duration-300 shadow-2xl hover:shadow-green-500/10 group"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 mb-6">
                <motion.div {...iconHover} className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 p-3 rounded-xl backdrop-blur-sm border border-green-500/20 group-hover:border-green-500/40 transition-all">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Our Mission</h2>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                    To deliver secure, innovative, and user-friendly technology solutions that enhance productivity, promote digital safety, and empower individuals and businesses to thrive in an evolving digital world.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div 
              variants={fadeInRight}
              {...hoverScale}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-2xl hover:shadow-purple-500/10 group"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 mb-6">
                <motion.div {...iconHover} className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-3 rounded-xl backdrop-blur-sm border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Our Vision</h2>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                    To be a leading technology solutions provider recognized for our commitment to innovation, cybersecurity, and community empowerment, shaping a safer and more connected digital future for all.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div 
            variants={fadeInUp}
            {...hoverScale}
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/10 hover:border-amber-500/30 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-8">
              <motion.div {...iconHover} className="bg-gradient-to-br from-amber-500/30 to-orange-500/30 p-3 rounded-xl backdrop-blur-sm border border-amber-500/20">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Our Core Values</h2>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      title: "Innovation",
                      description: "Continuously exploring and implementing cutting-edge technologies to provide the best solutions.",
                      icon: "💡",
                      gradient: "from-cyan-500/20 to-blue-500/20",
                      border: "border-cyan-500/30"
                    },
                    {
                      title: "Security",
                      description: "Prioritizing the safety and privacy of our clients through robust cybersecurity practices.",
                      icon: "🔒",
                      gradient: "from-green-500/20 to-emerald-500/20",
                      border: "border-green-500/30"
                    },
                    {
                      title: "Empowerment",
                      description: "Enabling individuals and businesses to harness technology for growth and success.",
                      icon: "🚀",
                      gradient: "from-purple-500/20 to-pink-500/20",
                      border: "border-purple-500/30"
                    },
                    {
                      title: "Integrity",
                      description: "Upholding honesty, transparency, and ethical practices in all our operations.",
                      icon: "🤝",
                      gradient: "from-yellow-500/20 to-amber-500/20",
                      border: "border-yellow-500/30"
                    },
                    {
                      title: "Community",
                      description: "Fostering a supportive environment that encourages learning, collaboration, and positive impact.",
                      icon: "👥",
                      gradient: "from-red-500/20 to-pink-500/20",
                      border: "border-red-500/30"
                    }
                  ].map((value, index) => (
                    <motion.div 
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-gradient-to-br ${value.gradient} rounded-xl p-5 hover:shadow-xl transition-all duration-300 border ${value.border} hover:border-opacity-100 cursor-pointer`}
                    >
                      <div className="flex items-start space-x-3">
                        <motion.span 
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="text-2xl"
                        >
                          {value.icon}
                        </motion.span>
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">{value.title}</h3>
                          <p className="text-slate-300 text-sm leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founder Note */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-2xl p-6 sm:p-8 lg:p-10 border border-blue-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl animate-pulse-slow">
                  <span className="text-white text-2xl sm:text-3xl font-bold">OC</span>
                </div>
              </motion.div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  A Message from Our Founder
                </h3>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed italic mb-4">
                  "At BerryRay Technologies, we believe that technology should be accessible, secure, and empowering for everyone. Our commitment is to bridge the digital divide and create solutions that make a real difference in people's lives."
                </p>
                <motion.div 
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <p className="font-semibold text-white text-lg">Osuji Chinonso Charles</p>
                  <p className="text-slate-400 text-sm">Founder & Cybersecurity Professional</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Services Highlight */}
          <motion.div 
            variants={fadeInUp}
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-2xl"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Expertise
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "System Installation", icon: "💻", color: "from-blue-500/30 to-blue-600/30" },
                { name: "Smartphone Tracking Support", icon: "📱", color: "from-green-500/30 to-green-600/30" },
                { name: "Web Development", icon: "🌐", color: "from-purple-500/30 to-purple-600/30" },
                { name: "Cybersecurity Solutions", icon: "🛡️", color: "from-red-500/30 to-red-600/30" },
                { name: "Digital Services", icon: "⚡", color: "from-yellow-500/30 to-yellow-600/30" },
                { name: "Youth Mentorship", icon: "👨‍🏫", color: "from-pink-500/30 to-pink-600/30" },
                { name: "Educational Technologies", icon: "📚", color: "from-indigo-500/30 to-indigo-600/30" },
                { name: "IT Consulting", icon: "🎯", color: "from-cyan-500/30 to-cyan-600/30" }
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${service.color} rounded-lg p-4 text-center hover:shadow-xl transition-all duration-300 border border-white/10 hover:border-white/30 cursor-pointer group`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl mb-2"
                  >
                    {service.icon}
                  </motion.div>
                  <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{service.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-16 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-xl bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-2xl p-8 sm:p-10 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Transform Your Digital Experience?
            </h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join countless individuals and businesses who have trusted BerryRay Technologies for secure, innovative technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="/contact" 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform shadow-lg"
              >
                Get In Touch
              </motion.a>
              <motion.a 
                href="/services" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 transform"
              >
                Explore Services
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add custom CSS for slow pulse animation */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}