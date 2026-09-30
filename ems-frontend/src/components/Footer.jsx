export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-left">
        © {currentYear} EMS Portal. All rights reserved.
      </div>

      <div className="footer-right">
        <span>Employee Management System</span>
        <span className="footer-separator">|</span>
        <span>v1.0.0</span>
      </div>
    </footer>
  );
}