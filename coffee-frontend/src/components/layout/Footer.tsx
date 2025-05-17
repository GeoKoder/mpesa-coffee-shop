const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">Coffee Kiosk</h3>
            <p className="text-gray-600 mt-2">The best coffee, delivered to your doorstep.</p>
          </div>
          <div>
            <h4 className="text-gray-800 font-medium">Connect With Us</h4>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-600 hover:text-primary">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Coffee Kiosk. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
