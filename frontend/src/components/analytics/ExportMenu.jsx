import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportPDF = async () => {
    setIsOpen(false);
    const element = document.getElementById('analytics-dashboard');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('analytics-report.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  const handleExportCSV = () => {
    setIsOpen(false);
    // In a real app, you would fetch CSV data from the backend or parse Redux state
    const csvContent = "data:text/csv;charset=utf-8,Type,Count\nPage Views,100\nClicks,50";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-none flex items-center space-x-2 transition-colors"
      >
        <span>Export</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-none  border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <button 
                onClick={handleExportPDF}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                Export as PDF
              </button>
            </li>
            <li>
              <button 
                onClick={handleExportCSV}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                Export Summary to CSV
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
