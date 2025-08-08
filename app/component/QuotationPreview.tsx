'use client';

import { useRef } from 'react';
import PrintableQuotation from './PrintableQuotation';

type Props = {
  quotation: any;
  originalQuotation?: any;
  isRevision?: boolean; // New prop to indicate this is a revision preview
  onBack?: () => void;
};

export default function QuotationPreview({ 
  quotation, 
  originalQuotation, 
  isRevision = false, 
  onBack 
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quotation ${quotation.refNo}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
              }
              @page { 
                size: A4; 
                margin: 10mm; 
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
              }
              .signature { 
                margin-top: 60px; 
                display: flex; 
                justify-content: space-between; 
              }
              .signature-line { 
                border-top: 1px solid #000; 
                width: 200px; 
                text-align: center; 
              }
              /* Revision banner */
              .revision-banner {
                background-color: #f8d7da;
                color: #721c24;
                padding: 10px;
                text-align: center;
                border-radius: 4px;
                margin-bottom: 20px;
                border: 1px solid #f5c6cb;
                font-weight: bold;
              }
              /* Header section */
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
              }
              /* Logo section */
              .logo-section {
                width: 100px;
              }
              .logo-img {
                width: 200px;
                height: auto;
              }
              /* Reference section */
              .ref-section {
                text-align: right;
              }
              .original-ref {
                font-size: 0.9em;
                color: #6c757d;
              }
              @media print {
                .header-container {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .ref-section {
                  text-align: right !important;
                }
                .revision-banner {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${isRevision ? `<div class="revision-banner">REVISED QUOTATION - DRAFT</div>` : ''}
            <div class="header-container">
              <div class="logo-section">
                <img src="logo.png" alt="Company Logo" class="logo-img">
              </div>
              <div class="ref-section">
                <p><strong>Reference No:</strong> ${quotation.refNo}</p>
                <p><strong>Date:</strong> ${quotation.date}</p>
                ${isRevision && originalQuotation ? 
                  `<p class="original-ref"><strong>Original Ref:</strong> ${originalQuotation.refNo}</p>` : ''}
              </div>
            </div>
            <div>
              ${printRef.current.innerHTML}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 200);
    } else {
      // Fallback if popup is blocked
      window.print();
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        {onBack && (
          <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">
            ← Back
          </button>
        )}
        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded">
          🖨 Print
        </button>
      </div>
      <div ref={printRef}>
        {isRevision && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-center font-bold">
            REVISED QUOTATION - DRAFT
          </div>
        )}
        {isRevision && originalQuotation && (
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold">Original Reference:</span> {originalQuotation.refNo}
          </p>
        )}
        <PrintableQuotation quotation={quotation} />
      </div>
    </div>
  );
}