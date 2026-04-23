// services/courseService.js
import { supabase } from '../lib/supabase'
const data = await supabase.from('courses').select('*')

export const courseService = {
  // Get all courses
  async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get single course by ID
  async getCourseById(id) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get course modules/lessons
  async getCourseModules(courseId) {
    const { data, error } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create enrollment
  async createEnrollment(enrollmentData) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert([{
        ...enrollmentData,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create payment record
  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        ...paymentData,
        payment_status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update enrollment status after payment
  async updateEnrollmentStatus(enrollmentId, status) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};