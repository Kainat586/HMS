export default function AuthLayout({ children }) {
  return (
    <div
      className="vh-100 vw-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/host.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)", 
        }}
      >
        {children}
      </div>
    </div>
  );
}
