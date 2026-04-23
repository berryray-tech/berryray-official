// pages/Courses.jsx (updated version)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedPaymentModal from "../components/EnhancedPaymentModal";
import { courseService } from "../services/courseService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [enrollmentMethod, setEnrollmentMethod] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from Supabase
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🚀 Fetching courses from Supabase...");
      const data = await courseService.getAllCourses();
      
      if (data && data.length > 0) {
        console.log("✅ Courses loaded:", data);
        setCourses(data);
      } else {
        console.log("⚠️ No courses found");
        setCourses([]);
      }
      
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "all" || course.level?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEnrollClick = (course, method, e) => {
    e.stopPropagation();
    setEnrollmentMethod(method);
    setSelected(course);
  };

  const levels = ["all", "beginner", "intermediate", "advanced"];

  if (loading) {
    return (
      <section className="container py-12 px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-400">Loading courses...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-12 px-4">
        <div className="text-center text-red-500 p-8 bg-red-500/10 rounded-lg">
          <p className="mb-4">Error: {error}</p>
          <button 
            onClick={fetchCourses}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12 px-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Our Courses
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          {courses.length > 0 
            ? `Choose from our ${courses.length} comprehensive courses`
            : "No courses available"}
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition text-white placeholder-slate-400"
        />
        
        <div className="flex gap-2 flex-wrap">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                filter === level
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.article
                key={course.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5 }}
                className="relative group cursor-pointer"
                onClick={() => setSelected(course)}
              >
                {/* Animated Course Card */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                  style={{
                    background: course.color ? `linear-gradient(135deg, ${course.color.split(' ')[1]}, ${course.color.split(' ')[3]})` : 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                  }}
                />
                
                <div className={`relative bg-gradient-to-br ${course.color || 'from-blue-500 to-purple-600'} p-6 rounded-xl overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                  
                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{course.icon || '📚'}</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {course.level || 'Beginner'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-white/80 mb-4">{course.description}</p>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                      <span>⏱️ {course.duration || 'N/A'}</span>
                      <span>👥 {course.students_count?.toLocaleString() || 0}</span>
                      <span>⭐ {course.rating || 0}</span>
                    </div>

                    {/* Price and Enrollment */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">₦{course.price?.toLocaleString() || 0}</span>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleEnrollClick(course, "full", e)}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
                        >
                          Pay Full
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleEnrollClick(course, "installment", e)}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
                        >
                          Installment
                        </motion.button>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <Link 
                        to={`/courses/${course.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-white/80 hover:text-white transition flex items-center gap-1"
                      >
                        View full details
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-400 text-lg">No courses available.</p>
        </motion.div>
      )}

      {/* Empty State for filtered results */}
      {courses.length > 0 && filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-400 text-lg">No courses found matching your criteria.</p>
        </motion.div>
      )}

      {/* Payment Modal */}
      <EnhancedPaymentModal 
        open={!!selected} 
        course={selected} 
        enrollmentMethod={enrollmentMethod}
        onClose={() => {
          setSelected(null);
          setEnrollmentMethod(null);
        }} 
      />
    </section>
  );
}