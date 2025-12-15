import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown,
  Building2,
  Star,
  Info,
  Link,
  Gift,
  BookOpen,
  Plus,
  Calendar,
  Clock,
  X,
  Edit,
  Trash2,
  Menu
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Topbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showDiaryMenu, setShowDiaryMenu] = useState(false);
  const [diaryNote, setDiaryNote] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editText, setEditText] = useState('');
  // Notifications are now handled by toastify
  const { isDark, toggleTheme } = useTheme();
  
  const orgMenuRef = useRef(null);
  const diaryMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (orgMenuRef.current && !orgMenuRef.current.contains(event.target)) {
        setShowOrgMenu(false);
      }

      if (diaryMenuRef.current && !diaryMenuRef.current.contains(event.target)) {
        setShowDiaryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const organizations = [
    { id: '1', name: 'Orgpro Softwares (Mahesh)', logo: '🏢' },
  ];

  const currentOrg = organizations[0];

  const organizationMenuItems = [
            { name: 'My Organisation', icon: Building2, action: () => {} },
        { name: 'My Package', icon: Star, action: () => {} },
        { name: 'Credit History', icon: Star, action: () => {} },
        { name: 'Contact Us', icon: Info, action: () => {} },
        { name: 'Training Feedback', icon: Info, action: () => {} },
        { name: 'Quick Links', icon: Link, action: () => {} },
        { name: 'Refer & Earn', icon: Gift, action: () => {} },
        { name: 'Offer Corner', icon: Gift, action: () => {} },
  ];

  // Sample diary entries with dates
  const [diaryEntries, setDiaryEntries] = useState([
    { id: 1, text: 'Team meeting at 10 AM', time: '09:45', type: 'meeting', date: '2024-01-15' },
    { id: 2, text: 'Review asset maintenance reports', time: '11:30', type: 'task', date: '2024-01-15' },
    { id: 3, text: 'Call with vendor about new equipment', time: '14:00', type: 'call', date: '2024-01-15' },
    { id: 4, text: 'Asset inventory check', time: '16:30', type: 'task', date: '2024-01-14' },
    { id: 5, text: 'Weekly team sync', time: '10:00', type: 'meeting', date: '2024-01-14' },
    { id: 6, text: 'Equipment maintenance scheduled', time: '14:15', type: 'task', date: '2024-01-13' },
  ]);

  const [showFullDiary, setShowFullDiary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleAddDiaryNote = () => {
    if (diaryNote.trim()) {
      const newEntry = {
        id: Date.now(),
        text: diaryNote,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        type: 'note'
      };
      setDiaryEntries(prev => [newEntry, ...prev]);
      setDiaryNote('');
      setShowDiaryMenu(false);
    }
  };

  // Custom notification functions removed - now using toastify

  const deleteDiaryEntry = (id) => {
    setDiaryEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const editDiaryEntry = (id) => {
    const entry = diaryEntries.find(e => e.id === id);
    if (entry) {
      setEditingEntry(id);
      setEditText(entry.text);
    }
  };

  const saveEdit = () => {
    if (editingEntry && editText.trim()) {
      setDiaryEntries(prev => prev.map(entry => 
        entry.id === editingEntry 
          ? { ...entry, text: editText.trim() }
          : entry
      ));
      setEditingEntry(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditText('');
  };


  return (
    <motion.div
      className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section - Logo and Hamburger Menu */}
      <div className="flex items-center space-x-3">
        <img 
          src="/src/orglogo/cadashboard_logo.png" 
          alt="Company Logo" 
          className="h-10 w-auto object-contain max-w-[180px]"
          onError={(e) => {
            // Fallback to text if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100 hidden">
          CADASHBOARD
        </span>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Organization Dropdown */}
        <div className="relative" ref={orgMenuRef}>
          <button
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <span className="text-lg">{currentOrg.logo}</span>
            <span className="hidden sm:inline">{currentOrg.name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showOrgMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
              >
                <div className="py-2">
                  {organizationMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setShowOrgMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toast Demo Button */}
        <button
          onClick={() => {
            toast.success('Success! Notifications now use Toastify')
            toast.info('Info: Clean & colorful toasts!')
            toast.warning('Warning: Old system removed')
            toast.error('Error example: Something went wrong')
          }}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          title="Demo all toast types"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Daily Diary */}
        <div className="relative" ref={diaryMenuRef}>
          <button
            onClick={() => setShowDiaryMenu(!showDiaryMenu)}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <BookOpen className="w-5 h-5" />
            {diaryEntries.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">
                {diaryEntries.length > 9 ? '9+' : diaryEntries.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showDiaryMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daily Diary</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a quick note..."
                      value={diaryNote}
                      onChange={(e) => setDiaryNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDiaryNote()}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddDiaryNote}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {diaryEntries.length > 0 ? (
                    diaryEntries.map((entry) => (
                      <div key={entry.id} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        {editingEntry === entry.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                              rows="2"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <p className="text-sm text-gray-900 dark:text-gray-100 flex-1">{entry.text}</p>
                              <div className="flex items-center space-x-2 ml-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {entry.time}
                                </span>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => editDiaryEntry(entry.id)}
                                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteDiaryEntry(entry.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-1">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                entry.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                entry.type === 'task' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                entry.type === 'call' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                              }`}>
                                {entry.type}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No entries yet. Start your daily diary!</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setShowHistory(true);
                        setShowDiaryMenu(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>View History</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowFullDiary(true);
                        setShowDiaryMenu(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Full Diary</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Full Diary Modal */}
      <AnimatePresence>
        {showFullDiary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullDiary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Full Diary</h2>
                  <p className="text-gray-600 dark:text-gray-400">Complete diary entries and notes</p>
                </div>
                <button
                  onClick={() => setShowFullDiary(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {Object.entries(
                    diaryEntries.reduce((acc, entry) => {
                      const date = entry.date;
                      if (!acc[date]) acc[date] = [];
                      acc[date].push(entry);
                      return acc;
                    }, {})
                  ).map(([date, entries]) => (
                    <div key={date} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </h3>
                      <div className="space-y-3">
                        {entries.map((entry) => (
                          <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex-1">
                              {editingEntry === entry.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                    rows="2"
                                  />
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={saveEdit}
                                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-start justify-between">
                                    <p className="text-gray-900 dark:text-gray-100 flex-1">{entry.text}</p>
                                    <div className="flex items-center space-x-2 ml-2">
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => editDiaryEntry(entry.id)}
                                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                          title="Edit"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => deleteDiaryEntry(entry.id)}
                                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {entry.time}
                                    </span>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      entry.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                      entry.type === 'task' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                      entry.type === 'call' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                      {entry.type}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Diary History</h2>
                  <p className="text-gray-600 dark:text-gray-400">View and analyze your diary patterns</p>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {diaryEntries.length}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Total Entries</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {diaryEntries.filter(e => e.type === 'task').length}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Tasks</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {diaryEntries.filter(e => e.type === 'meeting').length}
                        </div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">Meetings</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {diaryEntries.filter(e => e.type === 'call').length}
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">Calls</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
                    <div className="space-y-3">
                      {diaryEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            {editingEntry === entry.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                  rows="2"
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={saveEdit}
                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{entry.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {entry.date} at {entry.time}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              entry.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              entry.type === 'task' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              entry.type === 'call' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {entry.type}
                            </span>
                            {editingEntry !== entry.id && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => editDiaryEntry(entry.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteDiaryEntry(entry.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Topbar;
