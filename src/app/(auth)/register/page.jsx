"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Must Select Role"),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful!");
        resetForm();
        router.push("/login");
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      setMessage("An error occurred.");
    }
    setLoading(false);
    setSubmitting(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded-lg" style={{ width: "400px",height:"480px", backgroundColor: "#ffff" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form >
            <div className="from-group mt-[40px]">
              <h2 className="fw-bold text-primary text-center mb-4 ">
                Register
              </h2>
            </div>
            <div className="form-group mt-2 mb-3">
              <Field
                name="name"
                placeholder="Username"
                type="text"
                className="form-control w-100 bg-white"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger text-sm"
              />
            </div>

            <div className="form-group mt-2 mb-3">
              <Field
                name="email"
                placeholder="Email"
                type="email"
                className="form-control w-100 bg-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger text-sm"
              />
            </div>

            <div className="form-group mt-2 mb-3">
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="form-control w-100 bg-white"
              ></Field>
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger text-sm"
              />
            </div>

            <div className="form-group mt-2 mb-3">
              <Field
                as="select"
                name="role"
                className="form-select w-100 bg-white"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-danger text-sm"
              />
            </div>

            <div className="d-flex justify-content-center align-items-center mt-4 mb-4 gap-2">
              <p className="mb-0 text-primary">Already have an account?</p>
              <a href="/login" className="custom-link" style={{ color: '#3b82f6' }}>
                Login
              </a>
            </div>

            <style jsx>{`
                .custom-link {
                    text-decoration: none;
                    font-weight: 500;
                }
                .custom-link:hover {
                  text-decoration: underline;
                }
              `}
            </style>


            <button
              className="btn btn-lg btn-primary w-100  "
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {message && (
              <p className="text-center  text-danger mt-2">{message}</p>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
}
