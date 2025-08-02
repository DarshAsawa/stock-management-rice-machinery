import React from 'react';

const SidebarItem = ({ icon, label, page, currentPage, setCurrentPage, sidebarOpen }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 hover:bg-blue-700 rounded-lg mx-2 mb-1 ${
            currentPage === page ? 'bg-blue-700 shadow-md' : ''
        }`}
    >
        <span className="text-xl mr-3">{icon}</span>
        <span className={`font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            {label}
        </span>
    </button>
);

export default SidebarItem; 