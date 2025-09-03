import React, { useState, useEffect } from 'react';

export default function SettingsPanel({ 
    isOpen, 
    onClose, 
    tabLayout, 
    onToggleLayout, 
    isSidebarOpen, 
    onToggleSidebar, 
    onClearBookmarks,
    homePage,
    onHomePageChange,
    searchEngine,
    onSearchEngineChange,
    notes,
    onNotesChange
}) {
    const [activeSection, setActiveSection] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [localSearchEngine, setLocalSearchEngine] = useState(searchEngine);
    const [localHomePage, setLocalHomePage] = useState(homePage);
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState('medium');
    const [enableJavaScript, setEnableJavaScript] = useState(true);
    const [enableImages, setEnableImages] = useState(true);
    const [enableCookies, setEnableCookies] = useState(true);
    const [autoComplete, setAutoComplete] = useState(true);
    const [doNotTrack, setDoNotTrack] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    useEffect(() => {
        // Update local state when props change
        setLocalSearchEngine(searchEngine);
        setLocalHomePage(homePage);
    }, [searchEngine, homePage]);

    useEffect(() => {
        // Load saved settings from localStorage
        try {
            const savedTheme = localStorage.getItem('browser-theme');
            const savedFontSize = localStorage.getItem('browser-font-size');
            const savedJavaScript = localStorage.getItem('browser-javascript');
            const savedImages = localStorage.getItem('browser-images');
            const savedCookies = localStorage.getItem('browser-cookies');
            const savedAutoComplete = localStorage.getItem('browser-autocomplete');
            const savedDoNotTrack = localStorage.getItem('browser-do-not-track');

            if (savedTheme) setTheme(savedTheme);
            if (savedFontSize) setFontSize(savedFontSize);
            if (savedJavaScript !== null) setEnableJavaScript(savedJavaScript === 'true');
            if (savedImages !== null) setEnableImages(savedImages === 'true');
            if (savedCookies !== null) setEnableCookies(savedCookies === 'true');
            if (savedAutoComplete !== null) setAutoComplete(savedAutoComplete === 'true');
            if (savedDoNotTrack !== null) setDoNotTrack(savedDoNotTrack === 'true');
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }, []);

    const saveSetting = (key, value) => {
        try {
            localStorage.setItem(`browser-${key}`, value);
        } catch (error) {
            console.error('Failed to save setting:', error);
        }
    };

    const handleSearchEngineChange = (engine) => {
        setLocalSearchEngine(engine);
        onSearchEngineChange(engine);
        saveSetting('search-engine', engine);
    };

    const handleHomePageChange = (e) => {
        const value = e.target.value;
        setLocalHomePage(value);
        onHomePageChange(value);
        saveSetting('home-page', value);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        saveSetting('theme', newTheme);
        // Apply theme to document
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
    };

    const handleFontSizeChange = (size) => {
        setFontSize(size);
        saveSetting('font-size', size);
    };

    const handleJavaScriptChange = (enabled) => {
        setEnableJavaScript(enabled);
        saveSetting('javascript', enabled);
    };

    const handleImagesChange = (enabled) => {
        setEnableImages(enabled);
        saveSetting('images', enabled);
    };

    const handleCookiesChange = (enabled) => {
        setEnableCookies(enabled);
        saveSetting('cookies', enabled);
    };

    const handleAutoCompleteChange = (enabled) => {
        setAutoComplete(enabled);
        saveSetting('autocomplete', enabled);
    };

    const handleDoNotTrackChange = (enabled) => {
        setDoNotTrack(enabled);
        saveSetting('do-not-track', enabled);
    };

    // Notes management functions
    const addNote = () => {
        if (newNoteTitle.trim() && newNoteContent.trim()) {
            const newNote = {
                id: Date.now(),
                title: newNoteTitle.trim(),
                content: newNoteContent.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const updatedNotes = [...notes, newNote];
            onNotesChange(updatedNotes);
            setNewNoteTitle('');
            setNewNoteContent('');
        }
    };

    const updateNote = (noteId, updatedTitle, updatedContent) => {
        const updatedNotes = notes.map(note => 
            note.id === noteId 
                ? { ...note, title: updatedTitle, content: updatedContent, updatedAt: new Date().toISOString() }
                : note
        );
        onNotesChange(updatedNotes);
        setEditingNote(null);
    };

    const deleteNote = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            onNotesChange(updatedNotes);
        }
    };

    const startEditing = (note) => {
        setEditingNote(note);
        setNewNoteTitle(note.title);
        setNewNoteContent(note.content);
    };

    const cancelEditing = () => {
        setEditingNote(null);
        setNewNoteTitle('');
        setNewNoteContent('');
    };

    const resetToDefaults = () => {
        if (window.confirm('Are you sure you want to reset all settings to defaults? This will also clear all your notes.')) {
            setLocalSearchEngine('google');
            setLocalHomePage('https://www.google.com');
            onSearchEngineChange('google');
            onHomePageChange('https://www.google.com');
            setTheme('dark');
            setFontSize('medium');
            setEnableJavaScript(true);
            setEnableImages(true);
            setEnableCookies(true);
            setAutoComplete(true);
            setDoNotTrack(false);
            onNotesChange([]);
            
            // Clear localStorage
            localStorage.removeItem('browser-search-engine');
            localStorage.removeItem('browser-home-page');
            localStorage.removeItem('browser-theme');
            localStorage.removeItem('browser-font-size');
            localStorage.removeItem('browser-javascript');
            localStorage.removeItem('browser-images');
            localStorage.removeItem('browser-cookies');
            localStorage.removeItem('browser-autocomplete');
            localStorage.removeItem('browser-do-not-track');
            localStorage.removeItem('browser-notes');
        }
    };

    if (!isOpen) return null;

    const sections = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'appearance', label: 'Appearance', icon: '🎨' },
        { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
        { id: 'notes', label: 'Notes', icon: '📝' },
        { id: 'advanced', label: 'Advanced', icon: '⚡' }
    ];

    const renderGeneralSection = () => (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-gray-400 mb-2">Search Engine</div>
                <div className="grid grid-cols-2 gap-2">
                    {['google', 'bing', 'duckduckgo', 'yahoo'].map(engine => (
                        <button
                            key={engine}
                            onClick={() => handleSearchEngineChange(engine)}
                            className={`px-3 py-2 rounded text-sm capitalize ${
                                localSearchEngine === engine 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white/10 hover:bg-white/20'
                            }`}
                        >
                            {engine}
                        </button>
                    ))}
                </div>
            </div>
            
            <div>
                <div className="text-sm text-gray-400 mb-2">Home Page</div>
                <input
                    type="url"
                    value={localHomePage}
                    onChange={handleHomePageChange}
                    className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter home page URL"
                />
            </div>

            <div>
                <div className="text-sm text-gray-400 mb-2">Tab Layout</div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-300">Current: {tabLayout}</span>
                    <button 
                        onClick={onToggleLayout} 
                        className="ml-auto px-3 py-1.5 rounded bg-white/10 hover:bg-white/20"
                    >
                        Toggle Layout
                    </button>
                </div>
            </div>

            <div>
                <div className="text-sm text-gray-400 mb-2">Sidebar</div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-300">{isSidebarOpen ? 'Visible' : 'Hidden'}</span>
                    <button 
                        onClick={onToggleSidebar} 
                        className="ml-auto px-3 py-1.5 rounded bg-white/10 hover:bg-white/20"
                    >
                        Toggle Sidebar
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSection = () => (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-gray-400 mb-2">Theme</div>
                <div className="grid grid-cols-2 gap-2">
                    {['light', 'dark'].map(themeOption => (
                        <button
                            key={themeOption}
                            onClick={() => handleThemeChange(themeOption)}
                            className={`px-3 py-2 rounded text-sm capitalize ${
                                theme === themeOption 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white/10 hover:bg-white/20'
                            }`}
                        >
                            {themeOption}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-sm text-gray-400 mb-2">Font Size</div>
                <div className="grid grid-cols-3 gap-2">
                    {['small', 'medium', 'large'].map(size => (
                        <button
                            key={size}
                            onClick={() => handleFontSizeChange(size)}
                            className={`px-3 py-2 rounded text-sm capitalize ${
                                fontSize === size 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white/10 hover:bg-white/20'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPrivacySection = () => (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-gray-400 mb-2">Content Settings</div>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={enableJavaScript}
                            onChange={(e) => handleJavaScriptChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Enable JavaScript</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={enableImages}
                            onChange={(e) => handleImagesChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Load images automatically</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={enableCookies}
                            onChange={(e) => handleCookiesChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Accept cookies</span>
                    </label>
                </div>
            </div>

            <div>
                <div className="text-sm text-gray-400 mb-2">Privacy Options</div>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={autoComplete}
                            onChange={(e) => handleAutoCompleteChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Enable form autocomplete</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={doNotTrack}
                            onChange={(e) => handleDoNotTrackChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Send "Do Not Track" requests</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderNotesSection = () => (
        <div className="space-y-4">
            {/* Add New Note */}
            <div className="p-4 rounded bg-white/5 border border-white/10">
                <div className="text-sm text-gray-400 mb-3">Add New Note</div>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Note title..."
                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none text-gray-200 placeholder-gray-400"
                    />
                    <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Note content..."
                        rows={3}
                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none text-gray-200 placeholder-gray-400 resize-none"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={addNote}
                            disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm"
                        >
                            Add Note
                        </button>
                        {(editingNote || newNoteTitle || newNoteContent) && (
                            <button
                                onClick={cancelEditing}
                                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notes List */}
            <div>
                <div className="text-sm text-gray-400 mb-3">Your Notes ({notes.length})</div>
                {notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📝</div>
                        <div>No notes yet. Create your first note above!</div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notes.map(note => (
                            <div key={note.id} className="p-3 rounded bg-white/5 border border-white/10">
                                {editingNote?.id === note.id ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={newNoteTitle}
                                            onChange={(e) => setNewNoteTitle(e.target.value)}
                                            className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none text-gray-200"
                                        />
                                        <textarea
                                            value={newNoteContent}
                                            onChange={(e) => setNewNoteContent(e.target.value)}
                                            rows={3}
                                            className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none text-gray-200 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateNote(note.id, newNoteTitle, newNoteContent)}
                                                disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                                                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-medium text-gray-200">{note.title}</h3>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => startEditing(note)}
                                                    className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-gray-200"
                                                    title="Edit note"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => deleteNote(note.id)}
                                                    className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                                                    title="Delete note"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.content}</p>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Created: {new Date(note.createdAt).toLocaleDateString()}
                                            {note.updatedAt !== note.createdAt && (
                                                <span className="ml-3">
                                                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderAdvancedSection = () => (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-gray-400 mb-2">Data Management</div>
                <button 
                    onClick={onClearBookmarks} 
                    className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300"
                >
                    Clear all bookmarks
                </button>
            </div>

            <div>
                <div className="text-sm text-gray-400 mb-2">Reset Settings</div>
                <button 
                    onClick={resetToDefaults} 
                    className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-yellow-400 hover:text-yellow-300"
                >
                    Reset to default settings
                </button>
            </div>

            <div>
                <div className="text-sm text-gray-400 mb-2">About</div>
                <div className="text-xs text-gray-500 space-y-1">
                    <div>Electron Browser v1.0.0</div>
                    <div>Built with React & Electron</div>
                </div>
            </div>
        </div>
    );

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'general': return renderGeneralSection();
            case 'appearance': return renderAppearanceSection();
            case 'privacy': return renderPrivacySection();
            case 'notes': return renderNotesSection();
            case 'advanced': return renderAdvancedSection();
            default: return renderGeneralSection();
        }
    };

    const renderSearchResults = () => {
        const query = searchQuery.toLowerCase();
        const results = [];
        
        // Search through all settings
        if (query.includes('search') || query.includes('engine')) {
            results.push(
                <div key="search-engine" className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Search Engine</div>
                    <div className="grid grid-cols-2 gap-2">
                        {['google', 'bing', 'duckduckgo', 'yahoo'].map(engine => (
                            <button
                                key={engine}
                                onClick={() => handleSearchEngineChange(engine)}
                                className={`px-3 py-2 rounded text-sm capitalize ${
                                    localSearchEngine === engine 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white/10 hover:bg-white/20'
                                }`}
                            >
                                {engine}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        
        if (query.includes('home') || query.includes('page')) {
            results.push(
                <div key="home-page" className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Home Page</div>
                    <input
                        type="url"
                        value={localHomePage}
                        onChange={handleHomePageChange}
                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter home page URL"
                    />
                </div>
            );
        }
        
        if (query.includes('theme') || query.includes('appearance')) {
            results.push(
                <div key="theme" className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Theme</div>
                    <div className="grid grid-cols-2 gap-2">
                        {['light', 'dark'].map(themeOption => (
                            <button
                                key={themeOption}
                                onClick={() => handleThemeChange(themeOption)}
                                className={`px-3 py-2 rounded text-sm capitalize ${
                                    theme === themeOption 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white/10 hover:bg-white/20'
                                }`}
                            >
                                {themeOption}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        
        if (query.includes('javascript') || query.includes('js')) {
            results.push(
                <div key="javascript" className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">JavaScript</div>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={enableJavaScript}
                            onChange={(e) => handleJavaScriptChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Enable JavaScript</span>
                    </label>
                </div>
            );
        }
        
        if (query.includes('privacy') || query.includes('cookies')) {
            results.push(
                <div key="cookies" className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Cookies</div>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={enableCookies}
                            onChange={(e) => handleCookiesChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span>Accept cookies</span>
                    </label>
                </div>
            );
        }
        
        if (query.includes('notes') || query.includes('note')) {
            results.push(
                <div key="notes" className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Notes</div>
                    <div className="text-gray-300 text-sm">
                        You have {notes.length} note{notes.length !== 1 ? 's' : ''}. 
                        Go to the Notes section to manage them.
                    </div>
                    <button
                        onClick={() => setActiveSection('notes')}
                        className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        Go to Notes
                    </button>
                </div>
            );
        }
        
        if (results.length === 0) {
            return <div className="text-gray-400 text-center py-8">No settings found for "{searchQuery}"</div>;
        }
        
        return results;
    };

    return (
        <div className="fixed inset-0 z-40" style={{ WebkitAppRegion: 'no-drag' }}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="absolute right-4 top-14 w-[500px] max-w-[95vw] h-[600px] max-h-[90vh] bg-gray-900 text-gray-200 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="font-semibold text-lg">Settings</div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">⌘,</span>
                        <button onClick={() => {
                            onClose();
                            setSearchQuery(''); // Clear search when closing
                        }} className="px-2 py-1 rounded hover:bg-white/10">✕</button>
                    </div>
                </div>
                
                <div className="flex h-full">
                    {/* Sidebar Navigation */}
                    <div className="w-32 border-r border-white/10 bg-gray-800/50">
                        <div className="p-2 space-y-1">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActiveSection(section.id);
                                        setSearchQuery(''); // Clear search when switching sections
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                                        activeSection === section.id
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-lg mb-1">{section.icon}</div>
                                    <div>{section.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search settings..."
                                className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none text-gray-200 placeholder-gray-400"
                            />
                        </div>
                        
                        {searchQuery ? (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-400 mb-2">Search Results</div>
                                {renderSearchResults()}
                            </div>
                        ) : (
                            renderSectionContent()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


