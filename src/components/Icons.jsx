import React from 'react';
import {
  RefreshCw,
  X,
  ArrowLeft,
  ArrowRight,
  Plus,
  Bookmark,
  Circle,
  Menu,
  Layout,
  Columns,
  Minus,
  Square,
  Loader2,
  User,
  MoreVertical,
  Grid
} from 'lucide-react';

export const ICONS = {
  reload: <RefreshCw size={20} />,
  stop: <X size={20} />,
  back: <ArrowLeft size={20} />,
  forward: <ArrowRight size={20} />,
  newTab: <Plus size={16} />,
  closeTab: <X size={12} strokeWidth={3} />,
  bookmark: <Bookmark size={20} />,
  bookmarkSolid: <Bookmark size={20} fill="#38bdf8" />, // Lucide uses stroke by default
  defaultFavicon: <Circle size={16} color="#6b7280" />,
  sidebar: <Menu size={20} />,
  layoutHorizontal: <Layout size={20} />,
  layoutVertical: <Columns size={20} />,
  minimize: <Minus size={15} />,
  maximize: <Square size={13} />,
  closeWindow: <X size={15} strokeWidth={1.5} />,
  spinner: <Loader2 size={16} className="animate-spin text-sky-400" />,
  account: <User size={20} />,
  more: <MoreVertical size={20} />,
  apps: <Grid size={20} />,
};

export const TabIcon = ({ tab }) => {
  if (tab.isLoading) {
    return <div className="w-4 h-4 mr-3 flex-shrink-0">{ICONS.spinner}</div>;
  }
  if (tab.favicon) {
    return (
      <img
        src={tab.favicon}
        className="w-4 h-4 mr-3 flex-shrink-0 rounded-sm"
        alt=""
      />
    );
  }
  return <div className="w-4 h-4 mr-3 flex-shrink-0">{ICONS.defaultFavicon}</div>;
};
