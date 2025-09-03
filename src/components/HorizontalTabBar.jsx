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
                <div 
                    onClick={onCreateTab} 
                    style={{ WebkitAppRegion: 'no-drag' }} 
                    className="group flex items-center py-3 px-5 cursor-pointer rounded-t-lg rounded-b-none transition-all duration-200 
                              hover:bg-white/10 text-gray-300 hover:text-white ml-1 h-[calc(100%+1px)] -mb-px flex items-center"
                >
                    <span className="text-lg font-medium">+</span>
                </div>
            </div>
            <WindowControls />
        </div>
    );
}


