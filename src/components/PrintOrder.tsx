'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSelectedItems, getTotalSelectedItems } from '@/lib/orderUtils';
import { MenuCategory } from '@/lib/menuData';

interface PrintOrderProps {
  title: string;
  menuData: MenuCategory[];
}

export const PrintOrder: React.FC<PrintOrderProps> = ({ title, menuData }) => {
  const selectedItems = getSelectedItems(menuData);
  const totalItems = getTotalSelectedItems(menuData);

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Banquet Order - ${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            color: #2c3e50;
          }
          .order-info {
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          .order-info p {
            margin: 5px 0;
            font-weight: bold;
          }
          .category {
            margin-bottom: 25px;
            break-inside: avoid;
          }
          .category h3 {
            color: #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-size: 18px;
          }
          .category ul {
            margin: 0;
            padding-left: 20px;
          }
          .category li {
            margin-bottom: 5px;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #ecf0f1;
            padding-top: 20px;
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
        </div>
        
        <div class="order-info">
          <p>Order Date: ${new Date().toLocaleDateString()}</p>
          <p>Total Items Selected: ${totalItems}</p>
        </div>
        
        <div class="order-details">
          ${selectedItems.map(category => `
            <div class="category">
              <h3>${category.categoryTitle}</h3>
              <ul>
                ${category.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Please confirm availability and pricing with our staff</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      // Close window after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  };

  const handleDownloadText = () => {
    let textContent = `${title}\n`;
    textContent += '='.repeat(title.length) + '\n\n';
    textContent += `Order Date: ${new Date().toLocaleDateString()}\n`;
    textContent += `Total Items Selected: ${totalItems}\n\n`;
    textContent += 'ORDER DETAILS:\n';
    textContent += '-'.repeat(50) + '\n\n';
    
    selectedItems.forEach(category => {
      textContent += `${category.categoryTitle}:\n`;
      category.items.forEach(item => {
        textContent += `  • ${item}\n`;
      });
      textContent += '\n';
    });
    
    textContent += '-'.repeat(50) + '\n';
    textContent += `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
    textContent += 'Please confirm availability and pricing with our staff';

    // Create and download file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `banquet-order-${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (totalItems === 0) {
    return (
      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">
          Select menu items to enable print and export options
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{totalItems} items selected</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} categories
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <span className="text-lg">🖨️</span>
          Print Order
        </Button>
        <Button onClick={handleDownloadText} variant="outline" className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          Download as Text
        </Button>
      </div>

      <div className="space-y-3 max-h-40 overflow-y-auto">
        {selectedItems.map((category, index) => (
          <div key={index} className="text-sm">
            <h4 className="font-medium text-foreground mb-1">{category.categoryTitle}</h4>
            <div className="text-muted-foreground">
              {category.items.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};