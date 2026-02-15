const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3">Pizza Paradise</h3>
            <p className="text-gray-400 text-sm">
              Serving the finest pizzas since 2024. Made with love, delivered with care.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📞 (555) 123-4567</li>
              <li>📧 info@pizzaparadise.com</li>
              <li>📍 123 Pizza Street, Food City</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-3">Hours</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Monday - Friday: 11am - 11pm</li>
              <li>Saturday - Sunday: 11am - 12am</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Pizza Paradise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
