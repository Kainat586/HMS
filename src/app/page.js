"use client";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white "
      style={{ color: "#1e3a8a" }}>


      <nav className="navbar bg-white shadow-md py-3">
        <div className="container-fluid d-flex  align-items-center">
         
          <a className="navbar-brand fw-bold text-primary fs-4 ml-5" href="/">
            🏥 HMS
          </a>

          
          <ul class="navbar-nav d-flex justify-content-between flex-row gap-4">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
            <li className="nav-item">
              <a
                className="btn btn-primary text-white rounded-pill px-4"
                href="/login"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </nav>


      <section
        className="position-relative text-white d-flex align-items-center"
        style={{
          backgroundImage: "url('/host.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
        }}
      >
        {/* Gradient Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
            zIndex: 1,
          }}
        ></div>

        {/* Content */}
        <div className="container position-relative text-center text-md-start" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1
                className="display-4 fw-bold mb-3"
                style={{
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  lineHeight: "1.2",
                }}
              >
                Hospital Management System
              </h1>
              <p
                className="lead mb-4"
                style={{ opacity: 0.85, fontSize: "1.2rem", maxWidth: "500px" }}
              >
                A complete solution to manage patients, doctors, appointments,
                and medical records seamlessly in one place.
              </p>
              <a
                href="/register"
                className="btn btn-light btn-lg rounded-pill shadow"
                style={{
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.6)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
                }}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* ✅ About Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
          About <span className="text-blue-600">Our System</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our{" "}
              <span className="font-semibold text-blue-600">
                Hospital Management System (HMS)
              </span>{" "}
              is more than software — it’s a modern solution designed to bring
              efficiency and innovation to hospitals and clinics.
            </p>

            <p className="text-base text-gray-600 leading-relaxed">
              From{" "}
              <span className="font-medium">scheduling appointments</span>,
              maintaining <span className="font-medium">patient records</span>,
              managing <span className="font-medium">doctors</span>, to{" "}
              <span className="font-medium">billing and reporting</span> – all
              features are integrated into a sleek, user-friendly platform.
            </p>

            <p className="text-base text-gray-600 leading-relaxed italic">
              With HMS, healthcare providers can focus more on patients and less
              on paperwork.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <Image
              src="/download.jpeg"
              alt="About Hospital"
              width={500}
              height={270}
              className="rounded-2xl mt-10 shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14">
            Key <span className="text-blue-600">Features</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: "👩‍⚕️",
                title: "Doctor Management",
                desc: "Manage doctor profiles, specialties, and availability.",
              },
              {
                icon: "🧑‍🤝‍🧑",
                title: "Patient Records",
                desc: "Store and access patient medical history securely.",
              },
              {
                icon: "📅",
                title: "Appointments",
                desc: "Easy scheduling and tracking of appointments.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-white/70 backdrop-blur-md border rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-6xl">{feature.icon}</span>
                <h3 className="text-2xl font-semibold mt-4">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Why Choose Us Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-8">
            Why <span className="text-blue-600">Choose Us?</span>
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            With powerful tools and a modern interface, our HMS improves
            efficiency, reduces paperwork, and ensures better healthcare
            delivery.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "✅ Secure",
                desc: "Advanced data protection & HIPAA compliance.",
              },
              {
                title: "✅ Efficient",
                desc: "Save valuable time for both staff and patients.",
              },
              {
                title: "✅ Scalable",
                desc: "Perfect for clinics, hospitals, and healthcare chains.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold text-lg">Hospital Management System</h3>
            <p className="text-sm mt-2 opacity-80">
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Contact Us</h3>
            <p className="text-sm opacity-90">📍 Lahore, Pakistan</p>
            <p className="text-sm opacity-90">📧 info@hospital.com</p>
            <p className="text-sm opacity-90">📞 +92 300 1234567</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
