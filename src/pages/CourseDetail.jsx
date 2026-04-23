// pages/CourseDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch course details
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
      
      // Fetch course modules
      const modulesData = await courseService.getCourseModules(id);
      setModules(modulesData || []);
      
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
    <section className="container py-12 px-4">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/courses')}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <span>←</span> Back to Courses
      </motion.button>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${course.color || 'from-blue-600 to-purple-600'} rounded-xl p-8 mb-8 relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-6xl mb-4 block">{course.icon || '📚'}</span>
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-xl text-white/90 mb-4">{course.description}</p>
            </div>
            <span className="px-4 py-2 bg-white/20 rounded-full text-lg font-medium">
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
                <p className="font-semibold">{course.students?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm text-white/70">Rating</p>
                <p className="font-semibold">{course.rating} / 5.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-white/70">Price</p>
                <p className="font-semibold">₦{course.price?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEnroll('full')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition"
            >
              Pay Full Amount
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEnroll('installment')}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition"
            >
              Pay in Installments
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content - Course Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
          
          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      Module {index + 1}: {module.title}
                    </h3>
                    <span className="text-sm text-slate-400">{module.duration}</span>
                  </div>
                  <p className="text-slate-300 mb-3">{module.description}</p>
                  
                  {/* Lessons */}
                  {module.lessons && (
                    <div className="space-y-2 mt-4">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lIndex} className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <p className="text-slate-400">Course curriculum will be available soon.</p>
            </div>
          )}
        </motion.div>

        {/* Sidebar - Course Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Instructor Info */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Instructor</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <div>
                <p className="font-semibold">{course.instructor || 'Course Instructor'}</p>
                <p className="text-sm text-slate-400">{course.instructor_title || 'Expert Instructor'}</p>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
            <ul className="space-y-3">
              {(course.learning_outcomes || [
                'Master core concepts',
                'Build real-world projects',
                'Get hands-on experience',
                'Industry best practices'
              ]).map((outcome, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <ul className="space-y-3">
              {(course.requirements || [
                'Basic computer skills',
                'Internet connection',
                'Dedication to learn'
              ]).map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-400">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
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