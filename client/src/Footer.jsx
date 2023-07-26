import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-500 text-white py-2 flex items-center justify-center max-w-full w-full">
            <p>&copy; Travelago {currentYear}</p>
        </footer>
    );
};

export default Footer;
