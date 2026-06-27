import React from 'react';
import { Mail, Phone, Building, Briefcase, MapPin, Globe, Linkedin, Twitter, Github, X } from 'lucide-react';

const ContactProfile = ({ contact, onClose }) => {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 h-full shadow-2xl overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6">
          <div className="flex items-center space-x-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{contact.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <Briefcase className="w-4 h-4 mr-2" />
                {contact.jobTitle || 'No Job Title'}
              </p>
              <div className="flex items-center mt-3 space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  contact.lifecycleStage === 'CUSTOMER' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                }`}>
                  {contact.lifecycleStage || 'LEAD'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {contact.status || 'NEW'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</div>
              <a href={`mailto:${contact.email}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</div>
                <a href={`tel:${contact.phone}`} className="text-gray-900 dark:text-white font-medium hover:underline flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.companyId && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 md:col-span-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Company</div>
                <div className="text-gray-900 dark:text-white font-medium flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {contact.companyId.name}
                </div>
              </div>
            )}
          </div>

          {/* Message / Bio */}
          {contact.message && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Initial Message</h3>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                {contact.message}
              </div>
            </div>
          )}

          {/* Socials */}
          {contact.socialLinks && Object.values(contact.socialLinks).some(Boolean) && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Social Links</h3>
              <div className="flex space-x-3">
                {contact.socialLinks.linkedin && (
                  <a href={contact.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {contact.socialLinks.twitter && (
                  <a href={contact.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {contact.socialLinks.github && (
                  <a href={contact.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
