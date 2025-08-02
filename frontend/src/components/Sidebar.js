import React from 'react';
import SidebarItem from './ui/SidebarItem';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg`}>
            {/* Header */}
            <div className="p-4 border-b border-blue-700">
                <div className="flex items-center justify-between">
                    <h1 className={`font-bold transition-all duration-300 ${sidebarOpen ? 'text-xl' : 'text-sm'}`}>
                        {sidebarOpen ? 'Flour Mill ERP' : 'FME'}
                    </h1>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 rounded hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <SidebarItem 
                    icon="🏠" 
                    label="Dashboard" 
                    page="dashboard" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                
                {/* Master Data Section */}
                <div className="px-4 py-2">
                    <div className={`text-xs font-semibold text-blue-300 uppercase tracking-wide ${sidebarOpen ? 'block' : 'hidden'}`}>
                        Master Data
                    </div>
                </div>
                <SidebarItem 
                    icon="👥" 
                    label="Party Master" 
                    page="partyMaster" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="📦" 
                    label="Item Master" 
                    page="itemMaster" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="🏷️" 
                    label="Subcategory Manager" 
                    page="subcategoryManager" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />

                {/* Stock Management Section */}
                <div className="px-4 py-2 mt-4">
                    <div className={`text-xs font-semibold text-blue-300 uppercase tracking-wide ${sidebarOpen ? 'block' : 'hidden'}`}>
                        Stock Management
                    </div>
                </div>
                <SidebarItem 
                    icon="📥" 
                    label="Gate Inward" 
                    page="gateInward" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="📤" 
                    label="Issue Note (Internal)" 
                    page="issueNoteInternal" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="🔄" 
                    label="Inward (Internal)" 
                    page="inwardInternal" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="🚚" 
                    label="Outward Challan" 
                    page="outwardChallan" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />

                {/* Reports Section */}
                <div className="px-4 py-2 mt-4">
                    <div className={`text-xs font-semibold text-blue-300 uppercase tracking-wide ${sidebarOpen ? 'block' : 'hidden'}`}>
                        Reports & Overview
                    </div>
                </div>
                <SidebarItem 
                    icon="📊" 
                    label="Stock Control" 
                    page="stockControl" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="👥" 
                    label="Party Overview" 
                    page="partyOverview" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="📦" 
                    label="Item Catalog" 
                    page="itemCatalog" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="🚚" 
                    label="Dispatch Overview" 
                    page="dispatchOverview" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
                <SidebarItem 
                    icon="📋" 
                    label="Recorded Entries" 
                    page="recordedEntries" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                />
            </nav>
        </aside>
    );
};

export default Sidebar; 