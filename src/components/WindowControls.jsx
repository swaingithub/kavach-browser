import React from 'react';
import { ICONS } from './Icons.jsx';

export default function WindowControls() {
    return (
        <div className="flex items-center text-gray-400">
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={() => window.electronAPI?.minimizeWindow()} className="p-3 hover:bg-white/10 transition-colors rounded-full">{ICONS.minimize}</button>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={() => window.electronAPI?.maximizeWindow()} className="p-3 hover:bg-white/10 transition-colors rounded-full">{ICONS.maximize}</button>
            <button style={{ WebkitAppRegion: 'no-drag' }} onClick={() => window.electronAPI?.closeWindow()} className="p-3 hover:bg-red-500 hover:text-white transition-colors rounded-full">{ICONS.closeWindow}</button>
        </div>
    );
}


