import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ICONS } from './components/Icons.jsx';
import Webview from './components/Webview.jsx';
import WindowControls from './components/WindowControls.jsx';
import Sidebar from './components/Sidebar.jsx';
import HorizontalTabBar from './components/HorizontalTabBar.jsx';
import AddressBar from './components/AddressBar.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

// --- Main App Component ---
export default function App() {
    const [tabs, setTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [tabLayout, setTabLayout] = useState('vertical');
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const webviewRefs = useRef({});
    const initRef = useRef(false);

    const [homePageUrl, setHomePageUrl] = useState('https://www.google.com');
    const [searchEngine, setSearchEngine] = useState('google');
    const [notes, setNotes] = useState([]);

    // --- State Update Callback ---
    const updateTabState = useCallback((tabId, props) => {
        setTabs(prevTabs => prevTabs.map(t => t.id === tabId ? { ...t, ...props } : t));
    }, []);
    
    // --- Tab Management ---
    const createNewTab = useCallback((url = homePageUrl) => {
        const newTabId = Date.now();
        const newTab = { id: newTabId, url, title: 'New Tab', favicon: null, isLoading: false, canGoBack: false, canGoForward: false, zoomFactor: 1 };
        setTabs(prevTabs => [...prevTabs, newTab]);
        setActiveTabId(newTabId);
    }, []);

    const closeTab = useCallback((e, tabId) => {
        e.stopPropagation();
        const tabIndex = tabs.findIndex(t => t.id === tabId);
        const newTabs = tabs.filter(t => t.id !== tabId);

        if (activeTabId === tabId) {
            if (newTabs.length > 0) {
                const newActiveIndex = Math.max(0, tabIndex - 1);
                setActiveTabId(newTabs[newActiveIndex].id);
            } else {
                window.electronAPI?.closeWindow();
            }
        }
        
        setTabs(newTabs);
        delete webviewRefs.current[tabId];
    }, [tabs, activeTabId]);
    
    const switchTab = useCallback((tabId) => setActiveTabId(tabId), []);

    // --- Bookmark Management ---
    const toggleBookmark = useCallback(() => {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (!activeTab || !activeTab.url) return;
        setBookmarks(prev => {
            const isBookmarked = prev.some(b => b.url === activeTab.url);
            if (isBookmarked) {
                return prev.filter(b => b.url !== activeTab.url);
            } else {
                return [...prev, { url: activeTab.url, title: activeTab.title, favicon: activeTab.favicon }];
            }
        });
    }, [tabs, activeTabId]);

    const isBookmarked = useCallback((url) => bookmarks.some(b => b.url === url), [bookmarks]);

    // --- Data Persistence ---
    useEffect(() => {
        try {
            const storedBookmarks = localStorage.getItem('gemini-browser-bookmarks');
            const storedLayout = localStorage.getItem('gemini-browser-layout');
            const storedHomePage = localStorage.getItem('browser-home-page');
            const storedSearchEngine = localStorage.getItem('browser-search-engine');
            const storedNotes = localStorage.getItem('browser-notes');
            
            if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
            if (storedLayout) setTabLayout(storedLayout);
            if (storedHomePage) setHomePageUrl(storedHomePage);
            if (storedSearchEngine) setSearchEngine(storedSearchEngine);
            if (storedNotes) setNotes(JSON.parse(storedNotes));
        } catch (error) { console.error("Failed to load settings:", error); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('gemini-browser-bookmarks', JSON.stringify(bookmarks));
            localStorage.setItem('browser-layout', tabLayout);
            localStorage.setItem('browser-home-page', homePageUrl);
            localStorage.setItem('browser-search-engine', searchEngine);
            localStorage.setItem('browser-notes', JSON.stringify(notes));
        } catch (error) { console.error("Failed to save settings:", error); }
    }, [bookmarks, tabLayout, homePageUrl, searchEngine]);

    // --- Electron API & Initial Load ---
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;
        createNewTab();
        if (window.electronAPI) {
            window.electronAPI.onNewTab((url) => createNewTab(url));
            window.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                window.electronAPI.showContextMenu();
            });
        }
    }, [createNewTab]);

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + , to open settings
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                setSettingsOpen(true);
            }
            // Ctrl/Cmd + Shift + , to open settings (alternative)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === ',') {
                e.preventDefault();
                setSettingsOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const activeTab = tabs.find(t => t.id === activeTabId);

    // --- Navigation ---
    const handleNavigation = useCallback((url) => {
        const webview = webviewRefs.current[activeTabId];
        if (webview) {
            let finalUrl = url.trim();
            try { new URL(finalUrl); }
            catch (_) { 
                const searchUrl = getSearchUrl(url);
                finalUrl = searchUrl;
            }
            webview.loadURL(finalUrl);
        }
    }, [activeTabId, searchEngine]);

    const getSearchUrl = (query) => {
        const searchEngines = {
            google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`
        };
        return searchEngines[searchEngine] || searchEngines.google;
    };

    // --- Toolbar helpers (Zoom, Home, DevTools, Hard Reload) ---
    const handleHome = useCallback(() => handleNavigation(homePageUrl), [handleNavigation, homePageUrl]);
    const handleHardReload = useCallback(() => {
        const wv = webviewRefs.current[activeTabId];
        if (!wv) return;
        try { updateTabState(activeTabId, { isLoading: true }); wv.reloadIgnoringCache(); } catch (_) { try { wv.reload(); } catch (_) {} }
    }, [activeTabId, updateTabState]);

    const clampZoom = (z) => Math.max(0.5, Math.min(3, z));
    const setZoom = useCallback((factor) => {
        const wv = webviewRefs.current[activeTabId];
        if (!wv) return;
        const newFactor = clampZoom(parseFloat(factor.toFixed(2)));
        try { wv.setZoomFactor(newFactor); } catch (_) {}
        updateTabState(activeTabId, { zoomFactor: newFactor });
    }, [activeTabId, updateTabState]);

    const zoomIn = useCallback(() => {
        const current = tabs.find(t => t.id === activeTabId)?.zoomFactor ?? 1;
        setZoom(current + 0.1);
    }, [tabs, activeTabId, setZoom]);

    const zoomOut = useCallback(() => {
        const current = tabs.find(t => t.id === activeTabId)?.zoomFactor ?? 1;
        setZoom(current - 0.1);
    }, [tabs, activeTabId, setZoom]);

    const zoomReset = useCallback(() => setZoom(1), [setZoom]);

    const toggleDevTools = useCallback(() => {
        const wv = webviewRefs.current[activeTabId];
        if (!wv) return;
        try {
            const wc = wv.getWebContents ? wv.getWebContents() : null;
            // Fallback: webview has openDevTools method
            if (wv.isDevToolsOpened && wv.isDevToolsOpened()) wv.closeDevTools();
            else if (wv.openDevTools) wv.openDevTools();
            else if (wc && wc.toggleDevTools) wc.toggleDevTools();
        } catch (_) {
            try { wv.openDevTools(); } catch (_) {}
        }
    }, [activeTabId]);

    const printPage = useCallback(() => {
        const wv = webviewRefs.current[activeTabId];
        if (!wv) return;
        try { wv.print(); }
        catch (_) { try { wv.executeJavaScript('window.print()'); } catch (_) {} }
    }, [activeTabId]);

    const findInPage = useCallback(() => {
        const wv = webviewRefs.current[activeTabId];
        if (!wv) return;
        const query = window.prompt('Find in page:');
        if (!query) return;
        try { wv.findInPage(query); } catch (_) {}
    }, [activeTabId]);
    
    const handleUrlSubmit = useCallback((e) => {
        e.preventDefault();
        handleNavigation(e.target.elements.url.value);
    }, [handleNavigation]);

    return (
        <div className="flex h-screen text-sm bg-gray-900 text-gray-300 font-sans">
            {tabLayout === 'vertical' && (
                <Sidebar 
                    isOpen={isSidebarOpen}
                    tabs={tabs}
                    activeTabId={activeTabId}
                    bookmarks={bookmarks}
                    onSwitchTab={switchTab}
                    onCloseTab={closeTab}
                    onCreateTab={() => createNewTab()}
                    onNavigate={handleNavigation}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                {tabLayout === 'horizontal' && (
                    <HorizontalTabBar 
                        tabs={tabs}
                        activeTabId={activeTabId}
                        onSwitchTab={switchTab}
                        onCloseTab={closeTab}
                        onCreateTab={() => createNewTab()}
                    />
                )}
                <AddressBar 
                    tabLayout={tabLayout}
                    activeTab={activeTab}
                    isLoading={(() => { const wv = webviewRefs.current[activeTabId]; return typeof wv?.isLoading === 'function' ? wv.isLoading() : !!activeTab?.isLoading; })()}
                    canGoBack={!!activeTab?.canGoBack}
                    canGoForward={!!activeTab?.canGoForward}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    onToggleLayout={() => setTabLayout(l => l === 'vertical' ? 'horizontal' : 'vertical')}
                    onBack={() => webviewRefs.current[activeTabId]?.goBack()}
                    onForward={() => webviewRefs.current[activeTabId]?.goForward()}
                    onReloadOrStop={() => {
                        const wv = webviewRefs.current[activeTabId];
                        if (!wv) return;
                        const uiThinksLoading = !!activeTab?.isLoading;
                        if (uiThinksLoading) {
                            // Stop loading and immediately reflect in UI
                            try { wv.stop(); } catch (_) {}
                            updateTabState(activeTabId, { isLoading: false });
                        } else {
                            // Start reload and immediately show stop icon
                            updateTabState(activeTabId, { isLoading: true });
                            try { wv.reload(); } catch (_) { try { wv.reloadIgnoringCache(); } catch (_) {} }
                        }
                    }}
                    onSubmitUrl={handleUrlSubmit}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    showWindowControls={tabLayout === 'vertical'}
                    onNavigate={handleNavigation}
                    onNewTab={() => createNewTab()}
                    onShowBookmarks={() => setSidebarOpen(true)}
                    onHome={handleHome}
                    onHardReload={handleHardReload}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onZoomReset={zoomReset}
                    onToggleDevTools={toggleDevTools}
                    onPrint={printPage}
                    onFindInPage={findInPage}
                    onOpenSettings={() => setSettingsOpen(true)}
                />
                <SettingsPanel 
                    isOpen={isSettingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    tabLayout={tabLayout}
                    onToggleLayout={() => setTabLayout(l => l === 'vertical' ? 'horizontal' : 'vertical')}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(v => !v)}
                    onClearBookmarks={() => setBookmarks([])}
                    homePage={homePageUrl}
                    onHomePageChange={setHomePageUrl}
                    searchEngine={searchEngine}
                    onSearchEngineChange={setSearchEngine}
                    notes={notes}
                    onNotesChange={setNotes}
                />
                {/* WindowControls moved into AddressBar when vertical */}

                <main className="flex-grow relative min-h-0 bg-white">
                    {tabs.map(tab => (
                        <div key={tab.id} style={{ display: tab.id === activeTabId ? 'block' : 'none', height: '100%', width: '100%' }}>
                            <Webview 
                                tab={tab}
                                isActive={tab.id === activeTabId}
                                onUpdate={updateTabState}
                                ref={el => webviewRefs.current[tab.id] = el}
                            />
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}

