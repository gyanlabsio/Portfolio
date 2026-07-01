import React, { useEffect, useState } from 'react';
import api from '../../api';

const MergeDuplicates = () => {
  const [duplicates, setDuplicates] = useState({ emailDuplicates: [], phoneDuplicates: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDuplicates = async () => {
      try {
        const res = await api.get('/crm/contacts/duplicates');
        setDuplicates(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDuplicates();
  }, []);

  if (loading) return <div>Loading duplicates...</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-none ">
      <h2 className="text-xl font-bold mb-6">Duplicate Detection</h2>
      
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Email Duplicates</h3>
      {duplicates.emailDuplicates.length === 0 ? (
        <p className="text-gray-500 mb-8">No email duplicates found.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {duplicates.emailDuplicates.map((dup, i) => (
            <div key={i} className="p-4 border rounded-none dark:border-gray-700">
              <span className="font-medium">{dup._id}</span> ({dup.count} contacts)
              <button className="ml-4 text-blue-600 hover:underline">Review & Merge</button>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Phone Duplicates</h3>
      {duplicates.phoneDuplicates.length === 0 ? (
        <p className="text-gray-500">No phone duplicates found.</p>
      ) : (
        <div className="space-y-4">
          {duplicates.phoneDuplicates.map((dup, i) => (
            <div key={i} className="p-4 border rounded-none dark:border-gray-700">
              <span className="font-medium">{dup._id}</span> ({dup.count} contacts)
              <button className="ml-4 text-blue-600 hover:underline">Review & Merge</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MergeDuplicates;
