import React from 'react';
import { ICONS, TabIcon } from './Icons.jsx';
import WindowControls from './WindowControls.jsx';

export default function HorizontalTabBar({ tabs, activeTabId, onSwitchTab, onCloseTab, onCreateTab }) {
    return (
        <div className="title-bar bg-gray-900/70 supports-backdrop-blur:backdrop-blur-md flex justify-between items-center pl-2 flex-shrink-0 border-b border-white/5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] z-30" style={{ WebkitAppRegion: 'drag' }}>
            <div className="flex items-center flex-grow min-w-0">
                <div className="flex items-end pt-2 -ml-px">
                    {tabs.map(tab => (
                        <div key={tab.id} onClick={() => onSwitchTab(tab.id)} style={{ WebkitAppRegion: 'no-drag' }} className={`group flex items-center py-2 px-4 cursor-pointer max-w-xs rounded-t-lg transition-all duration-200 ${tab.id === activeTabId ? 'bg-gray-800 text-sky-300 shadow-inner' : 'bg-gray-900/50 hover:bg-black/20'}`}>
                            <TabIcon tab={tab} />
                            <span className="truncate text-xs">{tab.title}</span>
                            <button onClick={(e) => onCloseTab(e, tab.id)} className="ml-3 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 flex-shrink-0 transition-opacity">{ICONS.closeTab}</button>
                        </div>
                    ))}
                </div>
                <button onClick={onCreateTab} style={{ WebkitAppRegion: 'no-drag' }} className="ml-2 mb-1 p-2 rounded-full hover:bg-white/10 active:scale-[0.98] text-gray-300 transition-all flex-shrink-0">{ICONS.newTab}</button>
            </div>
            <WindowControls />
        </div>
    );
}


