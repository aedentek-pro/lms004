import React from 'react';
import { WhatsAppIcon } from '../icons/Icons';

interface WhatsAppFloatProps {
    position: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ position }) => {
  // Replace with your actual phone number (including country code, without + or spaces)
  const phoneNumber = '1234567890'; 
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      className={`fixed z-50 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 ${position}`}
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8" />
    </a>
  );
};