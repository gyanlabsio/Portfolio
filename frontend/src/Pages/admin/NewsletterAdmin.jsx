import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewsletters, saveNewsletter, sendNewsletter, deleteNewsletter } from '../../store/slices/newsletterSlice';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Mail, Edit, Trash2, Send, Plus, X } from 'lucide-react';

const NewsletterAdmin = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.newsletter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({ name: '', subject: '', bodyHtml: '' });

  useEffect(() => {
    dispatch(fetchNewsletters());
  }, [dispatch]);

  const handleSave = async (e) => {
    e.preventDefault();
    await dispatch(saveNewsletter(currentTemplate));
    setIsModalOpen(false);
    setCurrentTemplate({ name: '', subject: '', bodyHtml: '' });
  };

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(deleteNewsletter(id));
    }
  };

  const handleSend = (id) => {
    if (window.confirm('Are you sure you want to send this newsletter to ALL active subscribers?')) {
      dispatch(sendNewsletter(id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Builder</h1>
          <p className="text-gray-500 mt-2">Design and blast emails to your subscribers.</p>
        </div>
        <button
          onClick={() => {
            setCurrentTemplate({ name: '', subject: '', bodyHtml: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Create Template
        </button>
      </div>

      {loading && !list.length ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-none"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(template => (
            <div key={template._id} className="bg-white border rounded-none  overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-none ${template.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {template.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Subject: {template.subject}</p>
                {template.status === 'sent' && (
                  <p className="text-xs text-gray-500">Sent to {template.sentCount} subscribers on {new Date(template.sentAt).toLocaleDateString()}</p>
                )}
              </div>
              <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
                {template.status !== 'sent' && (
                  <>
                    <button onClick={() => handleEdit(template)} className="p-2 text-gray-600 hover:text-blue-600 transition bg-white border rounded ">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleSend(template._id)} className="p-2 text-white hover:bg-green-700 transition bg-green-600 rounded  flex items-center">
                      <Send size={18} className="mr-2" /> Send Blast
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(template._id)} className="p-2 text-red-600 hover:bg-red-50 transition bg-white border rounded ">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-none border border-dashed border-gray-300">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>No newsletter templates yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none w-full max-w-4xl max-h-[90vh] flex flex-col ">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{currentTemplate._id ? 'Edit Template' : 'New Template'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. June Product Update"
                    value={currentTemplate.name}
                    onChange={e => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject Line</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Exciting news inside!"
                    value={currentTemplate.subject}
                    onChange={e => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex-1 min-h-[400px] flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <div className="flex-1 border rounded-none overflow-hidden bg-white">
                  <ReactQuill 
                    theme="snow" 
                    value={currentTemplate.bodyHtml} 
                    onChange={(val) => setCurrentTemplate({...currentTemplate, bodyHtml: val})}
                    className="h-[350px]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-none mr-4 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 ">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterAdmin;
