'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { generateEmailBody } from '@/lib/orderUtils';
import { MenuCategory } from '@/lib/menuData';

interface ContactActionsProps {
  title: string;
  menuData: MenuCategory[];
}

export const ContactActions: React.FC<ContactActionsProps> = ({ title, menuData }) => {
  const handleEmailUs = () => {
    const emailBody = generateEmailBody(title, menuData);
    const subject = encodeURIComponent(`Banquet Order: ${title}`);
    const body = encodeURIComponent(emailBody);
    
    // Create mailto link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
  };

  const handleMessenger = () => {
    // Replace with actual Facebook page username
    const messengerUrl = 'https://m.me/YOUR_FACEBOOK_PAGE_USERNAME';
    window.open(messengerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    const message = generateEmailBody(title, menuData);
    const encodedMessage = encodeURIComponent(message);
    // Replace with actual WhatsApp number (format: 1234567890)
    const whatsappUrl = `https://wa.me/1234567890?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneCall = () => {
    // Replace with actual phone number
    window.location.href = 'tel:+1234567890';
  };

  return (
    <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Contact Us for Your Order</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Ready to place your order? Contact us through any of these convenient methods:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button
          onClick={handleEmailUs}
          className="flex items-center justify-center gap-2 h-12"
          variant="default"
        >
          <span className="text-lg">✉️</span>
          Email Us
        </Button>
        
        <Button
          onClick={handleMessenger}
          className="flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <span className="text-lg">💬</span>
          Messenger
        </Button>
        
        <Button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 h-12 bg-green-600 hover:bg-green-700 text-white"
        >
          <span className="text-lg">📱</span>
          WhatsApp
        </Button>
        
        <Button
          onClick={handlePhoneCall}
          className="flex items-center justify-center gap-2 h-12"
          variant="outline"
        >
          <span className="text-lg">📞</span>
          Call Us
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>• Email: Opens your default email client with order details</p>
        <p>• Messenger: Direct link to our Facebook page (update link in settings)</p>
        <p>• WhatsApp: Send order via WhatsApp (update number in settings)</p>
        <p>• Phone: Direct call to place your order (update number in settings)</p>
      </div>
    </div>
  );
};