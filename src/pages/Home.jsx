import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  CheckCircle2,
  HeartPulse,
  Eye,
  Smile
} from 'lucide-react';

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const services = [
    { title: "Teeth Cleaning & Polishing", icon: Smile },
    { title: "Tooth Fillings", icon: CheckCircle2 },
    { title: "Cosmetic Dentistry", icon: Sparkles },
    { title: "Root Canal Treatment", icon: Activity },
    { title: "Dental Implants", icon: ShieldCheck },
    { title: "Orthodontic Braces", icon: Smile },
    { title: "Tooth Extraction", icon: Activity },
    { title: "Smile Designing & Whitening", icon: Sparkles },
    { title: "Preventive Dental Care", icon: HeartPulse }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* TOP HEADER / TAGLINE BAR */}
      <header className="bg-[#0b1f4d] text-white py-3 px-4 text-center text-xs md:text-sm font-medium tracking-wider uppercase">
        Better Vision · Brighter Smile · Better Life
      </header>

      {/* NAVIGATION / LOGO SECTION */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-[#0b1f4d]">
              <Eye className="w-8 h-8 text-blue-600 mr-1" />
              <Smile className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-[#0b1f4d] block leading-none">
                SINGH
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-700 uppercase">
                Eye and Dental Care Centre
              </span>
            </div>
          </div>

          {/* Quick Contact CTA Button */}
          <a 
            href="tel:8477064481" 
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 text-sm font-semibold"
          >
            <Phone className="w-4 h-4 animate-bounce" style={{color:"white"}}/>
            <span style={{color:"white"}}>8477064481</span>
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              className="lg:col-span-7 space-y-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span>Your Vision. Your Smile. Our Care.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0b1f4d] tracking-tight leading-none">
                WE CARE FOR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
                  YOUR VISION & YOUR SMILE
                </span>
              </h1>

              <p className="text-lg font-semibold text-slate-600 uppercase tracking-wide">
                Because You Deserve The Best
              </p>

              <p className="text-slate-600 text-base leading-relaxed max-w-xl">
                At <strong>Singh Eye and Dental Care Centre</strong>, we combine advanced technology, experienced hands, and a patient-first approach to give you the best eye and dental care under one roof.
              </p>

              {/* Highlights pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Eye className="w-5 h-5"/></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">EYE CARE</h4>
                    <p className="text-[10px] text-slate-500">Clear Vision, Better Life</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Smile className="w-5 h-5"/></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">DENTAL CARE</h4>
                    <p className="text-[10px] text-slate-500">Healthy Smile, Happy Life</p>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Right Doctor Profile Card */}
            <motion.div 
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#0b1f4d] text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider z-10">
                  Expert Care
                </div>
                
                {/* Doctor Visual placeholder/representation mimicking the poster */}
                <div className="h-64 bg-gradient-to-tr from-blue-900 to-blue-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="text-center p-6 text-white relative z-10">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-3 shadow-inner">
                      <Smile className="w-12 h-12 text-sky-300" />
                    </div>
                    <span className="text-xs tracking-widest text-sky-300 font-bold uppercase">Trusted Specialist</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-[#0b1f4d]">DR. TEJINDAR SINGH</h3>
                    <p className="text-blue-600 font-bold text-sm tracking-wide">DENTIST</p>
                  </div>
                  
                  <hr className="border-slate-100" />
                  
                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">BDS | Cosmetic & Restorative Dentist</p>
                    <p>Gentle care. Advanced treatment. Healthier smiles.</p>
                  </div>

                  <div className="pt-2">
                    <a 
                      href="tel:8477064481"
                      className="block w-full py-3 bg-[#0b1f4d] hover:bg-blue-900 text-white text-center rounded-xl font-bold transition-all shadow-md" style={{color:"white"}}
                    >
                      Book Appointment
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 bg-slate-100/60 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase">Comprehensive Healthcare</h2>
            <h3 className="text-3xl font-black text-[#0b1f4d]">OUR SERVICES</h3>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex items-center space-x-4 group"
                >
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">{service.title}</h4>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* FEATURES / BADGES STRIP */}
      <section className="bg-[#0b1f4d] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-2 p-4">
              <ShieldCheck className="w-10 h-10 text-sky-400" />
              <h4 className="font-bold text-lg">ADVANCED TECHNOLOGY</h4>
              <p className="text-xs text-slate-300">State-of-the-art diagnostic and treatment tools</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-4 border-y md:border-y-0 md:border-x border-blue-900">
              <HeartPulse className="w-10 h-10 text-sky-400" />
              <h4 className="font-bold text-lg">PAINLESS TREATMENT</h4>
              <p className="text-xs text-slate-300">Patient comfort focused specialized care</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-4">
              <ShieldCheck className="w-10 h-10 text-sky-400" />
              <h4 className="font-bold text-lg">HYGIENIC & SAFE ENVIRONMENT</h4>
              <p className="text-xs text-slate-300">Strict sterilization protocols followed</p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER / CONTACT INFO */}
      <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            
            {/* Brand Col */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-6 h-6 text-blue-500" />
                <Smile className="w-6 h-6 text-sky-400" />
                <span className="text-lg font-black tracking-wider">SINGH EYE & DENTAL</span>
              </div>
              <p className="text-xs text-slate-400">
                ONE CENTRE FOR COMPLETE EYE & DENTAL CARE. Dedicated to providing compassionate, trusted, and top-tier family health solutions.
              </p>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold tracking-widest uppercase text-sky-400">Location</h4>
              <div className="flex items-start space-x-3 text-slate-300 text-sm">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Near Gurudwara, Punjabi Colony, Jaspur</span>
              </div>
            </div>

            {/* Contact & Socials */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold tracking-widest uppercase text-sky-400">For Appointment Call</h4>
              <a href="tel:8477064481" className="inline-flex items-center space-x-2 text-xl font-black text-white hover:text-sky-400 transition-colors">
                <Phone className="w-5 h-5 text-blue-500" />
                <span>8477064481</span>
              </a>

              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Follow Us</p>
                <div className="flex space-x-3">
                  <a href="#facebook" className="p-2 bg-slate-800 hover:bg-blue-600 rounded-full transition-colors text-white"><Facebook className="w-4 h-4"/></a>
                  <a href="#instagram" className="p-2 bg-slate-800 hover:bg-pink-600 rounded-full transition-colors text-white"><Instagram className="w-4 h-4"/></a>
                  <a href="#whatsapp" className="p-2 bg-slate-800 hover:bg-emerald-600 rounded-full transition-colors text-white"><MessageCircle className="w-4 h-4"/></a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Singh Eye and Dental Care Centre. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}