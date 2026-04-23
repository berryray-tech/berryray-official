import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CourseDetail from './pages/CourseDetail';

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Teams from "./pages/Teams"; 
import Courses from "./pages/Courses";
import Portfolio from "./pages/Portfolio";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact"; 

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
                <Navbar />
                <main className="pt-16 md:pt-20">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/teams" element={<Teams />} /> {/* ✅ ADDED THIS LINE */}
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:id" element={<CourseDetail />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/shop/:id" element={<ProductDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        
                        {/* Admin Login Route (Publicly accessible) */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        
                        {/* Protected Admin Route */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Catch-all route - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}