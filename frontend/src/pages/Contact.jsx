import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackApi } from '../services/feedbackApi';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await feedbackApi.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact Error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFB] py-8 px-6 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans'] min-h-[calc(100vh-70px)]">
      
      <div className="w-full max-w-[700px]">
        <div className="text-center mb-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#E76F51] uppercase mb-2">The Support</p>
          <h1 className="text-4xl md:text-5xl text-[#1D4D4F] font-black tracking-tight mb-2">Contact Us</h1>
          <p className="text-slate-500 font-medium text-sm">Have questions, feedback, or need support? Drop us a message.</p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-12 bg-white border border-slate-100 rounded-[2rem] shadow-xl"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-inner">
                <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
              </div>
              <h2 className="text-3xl font-black text-[#1D4D4F] mb-3 tracking-tight">Message Sent</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[400px] mx-auto font-medium">
                Thank you for reaching out to MindRest. Our support team will get back to you shortly regarding your digital sanctuary experience.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 px-8 py-3 bg-slate-50 border border-slate-100 text-[#1D4D4F] rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#1D4D4F] hover:text-white transition-colors shadow-sm"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(29,77,79,0.06)] border border-white flex flex-col gap-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="John Doe" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#fcfdfd] border border-slate-200 py-2.5 px-4 text-[#1D4D4F] focus:outline-none focus:border-[#1D4D4F] focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,77,79,0.1)] transition-all rounded-[0.85rem] text-sm font-medium placeholder-slate-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-1.5">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="john@example.com" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#fcfdfd] border border-slate-200 py-2.5 px-4 text-[#1D4D4F] focus:outline-none focus:border-[#1D4D4F] focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,77,79,0.1)] transition-all rounded-[0.85rem] text-sm font-medium placeholder-slate-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-1.5">Subject</label>
                <input 
                  required 
                  type="text" 
                  placeholder="How can we help?" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#fcfdfd] border border-slate-200 py-2.5 px-4 text-[#1D4D4F] focus:outline-none focus:border-[#1D4D4F] focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,77,79,0.1)] transition-all rounded-[0.85rem] text-sm font-medium placeholder-slate-300"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-1.5">Your Message</label>
                <textarea 
                  required 
                  rows="3" 
                  placeholder="Write your message here..." 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#fcfdfd] border border-slate-200 py-2.5 px-4 text-[#1D4D4F] focus:outline-none focus:border-[#1D4D4F] focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,77,79,0.1)] transition-all resize-none rounded-[0.85rem] text-sm font-medium placeholder-slate-300"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-2 bg-[#1D4D4F] text-white py-3.5 rounded-[1rem] font-bold uppercase tracking-widest text-xs hover:bg-[#E76F51] border border-transparent hover:border-[#E76F51] transition-all shadow-[0_10px_30px_rgba(29,77,79,0.2)] hover:shadow-[0_10px_30px_rgba(231,111,81,0.3)] w-full focus:outline-none disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
