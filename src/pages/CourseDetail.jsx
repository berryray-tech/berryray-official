// pages/CourseDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseService } from '../services/courseService';
import EnhancedPaymentModal from '../components/EnhancedPaymentModal';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    educationLevel: '',
    heardAbout: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
      
      // Get modules for this specific course
      const modulesData = await getCourseModulesById(id);
      setModules(modulesData || []);
      
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get modules based on course ID
  const getCourseModulesById = async (courseId) => {
    const modulesMap = {
      // Web Development Course
      'web-development': [
        {
          id: 1,
          title: "Introduction to Web Development",
          description: "Learn the fundamentals of web development and understand how websites work.",
          duration: "2 hours",
          lessons: [
            "What is Web Development?",
            "How the Internet Works",
            "Frontend vs Backend Development",
            "Setting Up Your Development Environment",
            "Your First HTML Page"
          ],
          resources: ["Course Slides", "Setup Guide", "Code Samples"]
        },
        {
          id: 2,
          title: "HTML5 Mastery",
          description: "Master HTML5 tags, semantic elements, and modern HTML practices.",
          duration: "3 hours",
          lessons: [
            "HTML Document Structure",
            "Semantic HTML Elements",
            "Forms and Input Types",
            "Multimedia Elements (Audio, Video)",
            "HTML5 APIs",
            "Best Practices and SEO"
          ],
          resources: ["HTML Cheat Sheet", "Practice Exercises", "Project Files"]
        },
        {
          id: 3,
          title: "CSS3 Styling & Animations",
          description: "Create stunning designs with modern CSS3 techniques and animations.",
          duration: "4 hours",
          lessons: [
            "CSS Selectors and Properties",
            "Flexbox and Grid Layouts",
            "Responsive Design with Media Queries",
            "CSS Animations and Transitions",
            "CSS Variables and Custom Properties",
            "Tailwind CSS Basics"
          ],
          resources: ["CSS Reference Guide", "Animation Examples", "Layout Templates"]
        },
        {
          id: 4,
          title: "JavaScript Fundamentals",
          description: "Learn JavaScript from scratch and add interactivity to websites.",
          duration: "6 hours",
          lessons: [
            "Variables, Data Types, and Operators",
            "Functions and Scope",
            "Arrays and Objects",
            "DOM Manipulation",
            "Event Handling",
            "ES6+ Features (Arrow Functions, Destructuring, Spread Operator)",
            "Async JavaScript (Promises, Async/Await)"
          ],
          resources: ["JavaScript Reference", "Code Challenges", "Project Demos"]
        },
        {
          id: 5,
          title: "React.js Development",
          description: "Build modern web applications with React.js framework.",
          duration: "8 hours",
          lessons: [
            "React Components and Props",
            "State and Lifecycle",
            "Hooks (useState, useEffect, useContext)",
            "React Router for Navigation",
            "State Management with Context API",
            "API Integration",
            "Building and Deploying React Apps"
          ],
          resources: ["React Documentation", "Project Source Code", "Deployment Guide"]
        },
        {
          id: 6,
          title: "Capstone Project",
          description: "Build a complete full-stack web application from scratch.",
          duration: "10 hours",
          lessons: [
            "Project Planning and Setup",
            "Building the Frontend",
            "Creating the Backend API",
            "Database Integration",
            "Authentication and Authorization",
            "Testing and Debugging",
            "Final Deployment"
          ],
          resources: ["Project Requirements", "Starter Code", "Deployment Checklist"]
        }
      ],
      
      // Cybersecurity Course
      'cybersecurity': [
        {
          id: 1,
          title: "Introduction to Cybersecurity",
          description: "Understand the fundamentals of cybersecurity and threat landscape.",
          duration: "2 hours",
          lessons: [
            "What is Cybersecurity?",
            "Types of Cyber Threats",
            "The CIA Triad",
            "Common Attack Vectors",
            "Security Best Practices"
          ],
          resources: ["Security Glossary", "Threat Map", "Study Guide"]
        },
        {
          id: 2,
          title: "Network Security",
          description: "Learn to secure networks against unauthorized access and attacks.",
          duration: "4 hours",
          lessons: [
            "Network Protocols and Architecture",
            "Firewalls and IDS/IPS",
            "VPN Technologies",
            "Network Segmentation",
            "Wireless Security",
            "Network Monitoring Tools"
          ],
          resources: ["Network Diagrams", "Tool Configuration Guide", "Lab Exercises"]
        },
        {
          id: 3,
          title: "Ethical Hacking & Penetration Testing",
          description: "Master ethical hacking techniques to identify vulnerabilities.",
          duration: "6 hours",
          lessons: [
            "Ethical Hacking Methodology",
            "Reconnaissance Techniques",
            "Vulnerability Assessment",
            "Exploitation Basics",
            "Post-Exploitation",
            "Reporting and Documentation",
            "Legal and Compliance Considerations"
          ],
          resources: ["Kali Linux Guide", "Tool Documentation", "Practice Labs"]
        },
        {
          id: 4,
          title: "Security Operations & Incident Response",
          description: "Learn to detect, respond to, and recover from security incidents.",
          duration: "3 hours",
          lessons: [
            "Security Monitoring",
            "Incident Response Lifecycle",
            "Forensics Basics",
            "Malware Analysis",
            "Business Continuity Planning",
            "Creating Incident Response Plans"
          ],
          resources: ["Incident Response Templates", "Forensics Tools", "Case Studies"]
        }
      ],
      
      // Data Science Course
      'data-science': [
        {
          id: 1,
          title: "Introduction to Data Science",
          description: "Understand the data science lifecycle and key concepts.",
          duration: "2 hours",
          lessons: [
            "What is Data Science?",
            "The Data Science Workflow",
            "Types of Data",
            "Data Science Tools Overview",
            "Setting Up Python Environment"
          ],
          resources: ["Python Setup Guide", "Jupyter Notebook Tutorial", "Data Science Roadmap"]
        },
        {
          id: 2,
          title: "Python for Data Science",
          description: "Master Python programming for data analysis and manipulation.",
          duration: "5 hours",
          lessons: [
            "Python Basics Review",
            "NumPy for Numerical Computing",
            "Pandas for Data Manipulation",
            "Data Cleaning Techniques",
            "Data Visualization with Matplotlib",
            "Advanced Pandas Operations"
          ],
          resources: ["Python Cheat Sheet", "Jupyter Notebooks", "Dataset Files"]
        },
        {
          id: 3,
          title: "Statistical Analysis",
          description: "Learn statistical methods for data analysis and interpretation.",
          duration: "4 hours",
          lessons: [
            "Descriptive Statistics",
            "Probability Distributions",
            "Hypothesis Testing",
            "Correlation and Regression",
            "Statistical Significance",
            "Practical Applications"
          ],
          resources: ["Statistics Formula Sheet", "Practice Datasets", "Case Studies"]
        },
        {
          id: 4,
          title: "Machine Learning Fundamentals",
          description: "Build predictive models using machine learning algorithms.",
          duration: "6 hours",
          lessons: [
            "Supervised vs Unsupervised Learning",
            "Linear and Logistic Regression",
            "Decision Trees and Random Forests",
            "Clustering Algorithms",
            "Model Evaluation Metrics",
            "Feature Engineering",
            "Preventing Overfitting"
          ],
          resources: ["ML Algorithms Guide", "Scikit-learn Tutorial", "Project Files"]
        }
      ],
      
      // UI/UX Design Course
      'ui-ux-design': [
        {
          id: 1,
          title: "Introduction to UI/UX Design",
          description: "Understand the principles of user interface and user experience design.",
          duration: "2 hours",
          lessons: [
            "What is UI/UX?",
            "The Design Thinking Process",
            "User-Centered Design",
            "UI vs UX Explained",
            "Career Paths in Design"
          ],
          resources: ["Design Glossary", "Case Studies", "Portfolio Examples"]
        },
        {
          id: 2,
          title: "User Research & Analysis",
          description: "Learn to understand user needs through effective research methods.",
          duration: "3 hours",
          lessons: [
            "User Personas",
            "User Journey Mapping",
            "Competitive Analysis",
            "Surveys and Interviews",
            "Affinity Diagrams",
            "Research Synthesis"
          ],
          resources: ["Research Templates", "Interview Guides", "Persona Examples"]
        },
        {
          id: 3,
          title: "Wireframing & Prototyping",
          description: "Create low-fidelity and high-fidelity prototypes using industry tools.",
          duration: "4 hours",
          lessons: [
            "Wireframing Best Practices",
            "Figma Fundamentals",
            "Creating Interactive Prototypes",
            "Design Systems",
            "Component Libraries",
            "Prototyping Tools (Figma, Adobe XD)"
          ],
          resources: ["Figma Files", "UI Kits", "Prototype Examples"]
        },
        {
          id: 4,
          title: "Visual Design Principles",
          description: "Master color theory, typography, and visual hierarchy.",
          duration: "3 hours",
          lessons: [
            "Color Theory",
            "Typography Basics",
            "Visual Hierarchy",
            "Grid Systems",
            "Accessibility in Design",
            "Micro-interactions"
          ],
          resources: ["Color Palette Generator", "Font Pairing Guide", "Design Checklist"]
        }
      ],
      
      // Default modules for any other course
      'default': [
        {
          id: 1,
          title: "Course Introduction",
          description: "Get started with the course and understand the learning path.",
          duration: "1 hour",
          lessons: [
            "Welcome to the Course",
            "Course Overview",
            "Setting Up Your Environment",
            "Learning Resources"
          ],
          resources: ["Course Syllabus", "Resource List", "FAQ"]
        },
        {
          id: 2,
          title: "Core Concepts",
          description: "Master the fundamental concepts of the subject.",
          duration: "3 hours",
          lessons: [
            "Key Terminology",
            "Core Principles",
            "Practical Examples",
            "Hands-on Exercises"
          ],
          resources: ["Study Guide", "Practice Tests", "Reference Materials"]
        },
        {
          id: 3,
          title: "Advanced Topics",
          description: "Explore advanced concepts and real-world applications.",
          duration: "4 hours",
          lessons: [
            "Advanced Techniques",
            "Industry Best Practices",
            "Case Studies",
            "Project Work"
          ],
          resources: ["Advanced Guide", "Project Files", "Additional Reading"]
        }
      ]
    };
    
    return modulesMap[courseId] || modulesMap.default;
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.educationLevel) errors.educationLevel = 'Please select education level';
    return errors;
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setFormSubmitted(true);
      // Here you would typically send the data to your backend
      console.log('Registration submitted:', { ...formData, course: course.title });
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          educationLevel: '',
          heardAbout: '',
          message: ''
        });
      }, 3000);
    } else {
      setFormErrors(errors);
    }
  };

  const handleEnroll = (method) => {
    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <section className="container py-12 px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-400">Loading course details...</p>
        </div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="container py-12 px-4">
        <div className="text-center text-red-500 p-8 bg-red-500/10 rounded-lg">
          <p className="mb-4">Error: {error || 'Course not found'}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12 px-4 max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/courses')}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition group"
      >
        <span className="group-hover:-translate-x-1 transition">←</span> Back to Courses
      </motion.button>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${course.color || 'from-blue-600 to-purple-600'} rounded-2xl p-8 mb-8 relative overflow-hidden shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-6xl mb-4 block">{course.icon || '📚'}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-lg text-white/90 max-w-2xl">{course.description}</p>
            </div>
            <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
              {course.level}
            </span>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <p className="text-sm text-white/70">Duration</p>
                <p className="font-semibold">{course.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-sm text-white/70">Students</p>
                <p className="font-semibold">{course.students?.toLocaleString() || '500+'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm text-white/70">Rating</p>
                <p className="font-semibold">{course.rating || '4.8'} / 5.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-white/70">Price</p>
                <p className="font-semibold">₦{course.price?.toLocaleString() || '150,000'}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEnroll('full')}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition shadow-lg"
            >
              Pay Full Amount
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEnroll('installment')}
              className="px-8 py-3 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl font-semibold transition"
            >
              Pay in Installments
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Course Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">📖</span> 
            Course Curriculum
          </h2>
          
          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-6 text-left flex items-start justify-between hover:bg-white/5 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm font-medium">
                          Module {index + 1}
                        </span>
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <span>⏱️</span> {module.duration}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{module.title}</h3>
                      <p className="text-slate-300 text-sm">{module.description}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedModule === module.id ? 180 : 0 }}
                      className="text-2xl text-slate-400"
                    >
                      ▼
                    </motion.span>
                  </button>
                  
                  <AnimatePresence>
                    {expandedModule === module.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-6 space-y-6">
                          {/* Lessons */}
                          <div>
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <span>📚</span> Lessons ({module.lessons.length})
                            </h4>
                            <ul className="space-y-2">
                              {module.lessons.map((lesson, lIndex) => (
                                <li key={lIndex} className="flex items-center gap-3 text-sm text-slate-300">
                                  <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs">
                                    {lIndex + 1}
                                  </span>
                                  <span>{lesson}</span>
                                  <span className="ml-auto text-xs text-slate-500">📹 Video</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Resources */}
                          {module.resources && (
                            <div>
                              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📎</span> Resources
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {module.resources.map((resource, rIndex) => (
                                  <span key={rIndex} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400">
                                    📄 {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-xl p-12 text-center">
              <p className="text-slate-400">Course curriculum will be available soon.</p>
            </div>
          )}
        </motion.div>

        {/* Sidebar - Registration Form & Course Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Registration Form */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-white">Register for {course.title}</h3>
              <p className="text-sm text-slate-400 mt-1">Fill the form to secure your spot</p>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30"
              >
                <div className="text-4xl mb-3">✅</div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Registration Successful!</h4>
                <p className="text-sm text-slate-300">
                  Thank you for registering. Our team will contact you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border ${formErrors.fullName ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-blue-500 transition`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && <p className="text-xs text-red-400 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border ${formErrors.email ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-blue-500 transition`}
                    placeholder="you@example.com"
                  />
                  {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border ${formErrors.phone ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-blue-500 transition`}
                    placeholder="08012345678"
                  />
                  {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Education Level *
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border ${formErrors.educationLevel ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-blue-500 transition`}
                  >
                    <option value="">Select education level</option>
                    <option value="secondary">Secondary School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="working">Working Professional</option>
                  </select>
                  {formErrors.educationLevel && <p className="text-xs text-red-400 mt-1">{formErrors.educationLevel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition resize-none"
                    placeholder="Your address (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    name="heardAbout"
                    value={formData.heardAbout}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Colleague</option>
                    <option value="search">Search Engine</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                >
                  Register Now
                </motion.button>

                <p className="text-xs text-slate-500 text-center">
                  By registering, you agree to our terms and conditions
                </p>
              </form>
            )}
          </div>

          {/* Instructor Info */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>👨‍🏫</span> Instructor
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <div>
                <p className="font-semibold">{course.instructor || 'Expert Instructor'}</p>
                <p className="text-sm text-slate-400">{course.instructor_title || 'Industry Professional'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-slate-400">4.9 Instructor Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span> What You'll Learn
            </h3>
            <ul className="space-y-3">
              {(course.learning_outcomes || [
                'Master core concepts and techniques',
                'Build real-world projects',
                'Get hands-on experience with industry tools',
                'Learn from industry experts',
                'Receive certificate upon completion'
              ]).map((outcome, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-slate-300">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📋</span> Requirements
            </h3>
            <ul className="space-y-3">
              {(course.requirements || [
                'Basic computer knowledge',
                'Stable internet connection',
                'Laptop/Desktop computer',
                'Dedication to learn'
              ]).map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-400">•</span>
                  <span className="text-slate-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificate Badge */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h4 className="font-semibold text-white mb-1">Certificate of Completion</h4>
            <p className="text-xs text-slate-400">Earn a certificate upon completing this course</p>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <EnhancedPaymentModal 
        open={showPaymentModal}
        course={course}
        enrollmentMethod={selectedMethod}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedMethod(null);
        }}
      />
    </section>
  );
}