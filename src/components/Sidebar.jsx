import React from 'react';
import { ICONS, TabIcon } from './Icons.jsx';

export default function Sidebar({ isOpen, tabs, activeTabId, bookmarks, onSwitchTab, onCloseTab, onCreateTab, onNavigate }) {
    return (
        <aside className={`flex flex-col bg-black/25 supports-backdrop-blur:backdrop-blur-md border-r border-white/5 transition-[width] duration-300 ease-out ${isOpen ? 'w-64' : 'w-0'}`}>
            <div className="title-bar h-10 flex-shrink-0 border-b border-white/5" style={{ WebkitAppRegion: 'drag' }}></div>
            <div className="p-2 space-y-1 overflow-y-auto flex-grow">
                <div className="px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider select-none">Tabs</div>
                {tabs.map(tab => (
                    <div key={tab.id} onClick={() => onSwitchTab(tab.id)} className={`group flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-150 ${tab.id === activeTabId ? 'bg-sky-500/20 text-sky-300' : 'hover:bg-white/10'}`}>
                        <TabIcon tab={tab} />
                        <span className="truncate flex-grow">{tab.title}</span>
                        <button onClick={(e) => onCloseTab(e, tab.id)} className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 flex-shrink-0 transition-opacity">{ICONS.closeTab}</button>
                    </div>
                ))}
                <button onClick={onCreateTab} className="w-full flex items-center p-2 rounded-lg text-gray-300 hover:bg-white/10 active:scale-[0.98] transition-all">{ICONS.newTab}<span className="ml-3">New Tab</span></button>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto mt-2 border-t border-white/5 flex-grow">
                <div className="px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider select-none">Bookmarks</div>
                {bookmarks.map(bookmark => (
                    <div key={bookmark.url} onClick={() => onNavigate(bookmark.url)} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                        {bookmark.favicon ? <img src={bookmark.favicon} className="w-4 h-4 mr-3 flex-shrink-0 rounded-sm" alt="" /> : <div className="w-4 h-4 mr-3 flex-shrink-0">{ICONS.defaultFavicon}</div>}
                        <span className="truncate">{bookmark.title}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}


