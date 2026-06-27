import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Upload, Users, Download, Filter } from 'lucide-react';
import api from '../../api';
import { setContacts, setLoading, setSelectedContact } from '../../store/slices/crmSlice';
import CrmTable from '../../components/crm/CrmTable';
import ContactProfile from '../../components/crm/ContactProfile';
import ImportWizard from '../../components/crm/ImportWizard';
import MergeDuplicates from '../../components/crm/MergeDuplicates';

const ContactsAdmin = () => {
  const dispatch = useDispatch();
  const { contacts, loading, total, selectedContact } = useSelector((state) => state.crm);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'import', 'duplicates'

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const fetchContacts = async () => {
    dispatch(setLoading(true));
    try {
      const res = await api.get('/crm/contacts');
      dispatch(setContacts(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            CRM Contacts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage {total} contacts, relationships, and activities.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
          >
            All Contacts
          </button>
          <button 
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'import' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
          >
            Import
          </button>
          <button 
            onClick={() => setActiveTab('duplicates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'duplicates' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
          >
            Find Duplicates
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading contacts...</div>
          ) : (
            <CrmTable 
              contacts={contacts} 
              onSelectContact={(contact) => dispatch(setSelectedContact(contact))} 
            />
          )}
        </>
      )}

      {activeTab === 'import' && <ImportWizard />}
      {activeTab === 'duplicates' && <MergeDuplicates />}

      {/* Slide-over Profile Panel */}
      {selectedContact && (
        <ContactProfile 
          contact={selectedContact} 
          onClose={() => dispatch(setSelectedContact(null))} 
        />
      )}
    </div>
  );
};

export default ContactsAdmin;
