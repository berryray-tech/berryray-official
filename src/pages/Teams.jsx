import React from "react";
import { motion } from "framer-motion";

export default function Teams() {
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

  const teamMembers = [
    {
      id: 1,
      name: "Osuji Chinonso Charles",
      role: "Founder & CEO",
      bio: "Cybersecurity professional, software engineer, and digital creator with expertise in endpoint security, malware analysis, and full-stack development.",
      skills: ["Cybersecurity", "Web Development", "Project Management", "Mentorship"],
      imageColor: "from-blue-500 to-purple-600",
      icon: "👨‍💻"
    },
    {
      id: 2,
      name: "Adesewa Adetola",
      role: "Co-Founder",
      bio: "Experienced operations manager specializing in process optimization, client relations, and business development strategies.",
      skills: ["Operations", "Client Relations", "Strategy", "Management"],
      imageColor: "from-green-500 to-teal-600",
      icon: "👩‍💼"
    },
    {
      id: 3,
      name: "Chukwudi Nwosu",
      role: "Lead Developer",
      bio: "Full-stack developer with 5+ years experience in React, Node.js, and cloud infrastructure. Passionate about clean code and scalable architecture.",
      skills: ["React", "Node.js", "AWS", "Database Design"],
      imageColor: "from-amber-500 to-orange-600",
      icon: "💻"
    },
    {
      id: 4,
      name: "Amara Okonkwo",
      role: "Social Media Manager",
      bio: "Certified cybersecurity expert focusing on threat detection, vulnerability assessment, and security awareness training.",
      skills: ["Penetration Testing", "Network Security", "Risk Assessment", "Training"],
      imageColor: "from-red-500 to-pink-600",
      icon: "🛡️"
    },
    {
      id: 5,
      name: "Tunde Okafor",
      role: "UI/UX Designer",
      bio: "Creative designer with expertise in user-centered design, prototyping, and creating intuitive digital experiences across platforms.",
      skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
      imageColor: "from-purple-500 to-indigo-600",
      icon: "🎨"
    },
    {
      id: 6,
      name: "Zainab Mohammed",
      role: "Student Support Lead",
      bio: "Dedicated education specialist focusing on student mentorship, academic guidance, and creating inclusive learning environments.",
      skills: ["Mentorship", "Education", "Support", "Communication"],
      imageColor: "from-pink-500 to-rose-600",
      icon: "👩‍🏫"
    }
  ];

  const departments = [
    {
      name: "Technical Development",
      description: "Building innovative solutions with modern technologies",
      icon: "⚙️",
      memberCount: "8+ members"
    },
    {
      name: "Cybersecurity",
      description: "Protecting digital assets and ensuring data security",
      icon: "🔒",
      memberCount: "5+ experts"
    },
    {
      name: "Student Support",
      description: "Guiding and mentoring the next generation of tech leaders",
      icon: "👨‍🎓",
      memberCount: "6+ mentors"
    },
    {
      name: "Operations & Strategy",
      description: "Streamlining processes and driving business growth",
      icon: "📈",
      memberCount: "4+ professionals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Our Team</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              A diverse group of passionate professionals dedicated to innovation, security, and empowering the next generation through technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300">
                👥 25+ Team Members
              </div>
              <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-300">
                🎓 15+ Years Combined Experience
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300">
                🌍 Serving Nationwide
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Departments</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Organized expertise across key areas to deliver comprehensive technology solutions
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 border border-white/10 hover:border-white/20"
              >
                <div className="text-4xl mb-4">{dept.icon}</div>
                <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                <p className="text-slate-300 text-sm mb-4">{dept.description}</p>
                <div className="text-sm text-blue-400 font-medium">{dept.memberCount}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Leadership & Core Team</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Meet the talented individuals driving innovation and excellence at BerryRay Technologies
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={fadeInUp}
                className="group"
              >
                <div className="glass rounded-2xl overflow-hidden h-full border border-white/10 hover:border-white/20 transition-all duration-300">
                  {/* Member Header */}
                  <div className={`h-40 bg-gradient-to-br ${member.imageColor} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-20">{member.icon}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                      <p className="text-blue-300 font-medium">{member.role}</p>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="p-6">
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-400 mb-3">AREAS OF EXPERTISE</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-white/5 text-sm text-slate-300 border border-white/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Links */}
                    <div className="flex gap-3">
                      <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                        View Profile
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm font-medium transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Culture & Values</h2>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  At BerryRay Technologies, we foster a culture of innovation, collaboration, and continuous learning. 
                  Our team thrives on solving complex challenges while maintaining a supportive environment where 
                  every member can grow and contribute meaningfully.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Collaborative Environment</h4>
                      <p className="text-sm text-slate-300">Teamwork and knowledge sharing are at our core</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Innovation Driven</h4>
                      <p className="text-sm text-slate-300">Constantly exploring new technologies and approaches</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Student First</h4>
                      <p className="text-sm text-slate-300">Dedicated to empowering the next generation</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
                    <div className="text-sm text-slate-300">Team Members</div>
                  </div>
                </div>
                <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                    <div className="text-sm text-slate-300">Years Experience</div>
                  </div>
                </div>
                <div className="aspect-square rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                    <div className="text-sm text-slate-300">Students Impacted</div>
                  </div>
                </div>
                <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">50+</div>
                    <div className="text-sm text-slate-300">Projects Delivered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Team</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Are you passionate about technology and education? We're always looking for talented individuals 
              to join our mission of empowering through innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300"
              >
                View Open Positions
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg glass border border-white/10 hover:border-white/20 text-white font-medium transition-all duration-300"
              >
                Send Your CV
              </a>
            </div>
            <p className="text-sm text-slate-400 mt-6">
              Send your resume to: <a href="mailto:berraynia@gmail.com" className="text-blue-400 hover:underline">berraynia@gmail.com</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="py-8 px-4 text-center border-t border-white/10">
        <p className="text-slate-400">
          BerryRay Technologies Team • Building the Future, Together
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}