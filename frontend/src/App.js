import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from './context/AppContext';
import { generateUUID } from './utils/pageUtils';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/pages/Dashboard';
import PartyMasterForm from './components/forms/PartyMasterForm';
import ItemMasterForm from './components/forms/ItemMasterForm';
import SubcategoryManagerForm from './components/forms/SubcategoryManagerForm';
import GateInwardForm from './components/forms/GateInwardForm';
import IssueNoteInternalForm from './components/forms/IssueNoteInternalForm';
import InwardInternalForm from './components/forms/InwardInternalForm';
import OutwardChallanForm from './components/forms/OutwardChallanForm';
import StockControlPage from './components/pages/StockControlPage';
import PartyOverviewPage from './components/pages/PartyOverviewPage';
import ItemCatalogOverviewPage from './components/pages/ItemCatalogOverviewPage';
import DispatchOverviewPage from './components/pages/DispatchOverviewPage';
import RecordedEntriesPage from './components/pages/RecordedEntriesPage';

const App = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        setUserId(generateUUID());
        setIsAuthReady(true);
    }, []);

    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Loading application...</div>
            </div>
        );
    }

    return (
        <AppContext.Provider value={{ API_BASE_URL, userId }}>
            <div className="min-h-screen bg-gray-100 font-sans antialiased flex">
                {/* Left Sidebar Navigation */}
                <Sidebar 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Top Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-800">
                                STOCK MANAGEMENT
                            </h1>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-6 overflow-auto">
                        {currentPage === 'dashboard' && <DashboardPage userId={userId} setCurrentPage={setCurrentPage} />}
                        {currentPage === 'partyMaster' && <PartyMasterForm />}
                        {currentPage === 'itemMaster' && <ItemMasterForm />}
                        {currentPage === 'subcategoryManager' && <SubcategoryManagerForm />}
                        {currentPage === 'gateInward' && <GateInwardForm />}
                        {currentPage === 'issueNoteInternal' && <IssueNoteInternalForm />}
                        {currentPage === 'inwardInternal' && <InwardInternalForm />}
                        {currentPage === 'outwardChallan' && <OutwardChallanForm />}
                        {currentPage === 'stockControl' && <StockControlPage />}
                        {currentPage === 'partyOverview' && <PartyOverviewPage />}
                        {currentPage === 'itemCatalog' && <ItemCatalogOverviewPage />}
                        {currentPage === 'dispatchOverview' && <DispatchOverviewPage />}
                        {currentPage === 'recordedEntries' && <RecordedEntriesPage />}
                    </main>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default App; 