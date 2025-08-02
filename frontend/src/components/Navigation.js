import React from 'react';

// NavItem Component
const NavItem = ({ label, page, currentPage, setCurrentPage }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300
                    ${currentPage === page ? 'bg-blue-700 shadow-md' : 'hover:bg-blue-700 hover:shadow-md'}`}
    >
        {label}
    </button>
);

const Navigation = ({ currentPage, setCurrentPage }) => {
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg rounded-b-lg">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-wide">Flour Mill ERP</h1>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <NavItem label="Dashboard" page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Party Master" page="partyMaster" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Item Category" page="itemCategory" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Item Master" page="itemMaster" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Gate Inward" page="gateInward" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Issue Note (Internal)" page="issueNoteInternal" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Inward (Internal)" page="inwardInternal" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem label="Outward Challan" page="outwardChallan" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 