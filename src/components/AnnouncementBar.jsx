import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';

const AnnouncementBar = () => {
  const { content } = useContent();
  const { text, link, isVisible } = content.announcement;

  if (!isVisible) return null;

  return (
    <div className="bg-burgundy text-white text-[10px] uppercase tracking-widest text-center py-2.5 fixed top-0 z-50 w-full">
      <div className="max-w-[1920px] mx-auto px-4 flex justify-between items-center h-full">
        <button className="opacity-50 hover:opacity-100 transition-opacity p-1">
          <ChevronLeft size={14} />
        </button>
        {link ? (
          <Link to={link} className="font-medium tracking-[0.2em] hover:opacity-80 transition-opacity">
            {text}
          </Link>
        ) : (
          <span className="font-medium tracking-[0.2em]">{text}</span>
        )}
        <button className="opacity-50 hover:opacity-100 transition-opacity p-1">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
