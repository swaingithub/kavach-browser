import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from './Icons.jsx';
import WindowControls from './WindowControls.jsx';

export default function AddressBar({ tabLayout, activeTab, isLoading, canGoBack, canGoForward, onToggleSidebar, onToggleLayout, onBack, onForward, onReloadOrStop, onSubmitUrl, onToggleBookmark, isBookmarked, showWindowControls, onNavigate, onNewTab, onShowBookmarks, onHome, onHardReload, onZoomIn, onZoomOut, onZoomReset, onToggleDevTools, onPrint, onFindInPage, onOpenSettings }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [appsOpen, setAppsOpen] = useState(false);
    const menuRef = useRef(null);
    const appsRef = useRef(null);

    useEffect(() => {
        function onDocClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
            if (appsRef.current && !appsRef.current.contains(e.target)) setAppsOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    return (
        <header className={`sticky top-0 bg-gray-850/70 bg-gray-800 supports-backdrop-blur:backdrop-blur-md px-4 py-2 min-h-12 flex items-center gap-3 z-20 border-b border-white/5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${tabLayout === 'vertical' ? 'title-bar' : ''}`} style={ tabLayout === 'vertical' ? { WebkitAppRegion: 'drag' } : {}}>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={onToggleSidebar} className={`flex-none p-2 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] text-gray-300 ${tabLayout === 'horizontal' ? 'hidden' : ''}`}>{ICONS.sidebar}</button>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={onToggleLayout} className="flex-none p-2 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] text-gray-300">
                {tabLayout === 'vertical' ? ICONS.layoutHorizontal : ICONS.layoutVertical}
            </button>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={onBack} disabled={!canGoBack} className="flex-none p-2 rounded-full transition-all duration-200 hover:bg-white/10 disabled:opacity-30 text-gray-300">{ICONS.back}</button>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={onForward} disabled={!canGoForward} className="flex-none p-2 rounded-full transition-all duration-200 hover:bg-white/10 disabled:opacity-30 text-gray-300">{ICONS.forward}</button>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={onReloadOrStop} className="flex-none p-2 rounded-full transition-all duration-200 hover:bg-white/10 text-gray-300">
                {isLoading ? ICONS.stop : ICONS.reload}
            </button>
            <form onSubmit={onSubmitUrl} className="flex-auto min-w-0 flex items-center bg-black/25 border border-white/10 rounded-full px-5 py-1 focus-within:bg-black/40 focus-within:border-sky-500/40 transition-colors duration-200" style={{ WebkitAppRegion: 'no-drag' }}>
                <input key={activeTab?.id} name="url" defaultValue={activeTab?.url} onFocus={e => e.target.select()}
                    className="min-w-0 flex-auto bg-transparent py-1.5 text-gray-200 placeholder-gray-500 focus:outline-none"
                    placeholder="Search or enter web address" />
                <button type="button" onClick={onToggleBookmark} className="flex-none p-1.5 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] text-gray-300">
                    {activeTab && isBookmarked(activeTab.url) ? ICONS.bookmarkSolid : ICONS.bookmark}
                </button>
                {/* Basic features dropdown */}
                <div className="relative flex-none" ref={appsRef}>
                    <button type="button" onClick={() => { setAppsOpen(v => !v); setMenuOpen(false); }} className="p-1.5 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] text-gray-300" title="Basic menu">
                        {ICONS.apps}
                    </button>
                    {appsOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-gray-800/95 shadow-lg ring-1 ring-black/5 backdrop-blur-md z-50 py-1" style={{ WebkitAppRegion: 'no-drag' }}>
                            <button onClick={() => { setAppsOpen(false); onNewTab && onNewTab(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">New Tab</button>
                            <button onClick={() => { setAppsOpen(false); onShowBookmarks && onShowBookmarks(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Show Bookmarks</button>
                            <button onClick={() => { setAppsOpen(false); onHome && onHome(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Home</button>
                            <button onClick={() => { setAppsOpen(false); onHardReload && onHardReload(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Reload (Ignore Cache)</button>
                        </div>
                    )}
                </div>
                {/* Advanced dropdown */}
                <div className="relative flex-none" ref={menuRef}>
                    <button type="button" onClick={() => setMenuOpen(v => !v)} className="p-1.5 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] text-gray-300">
                        {ICONS.more}
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-gray-800/95 shadow-lg ring-1 ring-black/5 backdrop-blur-md z-50 py-1" style={{ WebkitAppRegion: 'no-drag' }}>
                            <div className="px-3 py-2 text-gray-400 text-xs">Zoom</div>
                            <div className="px-3 pb-2 flex items-center gap-2">
                                <button onClick={() => { onZoomOut && onZoomOut(); }} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">-</button>
                                <button onClick={() => { onZoomReset && onZoomReset(); }} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">100%</button>
                                <button onClick={() => { onZoomIn && onZoomIn(); }} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">+</button>
                            </div>
                            <div className="my-1 h-px bg-white/10"></div>
                            <div className="px-3 py-2 text-gray-400 text-xs">Browser</div>
                            <button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('chrome://history/'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">History</button>
                            <button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('chrome://downloads/'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Downloads</button>
                            <button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('chrome://settings/passwords'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Passwords</button>
                            <button onClick={() => { setMenuOpen(false); onOpenSettings && onOpenSettings(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Settings</button>
                            <div className="my-1 h-px bg-white/10"></div>
                            <button onClick={() => { setMenuOpen(false); onFindInPage && onFindInPage(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Find in page…</button>
                            <button onClick={() => { setMenuOpen(false); onPrint && onPrint(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200">Print…</button>
                            <div className="my-1 h-px bg-white/10"></div>
                            <div className="px-3 py-2 text-gray-400 text-xs">Advanced</div>
                            <button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('https://accounts.google.com/'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200 flex items-center gap-2">
                                {ICONS.account}
                                <span>Account</span>
                            </button>
                            <button onClick={() => { setMenuOpen(false); onToggleDevTools && onToggleDevTools(); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-gray-200 rounded-b-lg">Toggle DevTools</button>
                        </div>
                    )}
                </div>
            </form>
            {showWindowControls && (
                <div className="ml-1 flex-none" style={{ WebkitAppRegion: 'no-drag' }}>
                    <WindowControls />
                </div>
            )}
        </header>
    );
}


