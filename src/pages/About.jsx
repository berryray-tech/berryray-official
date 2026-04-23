import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
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
            className="glass rounded-2xl p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-6">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
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
              variants={fadeInUp}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 mb-6">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
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
              variants={fadeInUp}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 mb-6">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
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
            className="glass rounded-2xl p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-8">
              <div className="bg-amber-500/20 p-3 rounded-xl">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Our Core Values</h2>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      title: "Innovation",
                      description: "Continuously exploring and implementing cutting-edge technologies to provide the best solutions.",
                      icon: "💡"
                    },
                    {
                      title: "Security",
                      description: "Prioritizing the safety and privacy of our clients through robust cybersecurity practices.",
                      icon: "🔒"
                    },
                    {
                      title: "Empowerment",
                      description: "Enabling individuals and businesses to harness technology for growth and success.",
                      icon: "🚀"
                    },
                    {
                      title: "Integrity",
                      description: "Upholding honesty, transparency, and ethical practices in all our operations.",
                      icon: "🤝"
                    },
                    {
                      title: "Community",
                      description: "Fostering a supportive environment that encourages learning, collaboration, and positive impact.",
                      icon: "👥"
                    }
                  ].map((value, index) => (
                    <div 
                      key={index}
                      className="bg-slate-800/50 rounded-xl p-5 hover:bg-slate-800/70 transition-all duration-300 border border-slate-700/50 hover:border-slate-600"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{value.icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">{value.title}</h3>
                          <p className="text-slate-300 text-sm leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founder Note */}
          <motion.div 
            variants={fadeInUp}
            className="glass rounded-2xl p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold">OC</span>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">A Message from Our Founder</h3>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed italic mb-4">
                  "At BerryRay Technologies, we believe that technology should be accessible, secure, and empowering for everyone. Our commitment is to bridge the digital divide and create solutions that make a real difference in people's lives."
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-white">Osuji Chinonso Charles</p>
                  <p className="text-slate-400 text-sm">Founder & Cybersecurity Professional</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services Highlight */}
          <motion.div 
            variants={fadeInUp}
            className="glass rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Our Expertise</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "System Installation",
                "Smartphone Tracking Support",
                "Web Development",
                "Cybersecurity Solutions",
                "Digital Services",
                "Youth Mentorship",
                "Educational Technologies",
                "IT Consulting"
              ].map((service, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 rounded-lg p-4 text-center hover:bg-slate-800 transition duration-300 border border-slate-700/50"
                >
                  <div className="text-blue-400 text-lg mb-2">
                    {index === 0 && "💻"}
                    {index === 1 && "📱"}
                    {index === 2 && "🌐"}
                    {index === 3 && "🛡️"}
                    {index === 4 && "⚡"}
                    {index === 5 && "👨‍🏫"}
                    {index === 6 && "📚"}
                    {index === 7 && "🎯"}
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{service}</p>
                </div>
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
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Transform Your Digital Experience?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join countless individuals and businesses who have trusted BerryRay Technologies for secure, innovative technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105 active:scale-95"
            >
              Get In Touch
            </a>
            <a 
              href="/services" 
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition duration-300 transform hover:scale-105 active:scale-95"
            >
              Explore Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}