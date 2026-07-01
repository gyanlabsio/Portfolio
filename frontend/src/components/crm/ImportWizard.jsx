import React from 'react';

const ImportWizard = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-none ">
      <h2 className="text-xl font-bold mb-4">Import Contacts</h2>
      <p className="text-gray-500 mb-6">Upload a CSV file to import contacts in bulk.</p>
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-none p-12 text-center">
        <input type="file" accept=".csv" className="hidden" id="csv-upload" />
        <label htmlFor="csv-upload" className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-none font-semibold hover:bg-blue-700 transition-colors">
          Select CSV File
        </label>
        <p className="mt-4 text-sm text-gray-500">or drag and drop it here</p>
      </div>
    </div>
  );
};

export default ImportWizard;
