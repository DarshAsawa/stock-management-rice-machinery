import React from 'react';
import SidebarItem from './ui/SidebarItem';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg`}>


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