import React, { useState, useEffect, createContext, useContext } from 'react';

// Context for API Base URL and User
const AppContext = createContext(null);

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:3001/api';

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const App = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar toggle

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
                            icon="📊" 
                            label="Stock Control" 
                            page="stockControl" 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage}
                            sidebarOpen={sidebarOpen}
                        />
                        <SidebarItem 
                            icon="🏭" 
                            label="Production Floor" 
                            page="productionFloorStock" 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage}
                            sidebarOpen={sidebarOpen}
                        />

                        {/* Transactions Section */}
                        <div className="px-4 py-2 mt-4">
                            <div className={`text-xs font-semibold text-blue-300 uppercase tracking-wide ${sidebarOpen ? 'block' : 'hidden'}`}>
                                Transactions
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
                                Reports
                            </div>
                        </div>
                        <SidebarItem 
                            icon="📋" 
                            label="Recorded Entries" 
                            page="recordedEntries" 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage}
                            sidebarOpen={sidebarOpen}
                        />
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-blue-700">
                        <div className={`text-xs text-blue-300 ${sidebarOpen ? 'block' : 'hidden'}`}>
                            User ID: {userId?.slice(0, 8)}...
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {/* Top Header Bar */}
                    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {getPageTitle(currentPage)}
                            </h2>
                            <div className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-6">
                        {currentPage === 'dashboard' && <DashboardPage userId={userId} setCurrentPage={setCurrentPage} />}
                        {currentPage === 'partyMaster' && <PartyMasterForm />}
                        {currentPage === 'itemMaster' && <ItemMasterForm />}
                        {currentPage === 'subcategoryManager' && <SubcategoryManagerPage />}
                        {currentPage === 'stockControl' && <StockControlPage />}
                        {currentPage === 'productionFloorStock' && <ProductionFloorStockPage />}
                        {currentPage === 'gateInward' && <GateInwardForm />}
                        {currentPage === 'issueNoteInternal' && <IssueNoteInternalForm />}
                        {currentPage === 'inwardInternal' && <InwardInternalForm />}
                        {currentPage === 'outwardChallan' && <OutwardChallanForm />}
                        {currentPage === 'recordedEntries' && <RecordedEntriesPage />}

                        {/* Overview Pages */}
                        {currentPage === 'partyOverview' && <PartyOverviewPage />}
                        {currentPage === 'itemCatalogOverview' && <ItemCatalogOverviewPage />}
                        {currentPage === 'productionOverview' && <ProductionOverviewPage />}
                        {currentPage === 'dispatchOverview' && <DispatchOverviewPage />}
                    </div>
                </main>
            </div>
        </AppContext.Provider>
    );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, page, currentPage, setCurrentPage, sidebarOpen }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 hover:bg-blue-700 hover:border-r-4 hover:border-blue-300 ${
            currentPage === page 
                ? 'bg-blue-700 border-r-4 border-blue-300 text-white' 
                : 'text-blue-100 hover:text-white'
        }`}
        title={!sidebarOpen ? label : ''}
    >
        <span className="text-xl mr-3 flex-shrink-0">{icon}</span>
        <span className={`font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            {label}
        </span>
    </button>
);

// Helper function to get page titles
const getPageTitle = (page) => {
    const pageTitles = {
        dashboard: 'Dashboard',
        partyMaster: 'Party Master',
        itemMaster: 'Item Master',
        subcategoryManager: 'Subcategory Manager',
        stockControl: 'Stock Control',
        productionFloorStock: 'Production Floor Stock',
        gateInward: 'Gate Inward',
        issueNoteInternal: 'Issue Note (Internal)',
        inwardInternal: 'Inward (Internal)',
        outwardChallan: 'Outward Challan',
        recordedEntries: 'Recorded Entries',
        partyOverview: 'Party Overview',
        itemCatalogOverview: 'Item Catalog Overview',
        productionOverview: 'Production Overview',
        dispatchOverview: 'Dispatch Overview'
    };
    return pageTitles[page] || 'Flour Mill ERP';
};

// ...existing code for all your components (DashboardPage, PartyMasterForm, etc.)

// Dashboard Page (Placeholder)
const DashboardPage = ({ userId, setCurrentPage }) => {
    const { API_BASE_URL } = useContext(AppContext);
    const [recentGateInwards, setRecentGateInwards] = useState([]);
    const [recentInwardInternals, setRecentInwardInternals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

    useEffect(() => {
        const fetchRecentEntries = async () => {
            setIsLoading(true);
            try {
                // Fetch recent Gate Inward entries
                const gateInwardResponse = await fetch(`${API_BASE_URL}/gate-inwards`);
                if (!gateInwardResponse.ok) throw new Error(`HTTP error! status: ${gateInwardResponse.status}`);
                const gateInwardData = await gateInwardResponse.json();
                setRecentGateInwards(gateInwardData.slice(0, 5)); // Show last 5

                // Fetch recent Inward Internal entries
                const inwardInternalResponse = await fetch(`${API_BASE_URL}/inward-internals`);
                if (!inwardInternalResponse.ok) throw new Error(`HTTP error! status: ${inwardInternalResponse.status}`);
                const inwardInternalData = await inwardInternalResponse.json();
                setRecentInwardInternals(inwardInternalData.slice(0, 5)); // Show last 5

            } catch (error) {
                console.error("Error fetching recent entries:", error);
                setModal({ show: true, title: "Error", message: "Failed to load recent entries. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentEntries();
    }, [API_BASE_URL]);


    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Welcome to the Dashboard!</h2>
            <p className="text-gray-700 text-lg mb-4">
                Your User ID: <span className="font-mono text-blue-600 break-all">{userId}</span>
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="Party Management" description="Register and manage your buyers and sellers." icon="👥" page="partyOverview" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Item Catalog" description="Define categories and detailed item information." icon="📦" page="itemCatalogOverview" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Stock Control" description="Track material inward, outward, and production flow." icon="📊" page="stockControl" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Production Floor" description="Monitor raw materials available on production floor." icon="🏭" page="productionFloorStock" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Production Flow" description="Manage raw material issuance and finished goods receipt." icon="⚙️" page="productionOverview" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Dispatch & Sales" description="Record outward challans and manage customer deliveries." icon="🚚" page="dispatchOverview" setCurrentPage={setCurrentPage} />
                <DashboardCard title="All Recorded Entries" description="View all transaction entries with detailed segregation." icon="📋" page="recordedEntries" setCurrentPage={setCurrentPage} />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Recent Gate Inward Entries</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md mb-8">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bill No</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bill Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">GRN#</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentGateInwards.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">No recent Gate Inward entries.</td>
                                </tr>
                            ) : (
                                recentGateInwards.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.bill_no}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.bill_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.supplier_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.grn_number}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {entry.items && entry.items.map((item, idx) => (
                                                <div key={idx}>{item.item_description} ({item.quantity} {item.uom})</div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Recent Inward (Internal) Entries</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Received Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Finished Goods</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Materials Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInwardInternals.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">No recent Inward (Internal) entries.</td>
                                    </tr>
                                ) : (
                                    recentInwardInternals.map((entry) => (
                                        <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{entry.receipt_no}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.received_date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{entry.department}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {entry.finishGoods && entry.finishGoods.map((item, idx) => (
                                                    <div key={idx}>{item.item_description} ({item.quantity} {item.uom})</div>
                                                ))}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {entry.materialUsed && entry.materialUsed.map((item, idx) => (
                                                    <div key={idx}>{item.item_description} ({item.quantity} {item.uom})</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    const DashboardCard = ({ title, description, icon, page, setCurrentPage }) => (
        <div
            className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-blue-200 cursor-pointer"
            onClick={() => setCurrentPage(page)}
        >
            <div className="text-4xl mb-4 text-blue-600">{icon}</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );


    // Common Components: InputField, SelectField, Button, Modal, LoadingSpinner

    const InputField = ({ label, id, type = "text", value, onChange, placeholder, required = false, className = "", readOnly = false, disabled = false, min, max }) => {
        // For date inputs, set max to today's date if not explicitly provided
        const getDateRestrictions = () => {
            if (type === "date") {
                const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                return {
                    max: max || today, // Don't allow future dates unless explicitly allowed
                    min: min || undefined
                };
            }
            return {};
        };

        const dateRestrictions = getDateRestrictions();

        return (
            <div className="mb-4">
                <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    id={id}
                    className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...dateRestrictions}
                />
                {type === "date" && !max && (
                    <p className="text-xs text-gray-500 mt-1">Future dates are not allowed</p>
                )}
            </div>
        );
    };

    const SelectField = ({ label, id, value, onChange, options, required = false, className = "" }) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                className={`shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Select an option</option>
                {options.map((option, index) => (
                    <option key={option.value || index} value={option.value || option.label}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    const Button = ({ onClick, children, className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 shadow-md", type = "button" }) => (
        <button
            onClick={onClick}
            className={className}
            type={type}
        >
            {children}
        </button>
    );

    // ...existing code...

    const Modal = ({ show, title, message, onClose, onConfirm, showConfirmButton = false, confirmText = "Confirm", children }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
                    {message && <p className="text-gray-700 mb-6">{message}</p>}
                    {children && <div className="mb-6">{children}</div>}
                    <div className="flex justify-end space-x-4">
                        <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                            {showConfirmButton ? "Cancel" : "Close"}
                        </Button>
                        {showConfirmButton && (
                            <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white">
                                {confirmText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

// ...existing code...

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading...</p>
        </div>
    );


    // Form Components
    // 1. Party Master Form
    // Update the PartyMasterForm component - fix the clear button styling
    const PartyMasterForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [parties, setParties] = useState([]);
        const [partyCode, setPartyCode] = useState('');
        const [partyName, setPartyName] = useState('');
        const [gst, setGst] = useState('');
        const [address, setAddress] = useState('');
        const [city, setCity] = useState('');
        const [bankAccount, setBankAccount] = useState('');
        const [bankName, setBankName] = useState('');
        const [ifscCode, setIfscCode] = useState('');
        const [editingPartyId, setEditingPartyId] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchParties = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/parties`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setParties(data);
            } catch (error) {
                console.error("Error fetching parties:", error);
                setModal({ show: true, title: "Error", message: "Failed to load parties. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchParties();
        }, []);

        const resetForm = () => {
            setPartyCode('');
            setPartyName('');
            setGst('');
            setAddress('');
            setCity('');
            setBankAccount('');
            setBankName('');
            setIfscCode('');
            setEditingPartyId(null);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const partyData = {
                partyCode,
                partyName,
                gst,
                address,
                city,
                bankAccount,
                bankName,
                ifscCode,
                userId // Pass userId to backend
            };

            try {
                let response;
                if (editingPartyId) {
                    response = await fetch(`${API_BASE_URL}/parties/${editingPartyId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(partyData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/parties`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(partyData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ show: true, title: "Success", message: `Party ${editingPartyId ? 'updated' : 'added'} successfully!`, onClose: () => setModal({ ...modal, show: false }) });
                resetForm();
                fetchParties(); // Re-fetch parties to update the list
            } catch (error) {
                console.error("Error saving party:", error);
                setModal({ show: true, title: "Error", message: `Failed to save party: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        const handleEdit = (party) => {
            setEditingPartyId(party.id);
            setPartyCode(party.party_code);
            setPartyName(party.party_name);
            setGst(party.gst_number);
            setAddress(party.address);
            setCity(party.city);
            setBankAccount(party.bank_account);
            setBankName(party.bank_name);
            setIfscCode(party.ifsc_code);
        };

        const handleDelete = (id) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this party?",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/parties/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ show: true, title: "Success", message: "Party deleted successfully!", onClose: () => setModal({ ...modal, show: false }) });
                        fetchParties(); // Re-fetch parties
                    } catch (error) {
                        console.error("Error deleting party:", error);
                        setModal({ show: true, title: "Error", message: `Failed to delete party: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Party Master</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField label="Party Code" id="partyCode" value={partyCode} onChange={(e) => setPartyCode(e.target.value)} required={true} placeholder="e.g., P001" />
                    <InputField label="Party Name" id="partyName" value={partyName} onChange={(e) => setPartyName(e.target.value)} required={true} placeholder="e.g., ABC Suppliers" />
                    <InputField label="GST#" id="gst" value={gst} onChange={(e) => setGst(e.target.value)} required={true} placeholder="e.g., 27ABCDE1234F1Z5" />
                    <InputField label="Address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required={true} placeholder="e.g., 123 Main St" />
                    <InputField label="City" id="city" value={city} onChange={(e) => setCity(e.target.value)} required={true} placeholder="e.g., New Delhi" />
                    <InputField label="Bank A/c" id="bankAccount" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} required={true} placeholder="e.g., 1234567890" />
                    <InputField label="Bank Name" id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} required={true} placeholder="e.g., State Bank of India" />
                    <InputField label="IFS Code" id="ifscCode" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required={true} placeholder="e.g., SBIN0000001" />

                    {/* Improved Form Action Buttons */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-4">
                        <Button 
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>👥</span>
                            {editingPartyId ? 'Update Party' : 'Add Party'}
                        </Button>
                        <Button 
                            onClick={resetForm} 
                            type="button"
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>🔄</span>
                            Clear Form
                        </Button>
                    </div>
                </form>

                <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Registered Parties</h3>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">GST#</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">City</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parties.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 px-4 text-center text-gray-500">No parties registered yet.</td>
                                    </tr>
                                ) : (
                                    parties.map((party) => (
                                        <tr key={party.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.party_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.party_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.gst_number}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.city}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <Button onClick={() => handleEdit(party)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                                <Button onClick={() => handleDelete(party.id)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2">Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // 2. Item Category Form (Removed as per user request)
    // const ItemCategoryForm = () => { ... };

    // 3. Item Master Form (Now handles both Item Master and Item Category details)
    // ...existing code...

    // 3. Enhanced Item Master Form with Subcategory Support
    // Update the ItemMasterForm component with these changes

    // Update the ItemMasterForm component with these fixes

    const ItemMasterForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [categories, setCategories] = useState([]);
        const [subcategories, setSubcategories] = useState([]);
        const [items, setItems] = useState([]);
        
        // Form state variables - reordered
        const [categoryId, setCategoryId] = useState('');
        const [subcategoryId, setSubcategoryId] = useState('');
        const [code, setCode] = useState(''); // Auto-generated, read-only
        const [desc1, setDesc1] = useState('');
        const [desc2, setDesc2] = useState('');
        const [desc3, setDesc3] = useState('');
        const [desc4, setDesc4] = useState('');
        const [desc5, setDesc5] = useState('');
        const [itemName, setItemName] = useState(''); // Moved after descriptions
        const [fullDescription, setFullDescription] = useState('');
        const [stock, setStock] = useState(0);
        const [minLevel, setMinLevel] = useState(0);
        const [unitRate, setUnitRate] = useState(0);
        const [rackBin, setRackBin] = useState('');
        
        // Field labels state (these update based on subcategory)
        const [field1Label, setField1Label] = useState('Description 1');
        const [field2Label, setField2Label] = useState('Description 2');
        const [field3Label, setField3Label] = useState('Description 3');
        const [field4Label, setField4Label] = useState('Description 4');
        const [field5Label, setField5Label] = useState('Description 5');
        
        const [editingItemId, setEditingItemId] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [isGeneratingCode, setIsGeneratingCode] = useState(false);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchItemsAndCategories = async () => {
            try {
                setIsLoading(true);
                const [categoriesResponse, subcategoriesResponse, itemsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/categories`),
                    fetch(`${API_BASE_URL}/subcategories`),
                    fetch(`${API_BASE_URL}/items`)
                ]);

                if (!categoriesResponse.ok || !subcategoriesResponse.ok || !itemsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const categoriesData = await categoriesResponse.json();
                const subcategoriesData = await subcategoriesResponse.json();
                const itemsData = await itemsResponse.json();

                setCategories(categoriesData);
                setSubcategories(subcategoriesData);
                setItems(itemsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setModal({ show: true, title: "Error", message: "Failed to load data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchItemsAndCategories();
        }, []);

        // Generate item code when category and subcategory are selected
        const generateItemCode = async (categoryId, subcategoryId) => {
            if (!categoryId || !subcategoryId) {
                setCode('');
                return;
            }

            setIsGeneratingCode(true);
            try {
                const response = await fetch(`${API_BASE_URL}/items/generate-code/${categoryId}/${subcategoryId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                setCode(data.itemCode);
            } catch (error) {
                console.error("Error generating item code:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: "Failed to generate item code. Please try again.", 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            } finally {
                setIsGeneratingCode(false);
            }
        };

        // Effect to generate code when category or subcategory changes (only for new items)
        useEffect(() => {
            if (!editingItemId && categoryId && subcategoryId) {
                generateItemCode(categoryId, subcategoryId);
            }
        }, [categoryId, subcategoryId, editingItemId]);

        // Filter subcategories based on selected category
        const filteredSubcategories = subcategories.filter(sub => sub.category_id === parseInt(categoryId));

        // Effect to update field labels when subcategory changes (but keep values empty for new items)
        useEffect(() => {
            const selectedSubcategory = subcategories.find(sub => sub.id === parseInt(subcategoryId));
            if (selectedSubcategory) {
                // Update field labels from selected subcategory's field mappings
                setField1Label(selectedSubcategory.field1_name || 'Description 1');
                setField2Label(selectedSubcategory.field2_name || 'Description 2');
                setField3Label(selectedSubcategory.field3_name || 'Description 3');
                setField4Label(selectedSubcategory.field4_name || 'Description 4');
                setField5Label(selectedSubcategory.field5_name || 'Description 5');
                
                // Only clear values if not in edit mode
                if (!editingItemId) {
                    setDesc1('');
                    setDesc2('');
                    setDesc3('');
                    setDesc4('');
                    setDesc5('');
                }
            } else {
                // Reset to default labels if no subcategory is selected
                setField1Label('Description 1');
                setField2Label('Description 2');
                setField3Label('Description 3');
                setField4Label('Description 4');
                setField5Label('Description 5');
                
                if (!editingItemId) {
                    setDesc1('');
                    setDesc2('');
                    setDesc3('');
                    setDesc4('');
                    setDesc5('');
                }
            }
        }, [subcategoryId, subcategories, editingItemId]);

        // Effect to update full description when individual desc fields change
        useEffect(() => {
            const parts = [desc1, desc2, desc3, desc4, desc5].filter(Boolean).join(' ');
            setFullDescription(parts.trim());
        }, [desc1, desc2, desc3, desc4, desc5]);

        const resetForm = () => {
            setCategoryId('');
            setSubcategoryId('');
            setCode('');
            setDesc1('');
            setDesc2('');
            setDesc3('');
            setDesc4('');
            setDesc5('');
            setItemName('');
            setFullDescription('');
            setStock(0);
            setMinLevel(0);
            setUnitRate(0);
            setRackBin('');
            setEditingItemId(null);
            
            // Reset field labels to default
            setField1Label('Description 1');
            setField2Label('Description 2');
            setField3Label('Description 3');
            setField4Label('Description 4');
            setField5Label('Description 5');
        };


        const handleEdit = (item) => {
            setEditingItemId(item.id);
            setCategoryId(item.category_id);
            setSubcategoryId(item.subcategory_id);
            setCode(item.item_code); // Set existing code for editing
            setItemName(item.item_name);
            setDesc1(item.description1 || '');
            setDesc2(item.description2 || '');
            setDesc3(item.description3 || '');
            setDesc4(item.description4 || '');
            setDesc5(item.description5 || '');
            setFullDescription(item.full_description || '');
            setStock(item.stock);
            setMinLevel(item.min_level);
            setUnitRate(parseFloat(item.unit_rate));
            setRackBin(item.rack_bin || '');
            
            // Update field labels based on the item's subcategory
            const selectedSubcategory = subcategories.find(sub => sub.id === item.subcategory_id);
            if (selectedSubcategory) {
                setField1Label(selectedSubcategory.field1_name || 'Description 1');
                setField2Label(selectedSubcategory.field2_name || 'Description 2');
                setField3Label(selectedSubcategory.field3_name || 'Description 3');
                setField4Label(selectedSubcategory.field4_name || 'Description 4');
                setField5Label(selectedSubcategory.field5_name || 'Description 5');
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!code) {
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: "Item code is required. Please select category and subcategory to generate code.", 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                return;
            }

            const itemData = {
                code,
                itemName,
                categoryId: Number(categoryId),
                subcategoryId: Number(subcategoryId),
                desc1,
                desc2,
                desc3,
                desc4,
                desc5,
                fullDescription,
                stock: Number(stock),
                minLevel: Number(minLevel),
                unitRate: Number(unitRate),
                rackBin,
                userId
            };

            try {
                let response;
                if (editingItemId) {
                    response = await fetch(`${API_BASE_URL}/items/${editingItemId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(itemData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/items`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(itemData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ 
                    show: true, 
                    title: "Success", 
                    message: `Item ${editingItemId ? 'updated' : 'created'} successfully!`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                resetForm();
                fetchItemsAndCategories();
            } catch (error) {
                console.error("Error saving item:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: `Failed to save item: ${error.message}`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            }
        };

        const handleDelete = (id) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this item?",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ 
                            show: true, 
                            title: "Success", 
                            message: "Item deleted successfully!", 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                        fetchItemsAndCategories();
                    } catch (error) {
                        console.error("Error deleting item:", error);
                        setModal({ 
                            show: true, 
                            title: "Error", 
                            message: `Failed to delete item: ${error.message}`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Item Master</h2>
                
                {/* Info Banner for Item Code Generation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <div className="text-blue-600 mr-3">💡</div>
                        <div>
                            <h4 className="font-semibold text-blue-800">Auto Item Code Generation & Dynamic Fields</h4>
                            <p className="text-blue-700 text-sm">
                                Item codes are automatically generated based on your category and subcategory selection. 
                                Field labels update automatically when you select a subcategory, showing the custom field names you've defined.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* First Row - Category and Subcategory Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <SelectField
                            label="Category"
                            id="categorySelect"
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setSubcategoryId(''); // Reset subcategory when category changes
                                if (!editingItemId) setCode(''); // Clear code for new items
                            }}
                            options={categories.map(cat => ({ label: cat.category_name, value: cat.id }))}
                            required={true}
                        />
                        <SelectField
                            label="Subcategory"
                            id="subcategorySelect"
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            options={filteredSubcategories.map(sub => ({ label: sub.subcategory_name, value: sub.id }))}
                            required={true}
                            disabled={!categoryId}
                        />
                    </div>

                    {/* Second Row - Auto-generated Item Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div className="relative">
                            <InputField
                                label="Item Code (Auto-generated)"
                                id="code"
                                value={code}
                                readOnly={true}
                                className="bg-gray-100 cursor-not-allowed"
                                placeholder={categoryId && subcategoryId ? (isGeneratingCode ? "Generating..." : "Code will be generated") : "Select category and subcategory first"}
                            />
                            {isGeneratingCode && (
                                <div className="absolute right-3 top-9">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Third Row - Description Fields (Now comes before Item Name) */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Item Description Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                        <InputField 
                            label={field1Label} 
                            id="desc1" 
                            value={desc1} 
                            onChange={(e) => setDesc1(e.target.value)} 
                            placeholder={`Enter ${field1Label.toLowerCase()}`}
                        />
                        <InputField 
                            label={field2Label} 
                            id="desc2" 
                            value={desc2} 
                            onChange={(e) => setDesc2(e.target.value)} 
                            placeholder={`Enter ${field2Label.toLowerCase()}`}
                        />
                        <InputField 
                            label={field3Label} 
                            id="desc3" 
                            value={desc3} 
                            onChange={(e) => setDesc3(e.target.value)} 
                            placeholder={`Enter ${field3Label.toLowerCase()}`}
                        />
                        <InputField 
                            label={field4Label} 
                            id="desc4" 
                            value={desc4} 
                            onChange={(e) => setDesc4(e.target.value)} 
                            placeholder={`Enter ${field4Label.toLowerCase()}`}
                        />
                        <InputField 
                            label={field5Label} 
                            id="desc5" 
                            value={desc5} 
                            onChange={(e) => setDesc5(e.target.value)} 
                            placeholder={`Enter ${field5Label.toLowerCase()}`}
                        />
                    </div>

                    {/* Fourth Row - Item Name (Now comes after descriptions) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <InputField 
                            label="Item Name" 
                            id="itemName" 
                            value={itemName} 
                            onChange={(e) => setItemName(e.target.value)} 
                            required={true} 
                            placeholder="Enter specific item name" 
                        />
                        <InputField
                            label="Full Description (Auto-generated)"
                            id="fullDescription"
                            value={fullDescription}
                            readOnly={true}
                            className="bg-gray-100"
                            placeholder="Automatically combined from description fields"
                        />
                    </div>

                    {/* Fifth Row - Stock and Pricing Information */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Stock & Pricing Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6">
                        <InputField label="Current Stock" id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required={true} />
                        <InputField label="Minimum Level" id="minLevel" type="number" value={minLevel} onChange={(e) => setMinLevel(e.target.value)} required={true} />
                        <InputField label="Unit Rate" id="unitRate" type="number" step="0.01" value={unitRate} onChange={(e) => setUnitRate(e.target.value)} required={true} />
                        <InputField label="Rack/BIN Location" id="rackBin" value={rackBin} onChange={(e) => setRackBin(e.target.value)} placeholder="e.g., A1-B2" />
                    </div>

                    {/* Improved Form Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button 
                            type="submit" 
                            disabled={isGeneratingCode}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <span>📦</span>
                            {editingItemId ? 'Update Item' : 'Create Item'}
                        </Button>
                        <Button 
                            onClick={resetForm} 
                            type="button"
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>🔄</span>
                            {editingItemId ? 'Cancel Edit' : 'Clear Form'}
                        </Button>
                    </div>
                </form>

                {/* Items Table */}
                <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Existing Items</h3>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Subcategory</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-4 px-4 text-center text-gray-500">No items created yet.</td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800 font-mono font-medium">{item.item_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.item_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.subcategory_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.full_description}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.stock}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">₹{parseFloat(item.unit_rate).toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <Button onClick={() => handleEdit(item)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                                <Button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2">Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // Complete the SubcategoryManagerPage component
    const SubcategoryManagerPage = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [categories, setCategories] = useState([]);
        const [subcategories, setSubcategories] = useState([]);
        const [selectedCategoryId, setSelectedCategoryId] = useState('');
        const [subcategoryName, setSubcategoryName] = useState('');
        const [field1Name, setField1Name] = useState('');
        const [field2Name, setField2Name] = useState('');
        const [field3Name, setField3Name] = useState('');
        const [field4Name, setField4Name] = useState('');
        const [field5Name, setField5Name] = useState('');
        const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch categories
                const categoryResponse = await fetch(`${API_BASE_URL}/categories`);
                if (!categoryResponse.ok) throw new Error(`HTTP error! status: ${categoryResponse.status}`);
                const categoryData = await categoryResponse.json();
                setCategories(categoryData);

                // Fetch subcategories
                const subcategoryResponse = await fetch(`${API_BASE_URL}/subcategories`);
                if (!subcategoryResponse.ok) throw new Error(`HTTP error! status: ${subcategoryResponse.status}`);
                const subcategoryData = await subcategoryResponse.json();
                setSubcategories(subcategoryData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setModal({ show: true, title: "Error", message: "Failed to load data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, []);

        const resetForm = () => {
            setSelectedCategoryId('');
            setSubcategoryName('');
            setField1Name('');
            setField2Name('');
            setField3Name('');
            setField4Name('');
            setField5Name('');
            setEditingSubcategoryId(null);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const subcategoryData = {
                categoryId: Number(selectedCategoryId),
                subcategoryName,
                field1Name: field1Name || 'Description 1',
                field2Name: field2Name || 'Description 2',
                field3Name: field3Name || 'Description 3',
                field4Name: field4Name || 'Description 4',
                field5Name: field5Name || 'Description 5',
                userId
            };

            try {
                let response;
                if (editingSubcategoryId) {
                    response = await fetch(`${API_BASE_URL}/subcategories/${editingSubcategoryId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(subcategoryData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/subcategories`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(subcategoryData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ show: true, title: "Success", message: `Subcategory ${editingSubcategoryId ? 'updated' : 'created'} successfully!`, onClose: () => setModal({ ...modal, show: false }) });
                resetForm();
                fetchData();
            } catch (error) {
                console.error("Error saving subcategory:", error);
                setModal({ show: true, title: "Error", message: `Failed to save subcategory: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        const handleEdit = (subcategory) => {
            setEditingSubcategoryId(subcategory.id);
            setSelectedCategoryId(subcategory.category_id);
            setSubcategoryName(subcategory.subcategory_name);
            setField1Name(subcategory.field1_name || '');
            setField2Name(subcategory.field2_name || '');
            setField3Name(subcategory.field3_name || '');
            setField4Name(subcategory.field4_name || '');
            setField5Name(subcategory.field5_name || '');
        };

        const handleDelete = (id) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this subcategory?",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ show: true, title: "Success", message: "Subcategory deleted successfully!", onClose: () => setModal({ ...modal, show: false }) });
                        fetchData();
                    } catch (error) {
                        console.error("Error deleting subcategory:", error);
                        setModal({ show: true, title: "Error", message: `Failed to delete subcategory: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Subcategory Manager</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <SelectField
                        label="Category"
                        id="categorySelect"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        options={categories.map(cat => ({ label: cat.category_name, value: cat.id }))}
                        required={true}
                    />
                    <InputField 
                        label="Subcategory Name" 
                        id="subcategoryName" 
                        value={subcategoryName} 
                        onChange={(e) => setSubcategoryName(e.target.value)} 
                        required={true} 
                        placeholder="e.g., Electrical" 
                    />
                    <InputField 
                        label="Field 1 Label" 
                        id="field1Name" 
                        value={field1Name} 
                        onChange={(e) => setField1Name(e.target.value)} 
                        placeholder="e.g., Component Type" 
                    />
                    <InputField 
                        label="Field 2 Label" 
                        id="field2Name" 
                        value={field2Name} 
                        onChange={(e) => setField2Name(e.target.value)} 
                        placeholder="e.g., Specification" 
                    />
                    <InputField 
                        label="Field 3 Label" 
                        id="field3Name" 
                        value={field3Name} 
                        onChange={(e) => setField3Name(e.target.value)} 
                        placeholder="e.g., Power Rating" 
                    />
                    <InputField 
                        label="Field 4 Label" 
                        id="field4Name" 
                        value={field4Name} 
                        onChange={(e) => setField4Name(e.target.value)} 
                        placeholder="e.g., Voltage" 
                    />
                    <InputField 
                        label="Field 5 Label" 
                        id="field5Name" 
                        value={field5Name} 
                        onChange={(e) => setField5Name(e.target.value)} 
                        placeholder="e.g., Brand" 
                    />

                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        <Button type="submit">{editingSubcategoryId ? 'Update Subcategory' : 'Create Subcategory'}</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear</Button>
                    </div>
                </form>

                <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Existing Subcategories</h3>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Subcategory</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field 1</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field 2</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field 3</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field 4</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field 5</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-4 px-4 text-center text-gray-500">No subcategories created yet.</td>
                                    </tr>
                                ) : (
                                    subcategories.map((subcategory) => (
                                        <tr key={subcategory.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{subcategory.category_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">{subcategory.subcategory_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{subcategory.field1_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{subcategory.field2_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{subcategory.field3_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{subcategory.field4_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{subcategory.field5_name}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <Button onClick={() => handleEdit(subcategory)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                                <Button onClick={() => handleDelete(subcategory.id)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2">Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // 4. Gate Inward Form
    // Update the GateInwardForm component with these changes

    const GateInwardForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [parties, setParties] = useState([]);
        const [items, setItems] = useState([]);
        const [supplierId, setSupplierId] = useState(''); // Store supplier ID
        const [grn, setGrn] = useState(''); // Auto-generated GRN number
        const [grnDate, setGrnDate] = useState('');
        const [billNo, setBillNo] = useState(''); // Now optional
        const [billDate, setBillDate] = useState('');
        const [paymentTerms, setPaymentTerms] = useState('');
        const [inwardItems, setInwardItems] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, amount: 0, remark: '' }]);
        
        // New states for recent entries and editing
        const [recentEntries, setRecentEntries] = useState([]);
        const [editingEntry, setEditingEntry] = useState(null);
        const [isLoadingGrn, setIsLoadingGrn] = useState(false);
        
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        // Generate auto-increment GRN number
        const generateGrnNumber = async () => {
            if (editingEntry) return; // Don't generate new number when editing
            
            setIsLoadingGrn(true);
            try {
                const response = await fetch(`${API_BASE_URL}/gate-inwards/generate-grn-number`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setGrn(data.grnNumber);
            } catch (error) {
                console.error("Error generating GRN number:", error);
                // Fallback to timestamp-based number
                const timestamp = Date.now();
                setGrn(`GRN-${timestamp}`);
            } finally {
                setIsLoadingGrn(false);
            }
        };

        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch parties
                const partyResponse = await fetch(`${API_BASE_URL}/parties`);
                if (!partyResponse.ok) throw new Error(`HTTP error! status: ${partyResponse.status}`);
                const partyData = await partyResponse.json();
                setParties(partyData.map(p => ({ id: p.id, label: p.party_name, value: p.id })));

                // Fetch items
                const itemResponse = await fetch(`${API_BASE_URL}/items`);
                if (!itemResponse.ok) throw new Error(`HTTP error! status: ${itemResponse.status}`);
                const itemData = await itemResponse.json();
                setItems(itemData.map(i => ({ id: i.id, label: i.item_name, value: i.id, unitRate: parseFloat(i.unit_rate) })));
            } catch (error) {
                console.error("Error fetching initial data for Gate Inward:", error);
                setModal({ show: true, title: "Error", message: "Failed to load initial data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        const fetchRecentEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/gate-inwards?limit=5&orderBy=created_at&order=DESC`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRecentEntries(data);
            } catch (error) {
                console.error("Error fetching recent gate inward entries:", error);
            }
        };

        useEffect(() => {
            fetchInitialData();
            fetchRecentEntries();
            generateGrnNumber();
        }, []);

        const handleItemChange = (index, field, value) => {
            const updatedItems = [...inwardItems];
            updatedItems[index][field] = value;

            if (field === 'itemId') {
                const selectedItem = items.find(i => i.value === Number(value));
                if (selectedItem) {
                    updatedItems[index].unitRate = selectedItem.unitRate;
                }
            }
            if (field === 'unitRate' || field === 'qty') {
                const rate = Number(updatedItems[index].unitRate);
                const qty = Number(updatedItems[index].qty);
                updatedItems[index].amount = rate * qty;
            }
            setInwardItems(updatedItems);
        };

        const addItemRow = () => {
            setInwardItems([...inwardItems, { itemId: '', unitRate: 0, uom: '', qty: 0, amount: 0, remark: '' }]);
        };

        const removeItemRow = (index) => {
            const updatedItems = inwardItems.filter((_, i) => i !== index);
            setInwardItems(updatedItems);
        };

        const resetForm = () => {
            setSupplierId('');
            setGrn('');
            setGrnDate('');
            setBillNo('');
            setBillDate('');
            setPaymentTerms('');
            setInwardItems([{ itemId: '', unitRate: 0, uom: '', qty: 0, amount: 0, remark: '' }]);
            setEditingEntry(null);
            
            // Generate new GRN number only if not editing
            if (!editingEntry) {
                generateGrnNumber();
            }
        };


        const handleSubmit = async (e) => {
            e.preventDefault();
            const inwardData = {
                grn, // GRN is the primary identifier
                grnDate,
                billNo: billNo || null, // Bill number is optional
                billDate: billDate || null,
                supplierId: Number(supplierId),
                paymentTerms,
                items: inwardItems.map(item => ({
                    itemId: Number(item.itemId),
                    unitRate: Number(item.unitRate),
                    uom: item.uom,
                    qty: Number(item.qty),
                    amount: Number(item.amount),
                    remark: item.remark
                })),
                userId
            };

            try {
                let response;
                if (editingEntry) {
                    response = await fetch(`${API_BASE_URL}/gate-inwards/${editingEntry.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inwardData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/gate-inwards`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inwardData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ 
                    show: true, 
                    title: "Success", 
                    message: `Gate Inward entry ${editingEntry ? 'updated' : 'added'} successfully and stock updated!`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                resetForm();
                fetchRecentEntries();
            } catch (error) {
                console.error("Error saving gate inward entry:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: `Failed to save entry: ${error.message}`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            }
        };

        const handleEdit = (entry) => {
            setEditingEntry(entry);
            setSupplierId(entry.supplier_id);
            setGrn(entry.grn_number); // Set existing GRN for editing
            setGrnDate(entry.grn_date ? entry.grn_date.split('T')[0] : '');
            setBillNo(entry.bill_no || '');
            setBillDate(entry.bill_date ? entry.bill_date.split('T')[0] : '');
            setPaymentTerms(entry.payment_terms || '');
            
            // Populate items
            if (entry.items && entry.items.length > 0) {
                setInwardItems(entry.items.map(item => ({
                    itemId: item.item_id,
                    unitRate: parseFloat(item.unit_rate),
                    uom: item.uom,
                    qty: parseFloat(item.quantity),
                    amount: parseFloat(item.amount),
                    remark: item.remark || ''
                })));
            }
        };

        const handleDelete = (entryId) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this Gate Inward entry? This action cannot be undone and will affect stock levels.",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/gate-inwards/${entryId}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ 
                            show: true, 
                            title: "Success", 
                            message: "Gate Inward entry deleted successfully!", 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                        fetchRecentEntries();
                    } catch (error) {
                        console.error("Error deleting gate inward entry:", error);
                        setModal({ 
                            show: true, 
                            title: "Error", 
                            message: `Failed to delete entry: ${error.message}`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        const handlePrint = (entry) => {
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Gate Inward Receipt - ${entry.grn_number}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .document-title { font-size: 18px; color: #666; }
                        .details-section { margin: 20px 0; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                        .detail-item { padding: 5px 0; }
                        .detail-label { font-weight: bold; display: inline-block; width: 120px; }
                        .items-section { margin: 20px 0; }
                        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .items-table th { background-color: #f5f5f5; font-weight: bold; }
                        .total-row { background-color: #e8f4f8; font-weight: bold; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">Flour Mill ERP</div>
                        <div class="document-title">Gate Inward Receipt</div>
                    </div>
                    
                    <div class="details-section">
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">GRN Number:</span>
                                <span>${entry.grn_number}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">GRN Date:</span>
                                <span>${entry.grn_date ? new Date(entry.grn_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Supplier:</span>
                                <span>${entry.supplier_name}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Payment Terms:</span>
                                <span>${entry.payment_terms || 'N/A'}</span>
                            </div>
                            ${entry.bill_no ? `
                            <div class="detail-item">
                                <span class="detail-label">Bill Number:</span>
                                <span>${entry.bill_no}</span>
                            </div>
                            ` : ''}
                            ${entry.bill_date ? `
                            <div class="detail-item">
                                <span class="detail-label">Bill Date:</span>
                                <span>${new Date(entry.bill_date).toLocaleDateString()}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="items-section">
                        <h3>Items Received</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th>UOM</th>
                                    <th>Quantity</th>
                                    <th>Unit Rate</th>
                                    <th>Amount</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entry.items && entry.items.length > 0 ? 
                                    entry.items.map(item => `
                                        <tr>
                                            <td>${item.item_description}</td>
                                            <td>${item.uom}</td>
                                            <td>${item.quantity}</td>
                                            <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                            <td>₹${parseFloat(item.amount).toFixed(2)}</td>
                                            <td>${item.remark || '-'}</td>
                                        </tr>
                                    `).join('') : 
                                    '<tr><td colspan="6" style="text-align: center;">No items recorded</td></tr>'
                                }
                                <tr class="total-row">
                                    <td colspan="4" style="text-align: right;"><strong>Total Amount:</strong></td>
                                    <td><strong>₹${entry.items ? entry.items.reduce((total, item) => total + parseFloat(item.amount || 0), 0).toFixed(2) : '0.00'}</strong></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                        <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    {editingEntry ? 'Edit Gate Inward' : 'Gate Inward'}
                </h2>
                
                {/* Info Banner */}
                <div className={`border rounded-lg p-4 mb-6 ${editingEntry ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center">
                        <div className={`mr-3 ${editingEntry ? 'text-yellow-600' : 'text-blue-600'}`}>
                            {editingEntry ? '✏️' : '📥'}
                        </div>
                        <div>
                            <h4 className={`font-semibold ${editingEntry ? 'text-yellow-800' : 'text-blue-800'}`}>
                                {editingEntry ? 'Editing Gate Inward Entry' : 'Material Receipt Entry'}
                            </h4>
                            <p className={`text-sm ${editingEntry ? 'text-yellow-700' : 'text-blue-700'}`}>
                                {editingEntry ? 
                                    'You are editing an existing gate inward entry. Changes will update stock levels accordingly.' :
                                    'GRN number is auto-generated and serves as the unique identifier. Bill number is optional and can be added later.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div className="relative">
                            <InputField 
                                label="GRN Number (Auto-generated)" 
                                id="grn" 
                                value={grn} 
                                readOnly={true}
                                className="bg-gray-100 cursor-not-allowed"
                                placeholder={isLoadingGrn ? "Generating..." : "Auto-generated GRN number"}
                            />
                            {isLoadingGrn && (
                                <div className="absolute right-3 top-9">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <InputField 
                            label="GRN Date" 
                            id="grnDate" 
                            type="date" 
                            value={grnDate} 
                            onChange={(e) => setGrnDate(e.target.value)} 
                            required={true}
                            // max prop will be automatically set to today by InputField
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <SelectField label="Supplier" id="supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} options={parties} required={true} />
                        <InputField label="Payment Terms" id="paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="e.g., NET 30, Cash" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <InputField label="Bill Number (Optional)" id="billNo" value={billNo} onChange={(e) => setBillNo(e.target.value)} placeholder="Supplier's bill/invoice number" />
                        <InputField 
                            label="Bill Date (Optional)" 
                            id="billDate" 
                            type="date" 
                            value={billDate} 
                            onChange={(e) => setBillDate(e.target.value)}
                            // max prop will be automatically set to today by InputField
                        />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Items Received</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        inwardItems.map((item, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                {/* First Row - Main Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-2 mb-4">
                                    <SelectField 
                                        label="Item" 
                                        id={`item-${index}`} 
                                        value={item.itemId} 
                                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} 
                                        options={items} 
                                        required={true} 
                                        className="col-span-2" 
                                    />
                                    <InputField 
                                        label="Unit Rate" 
                                        id={`unitRate-${index}`} 
                                        type="number" 
                                        step="0.01" 
                                        value={item.unitRate} 
                                        onChange={(e) => handleItemChange(index, 'unitRate', e.target.value)} 
                                        required={true} 
                                    />
                                    <InputField 
                                        label="UOM" 
                                        id={`uom-${index}`} 
                                        value={item.uom} 
                                        onChange={(e) => handleItemChange(index, 'uom', e.target.value)} 
                                        placeholder="e.g., KG, PC" 
                                        required={true}
                                    />
                                    <InputField 
                                        label="Qty" 
                                        id={`qty-${index}`} 
                                        type="number" 
                                        value={item.qty} 
                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)} 
                                        required={true} 
                                    />
                                    <InputField 
                                        label="Amount" 
                                        id={`amount-${index}`} 
                                        type="number" 
                                        step="0.01" 
                                        value={item.amount} 
                                        readOnly={true} 
                                        className="bg-gray-100" 
                                    />
                                </div>
                                
                                {/* Second Row - Remark and Remove Button */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end">
                                    <div className="md:col-span-10">
                                        <InputField 
                                            label="Remark" 
                                            id={`remark-${index}`} 
                                            value={item.remark} 
                                            onChange={(e) => handleItemChange(index, 'remark', e.target.value)} 
                                            placeholder="Optional notes for this item"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button 
                                            onClick={() => removeItemRow(index)} 
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 h-10"
                                            type="button"
                                        >
                                            <span>🗑️</span>
                                            <span className="hidden md:inline">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="flex justify-end mb-6">
                        <Button onClick={addItemRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                            Add Another Item
                        </Button>
                    </div>

                    {/* Improved Form Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button 
                            type="submit"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>📦</span>
                            {editingEntry ? 'Update Gate Inward Entry' : 'Submit Inward Entry'}
                        </Button>
                        <Button 
                            onClick={resetForm} 
                            type="button"
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>🔄</span>
                            {editingEntry ? 'Cancel Edit' : 'Clear Form'}
                        </Button>
                    </div>
                </form>
                {/* Recent Entries Section */}
                <div className="mt-12 border-t-2 border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-400 pb-2">
                        Recent Gate Inward Entries (Last 5)
                    </h3>
                    
                    {recentEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">📥</div>
                            <p>No gate inward entries recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentEntries.map((entry) => (
                                <div key={entry.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">GRN Number:</span>
                                                <p className="text-lg font-bold text-blue-700">{entry.grn_number}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">GRN Date:</span>
                                                <p className="text-gray-800">{entry.grn_date ? new Date(entry.grn_date).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Supplier:</span>
                                                <p className="text-gray-800">{entry.supplier_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
                                                <p className="text-gray-800 font-bold">₹{entry.items ? entry.items.reduce((total, item) => total + parseFloat(item.amount || 0), 0).toFixed(2) : '0.00'}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Button 
                                                onClick={() => handleEdit(entry)} 
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                ✏️ Edit
                                            </Button>
                                            <Button 
                                                onClick={() => handlePrint(entry)} 
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🖨️ Print
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(entry.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-semibold text-blue-700 mb-2">📦 Items Received</h4>
                                        {entry.items && entry.items.length > 0 ? (
                                            <div className="space-y-1">
                                                {entry.items.map((item, idx) => (
                                                    <div key={idx} className="text-sm text-gray-700">
                                                        <strong>{item.item_description}</strong> - {item.quantity} {item.uom} @ ₹{parseFloat(item.unit_rate).toFixed(2)} = ₹{parseFloat(item.amount).toFixed(2)}
                                                        {item.remark && <span className="text-gray-500"> ({item.remark})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No items recorded</p>
                                        )}
                                    </div>
                                    
                                    {(entry.bill_no || entry.payment_terms) && (
                                        <div className="mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600">
                                            {entry.bill_no && <span className="mr-4"><strong>Bill#:</strong> {entry.bill_no}</span>}
                                            {entry.payment_terms && <span><strong>Payment:</strong> {entry.payment_terms}</span>}
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-500">
                                        Created: {new Date(entry.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // 5. Issue Note - Internal Form
    // Updated Issue Note - Internal Form
        // Update the IssueNoteInternalForm component with recent entries functionality

        // Update the IssueNoteInternalForm component
    const IssueNoteInternalForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [departments, setDepartments] = useState([
            { label: 'Production', value: 'Production' },
            { label: 'Assembly', value: 'Assembly' },
            { label: 'Quality Control', value: 'Quality Control' },
            { label: 'R&D', value: 'R&D' }
        ]);
        const [rawMaterialItems, setRawMaterialItems] = useState([]);
        const [department, setDepartment] = useState('');
        const [issueNo, setIssueNo] = useState('');
        const [issueDate, setIssueDate] = useState('');
        const [issuedBy, setIssuedBy] = useState('');
        const [issuedItems, setIssuedItems] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableStock: 0 }]);
        
        // New states for recent entries and editing
        const [recentEntries, setRecentEntries] = useState([]);
        const [editingEntry, setEditingEntry] = useState(null);
        const [isLoadingIssueNo, setIsLoadingIssueNo] = useState(false);
        
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        // Generate auto-increment issue number
        const generateIssueNumber = async () => {
            if (editingEntry) return; // Don't generate new number when editing
            
            setIsLoadingIssueNo(true);
            try {
                const response = await fetch(`${API_BASE_URL}/issue-notes-internal/generate-issue-number`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setIssueNo(data.issueNumber);
            } catch (error) {
                console.error("Error generating issue number:", error);
                // Fallback to timestamp-based number
                const timestamp = Date.now();
                setIssueNo(`ISS-${timestamp.toString().slice(-3)}`);
            } finally {
                setIsLoadingIssueNo(false);
            }
        };

        const fetchRawMaterials = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/items/by-category/Raw Material`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRawMaterialItems(data.map(i => ({ 
                    id: i.id, 
                    label: i.item_name, 
                    value: i.id, 
                    unitRate: parseFloat(i.unit_rate), 
                    stock: i.stock,
                    itemCode: i.item_code,
                    description: i.full_description,
                    categoryName: i.category_name
                })));
            } catch (error) {
                console.error("Error fetching raw materials for issue note:", error);
                setModal({ show: true, title: "Error", message: "Failed to load raw materials. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        const fetchRecentEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/issue-notes-internal?limit=5&orderBy=created_at&order=DESC`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRecentEntries(data);
            } catch (error) {
                console.error("Error fetching recent issue note entries:", error);
            }
        };

        useEffect(() => {
            fetchRawMaterials();
            fetchRecentEntries();
            generateIssueNumber(); // Generate issue number on component mount
        }, []);

        const handleItemChange = (index, field, value) => {
            const updatedItems = [...issuedItems];
            updatedItems[index][field] = value;

            if (field === 'itemId') {
                const selectedItem = rawMaterialItems.find(i => i.value === Number(value));
                if (selectedItem) {
                    updatedItems[index].unitRate = selectedItem.unitRate;
                    updatedItems[index].availableStock = selectedItem.stock;
                }
            }
            setIssuedItems(updatedItems);
        };

        const addItemRow = () => {
            setIssuedItems([...issuedItems, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableStock: 0 }]);
        };

        const removeItemRow = (index) => {
            const updatedItems = issuedItems.filter((_, i) => i !== index);
            setIssuedItems(updatedItems);
        };

        const resetForm = () => {
            setDepartment('');
            setIssueNo('');
            setIssueDate('');
            setIssuedBy('');
            setIssuedItems([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableStock: 0 }]);
            setEditingEntry(null);
            
            // Generate new issue number only if not editing
            if (!editingEntry) {
                generateIssueNumber();
            }
        };

        const validateStock = () => {
            for (let item of issuedItems) {
                if (Number(item.qty) > item.availableStock) {
                    const selectedItem = rawMaterialItems.find(i => i.value === Number(item.itemId));
                    setModal({ 
                        show: true, 
                        title: "Insufficient Stock", 
                        message: `${selectedItem?.label || 'Selected item'} has only ${item.availableStock} units available in main stock, but you're trying to issue ${item.qty} units.`, 
                        onClose: () => setModal({ ...modal, show: false }) 
                    });
                    return false;
                }
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            // Validate stock before submission (only for new entries)
            if (!editingEntry && !validateStock()) {
                return;
            }

            const issueData = {
                department,
                issueNo,
                issueDate,
                issuedBy,
                items: issuedItems.map(item => ({
                    itemId: Number(item.itemId),
                    unitRate: Number(item.unitRate),
                    uom: item.uom,
                    qty: Number(item.qty),
                    remark: item.remark
                })),
                userId
            };

            try {
                let response;
                if (editingEntry) {
                    response = await fetch(`${API_BASE_URL}/issue-notes-internal/${editingEntry.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(issueData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/issue-notes-internal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(issueData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                setModal({ 
                    show: true, 
                    title: "Success", 
                    message: `Issue Note ${editingEntry ? 'updated' : 'created'} successfully! ${result.actualIssueNo ? `Issue Number: ${result.actualIssueNo}` : ''} Raw materials ${editingEntry ? 'updated on' : 'moved to'} production floor and main stock updated.`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                resetForm();
                fetchRawMaterials(); // Re-fetch to update stock display
                fetchRecentEntries(); // Re-fetch recent entries
            } catch (error) {
                console.error("Error saving issue note entry:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: `Failed to save entry: ${error.message}`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            }
        };

        const handleEdit = (entry) => {
            setEditingEntry(entry);
            setDepartment(entry.department);
            setIssueNo(entry.issue_no);
            setIssueDate(entry.issue_date ? entry.issue_date.split('T')[0] : '');
            setIssuedBy(entry.issued_by);
            
            // Populate items
            if (entry.items && entry.items.length > 0) {
                setIssuedItems(entry.items.map(item => ({
                    itemId: item.item_id,
                    unitRate: parseFloat(item.unit_rate),
                    uom: item.uom,
                    qty: parseFloat(item.quantity),
                    remark: item.remark || '',
                    availableStock: parseFloat(item.quantity) // Set current quantity as available for editing
                })));
            }
        };

        const handleDelete = (entryId) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this Issue Note? This action cannot be undone and will affect stock levels.",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/issue-notes-internal/${entryId}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ 
                            show: true, 
                            title: "Success", 
                            message: "Issue Note deleted successfully!", 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                        fetchRecentEntries(); // Re-fetch recent entries
                        fetchRawMaterials(); // Re-fetch materials to update stock
                    } catch (error) {
                        console.error("Error deleting issue note entry:", error);
                        setModal({ 
                            show: true, 
                            title: "Error", 
                            message: `Failed to delete entry: ${error.message}`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        const handlePrint = (entry) => {
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Issue Note Internal - ${entry.issue_no}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .document-title { font-size: 18px; color: #666; }
                        .details-section { margin: 20px 0; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                        .detail-item { padding: 5px 0; }
                        .detail-label { font-weight: bold; display: inline-block; width: 120px; }
                        .items-section { margin: 20px 0; }
                        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .items-table th { background-color: #f5f5f5; font-weight: bold; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">Flour Mill ERP</div>
                        <div class="document-title">Internal Issue Note</div>
                    </div>
                    
                    <div class="details-section">
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">Issue No:</span>
                                <span>${entry.issue_no}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Issue Date:</span>
                                <span>${entry.issue_date ? new Date(entry.issue_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Department:</span>
                                <span>${entry.department}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Issued By:</span>
                                <span>${entry.issued_by}</span>
                            </div>
                        </div>
                    </div>

                    <div class="items-section">
                        <h3>Raw Materials Issued to Production Floor</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th>UOM</th>
                                    <th>Quantity Issued</th>
                                    <th>Unit Rate</th>
                                    <th>Total Value</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entry.items && entry.items.length > 0 ? 
                                    entry.items.map(item => `
                                        <tr>
                                            <td>${item.item_description}</td>
                                            <td>${item.uom}</td>
                                            <td>${item.quantity}</td>
                                            <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                            <td>₹${(parseFloat(item.quantity) * parseFloat(item.unit_rate)).toFixed(2)}</td>
                                            <td>${item.remark || '-'}</td>
                                        </tr>
                                    `).join('') : 
                                    '<tr><td colspan="6" style="text-align: center;">No items recorded</td></tr>'
                                }
                                <tr style="background-color: #e8f4f8; font-weight: bold;">
                                    <td colspan="4" style="text-align: right;"><strong>Total Value:</strong></td>
                                    <td><strong>₹${entry.items ? entry.items.reduce((total, item) => total + (parseFloat(item.quantity) * parseFloat(item.unit_rate)), 0).toFixed(2) : '0.00'}</strong></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                        <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    {editingEntry ? 'Edit Issue Note (Internal)' : 'Issue Note - Internal (Raw Material to Production Floor)'}
                </h2>
                
                {/* Info Banner */}
                <div className={`border rounded-lg p-4 mb-6 ${editingEntry ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center">
                        <div className={`mr-3 ${editingEntry ? 'text-yellow-600' : 'text-blue-600'}`}>
                            {editingEntry ? '✏️' : 'ℹ️'}
                        </div>
                        <div>
                            <h4 className={`font-semibold ${editingEntry ? 'text-yellow-800' : 'text-blue-800'}`}>
                                {editingEntry ? 'Editing Issue Note' : 'Production Material Issue'}
                            </h4>
                            <p className={`text-sm ${editingEntry ? 'text-yellow-700' : 'text-blue-700'}`}>
                                {editingEntry ? 
                                    'You are editing an existing issue note. Changes will update stock levels accordingly.' :
                                    'Issue number is auto-generated. This form transfers raw materials from main warehouse stock to production floor. Materials will be available for production processes and finished goods creation.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <SelectField label="Department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} options={departments} required={true} />
                        <div className="relative">
                            <InputField 
                                label="Issue No. (Auto-generated)" 
                                id="issueNo" 
                                value={issueNo} 
                                onChange={(e) => setIssueNo(e.target.value)} 
                                required={true} 
                                readOnly={!editingEntry}
                                className={!editingEntry ? "bg-gray-100 cursor-not-allowed" : ""}
                                placeholder={isLoadingIssueNo ? "Generating..." : "Auto-generated issue number"}
                            />
                            {isLoadingIssueNo && (
                                <div className="absolute right-3 top-9">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <InputField 
                            label="Issue Date" 
                            id="issueDate" 
                            type="date" 
                            value={issueDate} 
                            onChange={(e) => setIssueDate(e.target.value)} 
                            required={true}
                        />
                        <InputField label="Issued By" id="issuedBy" value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} required={true} placeholder="e.g., John Doe" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Raw Materials to Issue</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        issuedItems.map((item, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                {/* First Row - Main Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-2 mb-4">
                                    <SelectField 
                                        label="Raw Material Item" 
                                        id={`issuedItem-${index}`} 
                                        value={item.itemId} 
                                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} 
                                        options={rawMaterialItems} 
                                        required={true} 
                                        className="col-span-2" 
                                    />
                                    <InputField 
                                        label="Unit Rate" 
                                        id={`issuedUnitRate-${index}`} 
                                        type="number" 
                                        step="0.01"
                                        value={item.unitRate} 
                                        readOnly={true} 
                                        className="bg-gray-100" 
                                    />
                                    <InputField 
                                        label="UOM" 
                                        id={`issuedUom-${index}`} 
                                        value={item.uom} 
                                        onChange={(e) => handleItemChange(index, 'uom', e.target.value)} 
                                        placeholder="e.g., KG, PC" 
                                        required={true}
                                    />
                                    <div>
                                        <InputField 
                                            label={`Qty ${!editingEntry ? `(Available: ${item.availableStock})` : ''}`}
                                            id={`issuedQty-${index}`} 
                                            type="number" 
                                            value={item.qty} 
                                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)} 
                                            required={true}
                                            className={!editingEntry && Number(item.qty) > item.availableStock ? 'border-red-500 bg-red-50' : ''}
                                        />
                                        {!editingEntry && Number(item.qty) > item.availableStock && (
                                            <p className="text-red-500 text-xs mt-1">⚠️ Exceeds available stock</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Second Row - Remark and Remove Button */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end">
                                    <div className="md:col-span-10">
                                        <InputField 
                                            label="Remark" 
                                            id={`issuedRemark-${index}`} 
                                            value={item.remark} 
                                            onChange={(e) => handleItemChange(index, 'remark', e.target.value)} 
                                            placeholder="Optional notes about this material issue"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button 
                                            onClick={() => removeItemRow(index)} 
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 h-10"
                                            type="button"
                                        >
                                            <span>🗑️</span>
                                            <span className="hidden md:inline">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="flex justify-end mb-6">
                        <Button onClick={addItemRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                            Add Another Raw Material
                        </Button>
                    </div>

                    {/* Improved Form Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button 
                            type="submit"
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>📤</span>
                            {editingEntry ? 'Update Issue Note' : 'Issue Materials to Production Floor'}
                        </Button>
                        <Button 
                            onClick={resetForm} 
                            type="button"
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>🔄</span>
                            {editingEntry ? 'Cancel Edit' : 'Clear Form'}
                        </Button>
                    </div>
                </form>

                {/* Recent Entries Section */}
                <div className="mt-12 border-t-2 border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-400 pb-2">
                        Recent Issue Notes (Last 5)
                    </h3>
                    
                    {recentEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">📤</div>
                            <p>No issue notes recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentEntries.map((entry) => (
                                <div key={entry.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Issue No:</span>
                                                <p className="text-lg font-bold text-red-700">{entry.issue_no}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Issue Date:</span>
                                                <p className="text-gray-800">{entry.issue_date ? new Date(entry.issue_date).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Department:</span>
                                                <p className="text-gray-800">{entry.department}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Issued By:</span>
                                                <p className="text-gray-800">{entry.issued_by}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Button 
                                                onClick={() => handleEdit(entry)} 
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                ✏️ Edit
                                            </Button>
                                            <Button 
                                                onClick={() => handlePrint(entry)} 
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🖨️ Print
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(entry.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="border-l-4 border-red-500 pl-4">
                                        <h4 className="font-semibold text-red-700 mb-2">📤 Raw Materials Issued</h4>
                                        {entry.items && entry.items.length > 0 ? (
                                            <div className="space-y-1">
                                                {entry.items.map((item, idx) => (
                                                    <div key={idx} className="text-sm text-gray-700">
                                                        <strong>{item.item_description}</strong> - {item.quantity} {item.uom} @ ₹{parseFloat(item.unit_rate).toFixed(2)}
                                                        {item.remark && <span className="text-gray-500"> ({item.remark})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No items recorded</p>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-500">
                                        Created: {new Date(entry.created_at).toLocaleString()}
                                        {entry.updated_at && entry.updated_at !== entry.created_at && (
                                            <span className="ml-4">| Updated: {new Date(entry.updated_at).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };


    // Update the InwardInternalForm component to use a simpler structure
const InwardInternalForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [departments, setDepartments] = useState([
            { label: 'Production', value: 'Production' },
            { label: 'Assembly', value: 'Assembly' },
        ]);
        const [finishedGoodsItems, setFinishedGoodsItems] = useState([]); // Finished goods from main stock
        const [productionFloorMaterials, setProductionFloorMaterials] = useState([]); // Raw materials on production floor
        const [receiptNo, setReceiptNo] = useState('');
        const [recvDate, setRecvDate] = useState('');
        const [receivedBy, setReceivedBy] = useState('');
        const [department, setDepartment] = useState('');
        const [finishGoods, setFinishGoods] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        const [materialUsed, setMaterialUsed] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableQty: 0 }]);
        
        // New states for recent entries and editing
        const [recentEntries, setRecentEntries] = useState([]);
        const [editingEntry, setEditingEntry] = useState(null);
        const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
        
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        // Generate auto-increment receipt number
        const generateReceiptNumber = async () => {
            if (editingEntry) return; // Don't generate new number when editing
            
            setIsLoadingReceipt(true);
            try {
                const response = await fetch(`${API_BASE_URL}/inward-internals/generate-receipt-number`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setReceiptNo(data.receiptNumber);
            } catch (error) {
                console.error("Error generating receipt number:", error);
                // Fallback to timestamp-based number with proper formatting
                const timestamp = Date.now();
                const formattedNumber = `REC-${String(timestamp).slice(-6).padStart(3, '0')}`;
                setReceiptNo(formattedNumber);
            } finally {
                setIsLoadingReceipt(false);
            }
        };

        const fetchItems = async () => {
            setIsLoading(true);
            try {
                // Fetch finished goods from main stock
                const finishedGoodsResponse = await fetch(`${API_BASE_URL}/items/by-category/Finish Good`);
                if (!finishedGoodsResponse.ok) throw new Error(`HTTP error! status: ${finishedGoodsResponse.status}`);
                const finishedGoodsData = await finishedGoodsResponse.json();
                setFinishedGoodsItems(finishedGoodsData.map(item => ({
                    id: item.id,
                    label: `${item.item_name} - ${item.full_description}`,
                    value: item.id,
                    unitRate: parseFloat(item.unit_rate),
                    stock: item.stock
                })));

                // Fetch raw materials available on production floor
                const productionFloorResponse = await fetch(`${API_BASE_URL}/production-floor-stocks`);
                if (!productionFloorResponse.ok) throw new Error(`HTTP error! status: ${productionFloorResponse.status}`);
                const productionFloorData = await productionFloorResponse.json();
                setProductionFloorMaterials(productionFloorData.map(item => ({
                    id: item.id,
                    label: `${item.item_code} - ${item.item_description}`,
                    value: item.item_id,
                    unitRate: parseFloat(item.unit_rate),
                    availableQty: item.quantity,
                    uom: item.uom
                })));
            } catch (error) {
                console.error("Error fetching items for inward internal:", error);
                setModal({ show: true, title: "Error", message: "Failed to load items. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        const fetchRecentEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/inward-internals?limit=5&orderBy=created_at&order=DESC`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRecentEntries(data);
            } catch (error) {
                console.error("Error fetching recent inward internal entries:", error);
            }
        };

        useEffect(() => {
            fetchItems();
            fetchRecentEntries();
            generateReceiptNumber();
            
            // Set today's date as default for received date
            const today = new Date().toISOString().split('T')[0];
            setRecvDate(today);
        }, []);

        // Handle changes for finished goods items
        const handleFinishGoodChange = (index, field, value) => {
            const updatedItems = [...finishGoods];
            updatedItems[index][field] = value;

            if (field === 'itemId') {
                const selectedItem = finishedGoodsItems.find(i => i.value === Number(value));
                if (selectedItem) {
                    updatedItems[index].unitRate = selectedItem.unitRate;
                }
            }
            setFinishGoods(updatedItems);
        };

        // Handle changes for material used items (from production floor)
        const handleMaterialUsedChange = (index, field, value) => {
            const updatedItems = [...materialUsed];
            updatedItems[index][field] = value;

            if (field === 'itemId') {
                const selectedItem = productionFloorMaterials.find(i => i.value === Number(value));
                if (selectedItem) {
                    updatedItems[index].unitRate = selectedItem.unitRate;
                    updatedItems[index].availableQty = selectedItem.availableQty;
                    updatedItems[index].uom = selectedItem.uom;
                }
            }
            setMaterialUsed(updatedItems);
        };

        const addFinishGoodRow = () => {
            setFinishGoods([...finishGoods, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        };

        const removeFinishGoodRow = (index) => {
            const updatedItems = finishGoods.filter((_, i) => i !== index);
            setFinishGoods(updatedItems);
        };

        const addMaterialUsedRow = () => {
            setMaterialUsed([...materialUsed, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableQty: 0 }]);
        };

        const removeMaterialUsedRow = (index) => {
            const updatedItems = materialUsed.filter((_, i) => i !== index);
            setMaterialUsed(updatedItems);
        };

        const resetForm = () => {
            setReceiptNo('');
            setRecvDate('');
            setReceivedBy('');
            setDepartment('');
            setFinishGoods([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
            setMaterialUsed([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableQty: 0 }]);
            setEditingEntry(null);
            generateReceiptNumber();
        };

        const validateProductionFloorStock = () => {
            for (let item of materialUsed) {
                if (Number(item.qty) > item.availableQty) {
                    const selectedItem = productionFloorMaterials.find(i => i.value === Number(item.itemId));
                    setModal({ 
                        show: true, 
                        title: "Insufficient Production Floor Stock", 
                        message: `${selectedItem?.label || 'Selected material'} has only ${item.availableQty} units available on production floor, but you're trying to use ${item.qty} units.`, 
                        onClose: () => setModal({ ...modal, show: false }) 
                    });
                    return false;
                }
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            // Validate production floor stock before submission
            if (!validateProductionFloorStock()) {
                return;
            }

            const inwardData = {
                receiptNo,
                receivedDate: recvDate,
                receivedBy,
                department,
                finishGoods: finishGoods.map(item => ({
                    itemId: Number(item.itemId),
                    unitRate: Number(item.unitRate),
                    uom: item.uom,
                    qty: Number(item.qty),
                    remark: item.remark
                })),
                materialUsed: materialUsed.map(item => ({
                    itemId: Number(item.itemId),
                    unitRate: Number(item.unitRate),
                    uom: item.uom,
                    qty: Number(item.qty),
                    remark: item.remark
                })),
                userId
            };

            try {
                let response;
                if (editingEntry) {
                    response = await fetch(`${API_BASE_URL}/inward-internals/${editingEntry.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inwardData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/inward-internals`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inwardData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ 
                    show: true, 
                    title: "Success", 
                    message: `Production entry ${editingEntry ? 'updated' : 'recorded'} successfully! Finished goods ${editingEntry ? 'updated in' : 'added to'} stock and materials consumed from production floor.`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                resetForm();
                fetchItems(); // Re-fetch items to update stock display
                fetchRecentEntries(); // Re-fetch recent entries
            } catch (error) {
                console.error("Error saving inward internal entry:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: `Failed to save entry: ${error.message}`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            }
        };

        const handleEdit = (entry) => {
            setEditingEntry(entry);
            setReceiptNo(entry.receipt_no);
            setRecvDate(entry.received_date.split('T')[0]); // Format date for input
            setReceivedBy(entry.received_by);
            setDepartment(entry.department);
            
            // Populate finished goods
            if (entry.finishGoods && entry.finishGoods.length > 0) {
                setFinishGoods(entry.finishGoods.map(item => ({
                    itemId: item.item_id,
                    unitRate: parseFloat(item.unit_rate),
                    uom: item.uom,
                    qty: parseFloat(item.quantity),
                    remark: item.remark || ''
                })));
            }
            
            // Populate materials used
            if (entry.materialUsed && entry.materialUsed.length > 0) {
                setMaterialUsed(entry.materialUsed.map(item => ({
                    itemId: item.item_id,
                    unitRate: parseFloat(item.unit_rate),
                    uom: item.uom,
                    qty: parseFloat(item.quantity),
                    remark: item.remark || '',
                    availableQty: parseFloat(item.quantity) // Set current quantity as available for editing
                })));
            }
        };

        const handleDelete = (entryId) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this production entry? This action cannot be undone.",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/inward-internals/${entryId}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ 
                            show: true, 
                            title: "Success", 
                            message: "Production entry deleted successfully!", 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                        fetchRecentEntries(); // Re-fetch recent entries
                        fetchItems(); // Re-fetch items to update stock
                    } catch (error) {
                        console.error("Error deleting inward internal entry:", error);
                        setModal({ 
                            show: true, 
                            title: "Error", 
                            message: `Failed to delete entry: ${error.message}`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        const handlePrint = (entry) => {
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Production Entry - ${entry.receipt_no}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .document-title { font-size: 18px; color: #666; }
                        .details-section { margin: 20px 0; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                        .detail-item { padding: 5px 0; }
                        .detail-label { font-weight: bold; display: inline-block; width: 120px; }
                        .items-section { margin: 20px 0; }
                        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .items-table th { background-color: #f5f5f5; font-weight: bold; }
                        .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; color: #333; }
                        .finished-goods { border-left: 4px solid #10b981; padding-left: 10px; }
                        .materials-used { border-left: 4px solid #ef4444; padding-left: 10px; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">Flour Mill ERP</div>
                        <div class="document-title">Production Entry Receipt</div>
                    </div>
                    
                    <div class="details-section">
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">Receipt No:</span>
                                <span>${entry.receipt_no}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Date:</span>
                                <span>${new Date(entry.received_date).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Department:</span>
                                <span>${entry.department}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Received By:</span>
                                <span>${entry.received_by}</span>
                            </div>
                        </div>
                    </div>

                    <div class="items-section finished-goods">
                        <div class="section-title">✅ Finished Goods Produced</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th>UOM</th>
                                    <th>Quantity</th>
                                    <th>Unit Rate</th>
                                    <th>Total Value</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entry.finishGoods && entry.finishGoods.length > 0 ? 
                                    entry.finishGoods.map(item => `
                                        <tr>
                                            <td>${item.item_description}</td>
                                            <td>${item.uom}</td>
                                            <td>${item.quantity}</td>
                                            <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                            <td>₹${(parseFloat(item.quantity) * parseFloat(item.unit_rate)).toFixed(2)}</td>
                                            <td>${item.remark || '-'}</td>
                                        </tr>
                                    `).join('') : 
                                    '<tr><td colspan="6" style="text-align: center;">No finished goods recorded</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>

                    <div class="items-section materials-used">
                        <div class="section-title">❌ Raw Materials Consumed</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Material Description</th>
                                    <th>UOM</th>
                                    <th>Quantity Used</th>
                                    <th>Unit Rate</th>
                                    <th>Total Value</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entry.materialUsed && entry.materialUsed.length > 0 ? 
                                    entry.materialUsed.map(item => `
                                        <tr>
                                            <td>${item.item_description}</td>
                                            <td>${item.uom}</td>
                                            <td>${item.quantity}</td>
                                            <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                            <td>₹${(parseFloat(item.quantity) * parseFloat(item.unit_rate)).toFixed(2)}</td>
                                            <td>${item.remark || '-'}</td>
                                        </tr>
                                    `).join('') : 
                                    '<tr><td colspan="6" style="text-align: center;">No materials consumed recorded</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                        <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    {editingEntry ? 'Edit Production Entry' : 'Inward - Internal (Production to Finished Goods)'}
                </h2>
                
                {/* Info Banner */}
                <div className={`border rounded-lg p-4 mb-6 ${editingEntry ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center">
                        <div className={`mr-3 ${editingEntry ? 'text-yellow-600' : 'text-green-600'}`}>
                            {editingEntry ? '✏️' : '🏭'}
                        </div>
                        <div>
                            <h4 className={`font-semibold ${editingEntry ? 'text-yellow-800' : 'text-green-800'}`}>
                                {editingEntry ? 'Editing Production Entry' : 'Production Completion Entry'}
                            </h4>
                            <p className={`text-sm ${editingEntry ? 'text-yellow-700' : 'text-green-700'}`}>
                                {editingEntry ? 
                                    'You are editing an existing production entry. Changes will update stock levels accordingly.' :
                                    'Record finished goods created and raw materials consumed from production floor. This will update main stock with new finished goods and reduce production floor material quantities.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div className="relative">
                            <InputField 
                                label="Receipt No. (Auto-generated)" 
                                id="receiptNo" 
                                value={receiptNo} 
                                readOnly={true}
                                className="bg-gray-100 cursor-not-allowed"
                                placeholder={isLoadingReceipt ? "Generating..." : "Auto-generated receipt number"}
                            />
                            {isLoadingReceipt && (
                                <div className="absolute right-3 top-9">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <InputField label="Production Date" id="recvDate" type="date" value={recvDate} onChange={(e) => setRecvDate(e.target.value)} required={true} />
                        <InputField label="Received By" id="receivedBy" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} required={true} placeholder="e.g., Production Manager" />
                        <SelectField label="Department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} options={departments} required={true} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 text-green-700">
                        ✅ Finished Goods Produced
                    </h3>
                    {isLoading ? <LoadingSpinner /> : (
                        finishGoods.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-2 mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                                <SelectField 
                                    label="Finished Good Item" 
                                    id={`fgItem-${index}`} 
                                    value={item.itemId} 
                                    onChange={(e) => handleFinishGoodChange(index, 'itemId', e.target.value)} 
                                    options={finishedGoodsItems} 
                                    required={true} 
                                    className="col-span-2" 
                                />
                                <InputField label="Unit Rate" id={`fgUnitRate-${index}`} type="number" step="0.01" value={item.unitRate} readOnly={true} className="bg-gray-100" />
                                <InputField label="UOM" id={`fgUom-${index}`} value={item.uom} onChange={(e) => handleFinishGoodChange(index, 'uom', e.target.value)} placeholder="e.g., PC" required={true} />
                                <InputField label="Quantity Produced" id={`fgQty-${index}`} type="number" value={item.qty} onChange={(e) => handleFinishGoodChange(index, 'qty', e.target.value)} required={true} />
                                <div className="flex items-end justify-end">
                                    <Button onClick={() => removeFinishGoodRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Production Notes" id={`fgRemark-${index}`} value={item.remark} onChange={(e) => handleFinishGoodChange(index, 'remark', e.target.value)} className="col-span-full" placeholder="Notes about this production batch" />
                            </div>
                        ))
                    )}
                    <div className="flex justify-end mb-6">
                        <Button onClick={addFinishGoodRow} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">Add Another Finished Good</Button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 text-red-700">
                        ❌ Raw Materials Consumed (From Production Floor)
                    </h3>
                    {isLoading ? <LoadingSpinner /> : (
                        materialUsed.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-2 mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                                <SelectField 
                                    label="Production Floor Material" 
                                    id={`muItem-${index}`} 
                                    value={item.itemId} 
                                    onChange={(e) => handleMaterialUsedChange(index, 'itemId', e.target.value)} 
                                    options={productionFloorMaterials} 
                                    required={true} 
                                    className="col-span-2" 
                                />
                                <InputField label="Unit Rate" id={`muUnitRate-${index}`} type="number" step="0.01" value={item.unitRate} readOnly={true} className="bg-gray-100" />
                                <InputField label="UOM" id={`muUom-${index}`} value={item.uom} readOnly={true} className="bg-gray-100" />
                                <div>
                                    <InputField 
                                        label={`Qty Used ${!editingEntry ? `(Available: ${item.availableQty})` : ''}`}
                                        id={`muQty-${index}`} 
                                        type="number" 
                                        value={item.qty} 
                                        onChange={(e) => handleMaterialUsedChange(index, 'qty', e.target.value)} 
                                        required={true}
                                        className={!editingEntry && Number(item.qty) > item.availableQty ? 'border-red-500 bg-red-100' : ''}
                                    />
                                    {!editingEntry && Number(item.qty) > item.availableQty && (
                                        <p className="text-red-600 text-xs mt-1">⚠️ Exceeds production floor stock</p>
                                    )}
                                </div>
                                <div className="flex items-end justify-end">
                                    <Button onClick={() => removeMaterialUsedRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Usage Notes" id={`muRemark-${index}`} value={item.remark} onChange={(e) => handleMaterialUsedChange(index, 'remark', e.target.value)} className="col-span-full" placeholder="Notes about material consumption" />
                            </div>
                        ))
                    )}
                    <div className="flex justify-end mb-6">
                        <Button onClick={addMaterialUsedRow} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Add Another Material Used</Button>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="submit">
                            {editingEntry ? 'Update Production Entry' : 'Record Production Entry'}
                        </Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">
                            {editingEntry ? 'Cancel Edit' : 'Clear Form'}
                        </Button>
                    </div>
                </form>

                {/* Recent Entries Section */}
                <div className="mt-12 border-t-2 border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-400 pb-2">
                        Recent Production Entries (Last 5)
                    </h3>
                    
                    {recentEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">📝</div>
                            <p>No production entries recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentEntries.map((entry) => (
                                <div key={entry.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Receipt No:</span>
                                                <p className="text-lg font-bold text-blue-700">{entry.receipt_no}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Date:</span>
                                                <p className="text-gray-800">{new Date(entry.received_date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Department:</span>
                                                <p className="text-gray-800">{entry.department}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Received By:</span>
                                                <p className="text-gray-800">{entry.received_by}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Button 
                                                onClick={() => handleEdit(entry)} 
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                ✏️ Edit
                                            </Button>
                                            <Button 
                                                onClick={() => handlePrint(entry)} 
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🖨️ Print
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(entry.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-l-4 border-green-500 pl-4">
                                            <h4 className="font-semibold text-green-700 mb-2">✅ Finished Goods Produced</h4>
                                            {entry.finishGoods && entry.finishGoods.length > 0 ? (
                                                <div className="space-y-1">
                                                    {entry.finishGoods.map((item, idx) => (
                                                        <div key={idx} className="text-sm text-gray-700">
                                                            <strong>{item.item_description}</strong> - {item.quantity} {item.uom}
                                                            {item.remark && <span className="text-gray-500"> ({item.remark})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No finished goods recorded</p>
                                            )}
                                        </div>
                                        
                                        <div className="border-l-4 border-red-500 pl-4">
                                            <h4 className="font-semibold text-red-700 mb-2">❌ Materials Consumed</h4>
                                            {entry.materialUsed && entry.materialUsed.length > 0 ? (
                                                <div className="space-y-1">
                                                    {entry.materialUsed.map((item, idx) => (
                                                        <div key={idx} className="text-sm text-gray-700">
                                                            <strong>{item.item_description}</strong> - {item.quantity} {item.uom}
                                                            {item.remark && <span className="text-gray-500"> ({item.remark})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No materials consumed recorded</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-500">
                                        Created: {new Date(entry.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };


    // 7. Outward Challan / Dispatch Note Form

    const OutwardChallanForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [parties, setParties] = useState([]);
        const [items, setItems] = useState([]); // All items
        const [categories, setCategories] = useState([]);
        const [selectedPartyId, setSelectedPartyId] = useState('');
        const [challanNo, setChallanNo] = useState('');
        const [challanDate, setChallanDate] = useState('');
        const [transport, setTransport] = useState('');
        const [lrNo, setLrNo] = useState('');
        const [remark, setRemark] = useState('');
        const [outwardItems, setOutwardItems] = useState([{ categoryId: '', itemId: '', valueOfGoodsUom: '', qty: 0, remark: '' }]);
        
        // New states for recent entries and editing
        const [recentEntries, setRecentEntries] = useState([]);
        const [editingEntry, setEditingEntry] = useState(null);
        
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });
        const [showNewPartyModal, setShowNewPartyModal] = useState(false);
        
        // New Party Modal States
        const [newPartyName, setNewPartyName] = useState('');
        const [newPartyGst, setNewPartyGst] = useState('');
        const [newPartyAddress, setNewPartyAddress] = useState('');
        const [newPartyCity, setNewPartyCity] = useState('');
        const [newPartyBankAccount, setNewPartyBankAccount] = useState('');
        const [newPartyBankName, setNewPartyBankName] = useState('');
        const [newPartyIfscCode, setNewPartyIfscCode] = useState('');

        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch parties
                const partyResponse = await fetch(`${API_BASE_URL}/parties`);
                if (!partyResponse.ok) throw new Error(`HTTP error! status: ${partyResponse.status}`);
                const partyData = await partyResponse.json();
                setParties(partyData.map(p => ({ id: p.id, label: p.party_name, value: p.id })));

                // Fetch categories
                const categoryResponse = await fetch(`${API_BASE_URL}/categories`);
                if (!categoryResponse.ok) throw new Error(`HTTP error! status: ${categoryResponse.status}`);
                const categoryData = await categoryResponse.json();
                setCategories(categoryData.map(cat => ({ id: cat.id, label: cat.category_name, value: cat.id })));

                // Fetch all items
                const itemResponse = await fetch(`${API_BASE_URL}/items`);
                if (!itemResponse.ok) throw new Error(`HTTP error! status: ${itemResponse.status}`);
                const itemData = await itemResponse.json();
                setItems(itemData.map(item => ({ 
                    id: item.id, 
                    label: item.item_name, 
                    value: item.id, 
                    stock: item.stock,
                    categoryId: item.category_id,
                    categoryName: item.category_name
                })));
            } catch (error) {
                console.error("Error fetching initial data for Outward Challan:", error);
                setModal({ show: true, title: "Error", message: "Failed to load initial data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        const fetchRecentEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/outward-challans?limit=5&orderBy=created_at&order=DESC`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRecentEntries(data);
            } catch (error) {
                console.error("Error fetching recent outward challan entries:", error);
            }
        };

        useEffect(() => {
            fetchInitialData();
            fetchRecentEntries();
        }, []);

        const handleItemChange = (index, field, value) => {
            const updatedItems = [...outwardItems];
            updatedItems[index][field] = value;

            // If category is changed, reset the item selection
            if (field === 'categoryId') {
                updatedItems[index].itemId = '';
            }

            setOutwardItems(updatedItems);
        };

        // Get filtered items based on selected category for a specific row
        const getFilteredItems = (categoryId) => {
            if (!categoryId) return [];
            return items.filter(item => item.categoryId === parseInt(categoryId));
        };

        const addItemRow = () => {
            setOutwardItems([...outwardItems, { categoryId: '', itemId: '', valueOfGoodsUom: '', qty: 0, remark: '' }]);
        };

        const removeItemRow = (index) => {
            const updatedItems = outwardItems.filter((_, i) => i !== index);
            setOutwardItems(updatedItems);
        };

        const resetForm = () => {
            setSelectedPartyId('');
            setChallanNo('');
            setChallanDate('');
            setTransport('');
            setLrNo('');
            setRemark('');
            setOutwardItems([{ categoryId: '', itemId: '', valueOfGoodsUom: '', qty: 0, remark: '' }]);
            setEditingEntry(null);
        };

        const resetNewPartyForm = () => {
            setNewPartyName('');
            setNewPartyGst('');
            setNewPartyAddress('');
            setNewPartyCity('');
            setNewPartyBankAccount('');
            setNewPartyBankName('');
            setNewPartyIfscCode('');
        };

        const handleCreateNewParty = async () => {
            if (!newPartyName.trim()) {
                setModal({ show: true, title: "Error", message: "Party Name cannot be empty.", onClose: () => setModal({ ...modal, show: false }) });
                return;
            }

            try {
                const newPartyData = {
                    partyCode: `ADHOC-${Date.now()}`,
                    partyName: newPartyName,
                    gst: newPartyGst,
                    address: newPartyAddress,
                    city: newPartyCity,
                    bankAccount: newPartyBankAccount,
                    bankName: newPartyBankName,
                    ifscCode: newPartyIfscCode,
                    userId
                };
                
                const response = await fetch(`${API_BASE_URL}/parties`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPartyData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                setModal({ show: true, title: "Success", message: `New party "${newPartyName}" created!`, onClose: () => setModal({ ...modal, show: false }) });
                setShowNewPartyModal(false);
                resetNewPartyForm();
                fetchInitialData();
                setSelectedPartyId(result.id);
            } catch (error) {
                console.error("Error creating new party ad-hoc:", error);
                setModal({ show: true, title: "Error", message: `Failed to create party: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        const validateStock = () => {
            for (let item of outwardItems) {
                if (!item.itemId || Number(item.qty) <= 0) continue;
                
                const selectedItem = items.find(i => i.value === Number(item.itemId));
                if (selectedItem && Number(item.qty) > selectedItem.stock) {
                    setModal({ 
                        show: true, 
                        title: "Insufficient Stock", 
                        message: `${selectedItem.label} has only ${selectedItem.stock} units available, but you're trying to dispatch ${item.qty} units. Please adjust the quantity or choose a different item.`, 
                        onClose: () => setModal({ ...modal, show: false }) 
                    });
                    return false;
                }
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            // Validate that we have at least one valid item
            const validItems = outwardItems.filter(item => item.itemId && Number(item.qty) > 0);
            if (validItems.length === 0) {
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: "Please add at least one item with quantity greater than 0.", 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                return;
            }

            // Validate stock before submission (only for new entries)
            if (!editingEntry && !validateStock()) {
                return;
            }

            const outwardData = {
                partyId: Number(selectedPartyId),
                challanNo,
                challanDate,
                transport,
                lrNo,
                remark,
                items: validItems.map(item => ({
                    itemId: Number(item.itemId),
                    valueOfGoodsUom: item.valueOfGoodsUom,
                    qty: Number(item.qty),
                    remark: item.remark
                })),
                userId
            };

            try {
                let response;
                if (editingEntry) {
                    response = await fetch(`${API_BASE_URL}/outward-challans/${editingEntry.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(outwardData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/outward-challans`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(outwardData)
                    });
                }

                // Better error handling for non-JSON responses
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const textResponse = await response.text();
                    console.error('Non-JSON response:', textResponse);
                    throw new Error('Server is experiencing issues. Please check your connection and try again.');
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Server error (${response.status}). Please try again.`);
                }

                const result = await response.json();
                
                setModal({ 
                    show: true, 
                    title: "Success", 
                    message: `Outward Challan ${editingEntry ? 'updated' : 'created'} successfully! Items dispatched and stock updated.`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                resetForm();
                fetchInitialData(); // Re-fetch to update stock display
                fetchRecentEntries(); // Re-fetch recent entries
            } catch (error) {
                console.error("Error saving outward challan entry:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: `Failed to save entry: ${error.message}`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            }
        };

        const handleEdit = (entry) => {
            setEditingEntry(entry);
            setSelectedPartyId(entry.party_id);
            setChallanNo(entry.challan_no);
            setChallanDate(entry.challan_date ? entry.challan_date.split('T')[0] : '');
            setTransport(entry.transport || '');
            setLrNo(entry.lr_no || '');
            setRemark(entry.remark || '');
            
            // Populate items
            if (entry.items && entry.items.length > 0) {
                setOutwardItems(entry.items.map(item => ({
                    categoryId: item.category_id || '',
                    itemId: item.item_id,
                    valueOfGoodsUom: item.value_of_goods_uom,
                    qty: parseFloat(item.quantity),
                    remark: item.remark || ''
                })));
            }
        };

        const handleDelete = (entryId) => {
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this Outward Challan? This action cannot be undone and will affect stock levels.",
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/outward-challans/${entryId}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ 
                            show: true, 
                            title: "Success", 
                            message: "Outward Challan deleted successfully!", 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                        fetchRecentEntries(); // Re-fetch recent entries
                        fetchInitialData(); // Re-fetch items to update stock
                    } catch (error) {
                        console.error("Error deleting outward challan entry:", error);
                        setModal({ 
                            show: true, 
                            title: "Error", 
                            message: `Failed to delete entry: ${error.message}`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        const handlePrint = (entry) => {
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Outward Challan - ${entry.challan_no}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .document-title { font-size: 18px; color: #666; }
                        .details-section { margin: 20px 0; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                        .detail-item { padding: 5px 0; }
                        .detail-label { font-weight: bold; display: inline-block; width: 120px; }
                        .items-section { margin: 20px 0; }
                        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .items-table th { background-color: #f5f5f5; font-weight: bold; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">Flour Mill ERP</div>
                        <div class="document-title">Outward Challan / Dispatch Note</div>
                    </div>
                    
                    <div class="details-section">
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">Challan No:</span>
                                <span>${entry.challan_no}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Challan Date:</span>
                                <span>${entry.challan_date ? new Date(entry.challan_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Party:</span>
                                <span>${entry.party_name}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Transport:</span>
                                <span>${entry.transport || 'N/A'}</span>
                            </div>
                            ${entry.lr_no ? `
                            <div class="detail-item">
                                <span class="detail-label">LR No:</span>
                                <span>${entry.lr_no}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="items-section">
                        <h3>Items Dispatched</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th>Category</th>
                                    <th>UOM</th>
                                    <th>Quantity</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entry.items && entry.items.length > 0 ? 
                                    entry.items.map(item => `
                                        <tr>
                                            <td>${item.item_description}</td>
                                            <td>${item.category_name || '-'}</td>
                                            <td>${item.value_of_goods_uom}</td>
                                            <td>${item.quantity}</td>
                                            <td>${item.remark || '-'}</td>
                                        </tr>
                                    `).join('') : 
                                    '<tr><td colspan="5" style="text-align: center;">No items recorded</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>

                    ${entry.remark ? `
                    <div style="margin-top: 20px;">
                        <strong>General Remarks:</strong>
                        <p>${entry.remark}</p>
                    </div>
                    ` : ''}

                    <div class="footer">
                        <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                        <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    {editingEntry ? 'Edit Outward Challan' : 'Outward Challan / Dispatch Note'}
                </h2>
                
                {/* Info Banner */}
                <div className={`border rounded-lg p-4 mb-6 ${editingEntry ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center">
                        <div className={`mr-3 ${editingEntry ? 'text-yellow-600' : 'text-blue-600'}`}>
                            {editingEntry ? '✏️' : '🚚'}
                        </div>
                        <div>
                            <h4 className={`font-semibold ${editingEntry ? 'text-yellow-800' : 'text-blue-800'}`}>
                                {editingEntry ? 'Editing Outward Challan' : 'Item Selection Process'}
                            </h4>
                            <p className={`text-sm ${editingEntry ? 'text-yellow-700' : 'text-blue-700'}`}>
                                {editingEntry ? 
                                    'You are editing an existing outward challan. Changes will update stock levels accordingly.' :
                                    'First select a category, then choose the specific item from that category. Stock availability will be validated before dispatch.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div className="flex items-end gap-2">
                            <SelectField label="Party" id="party" value={selectedPartyId} onChange={(e) => setSelectedPartyId(e.target.value)} options={parties} required={true} className="flex-grow" />
                            <Button onClick={() => setShowNewPartyModal(true)} type="button" className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 h-10 rounded-lg shadow-md">
                                New Party
                            </Button>
                        </div>
                        <InputField label="Challan No" id="challanNo" value={challanNo} onChange={(e) => setChallanNo(e.target.value)} required={true} />
                        <InputField 
                            label="Challan Date" 
                            id="challanDate" 
                            type="date" 
                            value={challanDate} 
                            onChange={(e) => setChallanDate(e.target.value)} 
                            required={true}
                        />
                        <InputField label="Transport" id="transport" value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="e.g., Roadways" />
                        <InputField label="L/R No." id="lrNo" value={lrNo} onChange={(e) => setLrNo(e.target.value)} />
                        <InputField label="Remark (Header)" id="headerRemark" value={remark} onChange={(e) => setRemark(e.target.value)} className="col-span-full" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Items to Dispatch</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        outwardItems.map((item, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                {/* First Row - Category and Item Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                                    <SelectField 
                                        label="Category" 
                                        id={`category-${index}`} 
                                        value={item.categoryId} 
                                        onChange={(e) => handleItemChange(index, 'categoryId', e.target.value)} 
                                        options={categories} 
                                        required={true} 
                                    />
                                    <SelectField 
                                        label={`Item ${item.categoryId ? `(Stock: ${items.find(i => i.value === Number(item.itemId))?.stock || 0})` : ''}`}
                                        id={`item-${index}`} 
                                        value={item.itemId} 
                                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} 
                                        options={getFilteredItems(item.categoryId)} 
                                        required={true}
                                        disabled={!item.categoryId}
                                    />
                                </div>
                                
                                {/* Second Row - UOM and Quantity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                                    <InputField 
                                        label="UOM" 
                                        id={`uom-${index}`} 
                                        value={item.valueOfGoodsUom} 
                                        onChange={(e) => handleItemChange(index, 'valueOfGoodsUom', e.target.value)} 
                                        placeholder="e.g., KG, PC, MT" 
                                        required={true}
                                    />
                                    <div>
                                        <InputField 
                                            label={`Quantity ${item.itemId ? `(Available: ${items.find(i => i.value === Number(item.itemId))?.stock || 0})` : ''}`}
                                            id={`qty-${index}`} 
                                            type="number" 
                                            value={item.qty} 
                                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)} 
                                            required={true}
                                            className={!editingEntry && item.itemId && Number(item.qty) > (items.find(i => i.value === Number(item.itemId))?.stock || 0) ? 'border-red-500 bg-red-50' : ''}
                                        />
                                        {!editingEntry && item.itemId && Number(item.qty) > (items.find(i => i.value === Number(item.itemId))?.stock || 0) && (
                                            <p className="text-red-500 text-xs mt-1">⚠️ Exceeds available stock</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Third Row - Item Remark and Remove Button */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end">
                                    <div className="md:col-span-10">
                                        <InputField 
                                            label="Item Remark" 
                                            id={`itemRemark-${index}`} 
                                            value={item.remark} 
                                            onChange={(e) => handleItemChange(index, 'remark', e.target.value)} 
                                            placeholder="Optional notes for this item"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button 
                                            onClick={() => removeItemRow(index)} 
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 h-10"
                                            type="button"
                                        >
                                            <span>🗑️</span>
                                            <span className="hidden md:inline">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="flex justify-end mb-6">
                        <Button onClick={addItemRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                            Add Another Item
                        </Button>
                    </div>

                    {/* Improved Form Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button 
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>🚚</span>
                            {editingEntry ? 'Update Outward Challan' : 'Submit Outward Challan'}
                        </Button>
                        <Button 
                            onClick={resetForm} 
                            type="button"
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>🔄</span>
                            {editingEntry ? 'Cancel Edit' : 'Clear Form'}
                        </Button>
                    </div>
                </form>

                {/* Recent Entries Section */}
                <div className="mt-12 border-t-2 border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-400 pb-2">
                        Recent Outward Challans (Last 5)
                    </h3>
                    
                    {recentEntries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">🚚</div>
                            <p>No outward challans recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentEntries.map((entry) => (
                                <div key={entry.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Challan No:</span>
                                                <p className="text-lg font-bold text-purple-700">{entry.challan_no}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Challan Date:</span>
                                                <p className="text-gray-800">{entry.challan_date ? new Date(entry.challan_date).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Party:</span>
                                                <p className="text-gray-800">{entry.party_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Transport:</span>
                                                <p className="text-gray-800">{entry.transport || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Button 
                                                onClick={() => handleEdit(entry)} 
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                ✏️ Edit
                                            </Button>
                                            <Button 
                                                onClick={() => handlePrint(entry)} 
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🖨️ Print
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(entry.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <h4 className="font-semibold text-purple-700 mb-2">🚚 Items Dispatched</h4>
                                        {entry.items && entry.items.length > 0 ? (
                                            <div className="space-y-1">
                                                {entry.items.map((item, idx) => (
                                                    <div key={idx} className="text-sm text-gray-700">
                                                        <strong>{item.item_description}</strong> - {item.quantity} {item.value_of_goods_uom}
                                                        {item.remark && <span className="text-gray-500"> ({item.remark})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No items recorded</p>
                                        )}
                                    </div>
                                    
                                    {(entry.lr_no || entry.remark) && (
                                        <div className="mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600">
                                            {entry.lr_no && <span className="mr-4"><strong>LR No:</strong> {entry.lr_no}</span>}
                                            {entry.remark && <p className="mt-2"><strong>General Remark:</strong> {entry.remark}</p>}
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-500">
                                        Created: {new Date(entry.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />

                {/* New Party Modal */}
                <Modal
                    show={showNewPartyModal}
                    title="Create New Party"
                    onClose={() => {
                        setShowNewPartyModal(false);
                        resetNewPartyForm();
                    }}
                    showConfirmButton={true}
                    confirmText="Create Party"
                    onConfirm={handleCreateNewParty}
                >
                    <InputField label="Party Name" id="newPartyName" value={newPartyName} onChange={(e) => setNewPartyName(e.target.value)} required={true} placeholder="e.g., New Buyer Inc." />
                    <InputField label="GST#" id="newPartyGst" value={newPartyGst} onChange={(e) => setNewPartyGst(e.target.value)} placeholder="e.g., 27ABCDE1234F1Z5" />
                    <InputField label="Address" id="newPartyAddress" value={newPartyAddress} onChange={(e) => setNewPartyAddress(e.target.value)} placeholder="e.g., 123 Main St" />
                    <InputField label="City" id="newPartyCity" value={newPartyCity} onChange={(e) => setNewPartyCity(e.target.value)} placeholder="e.g., New Delhi" />
                    <InputField label="Bank A/c" id="newPartyBankAccount" value={newPartyBankAccount} onChange={(e) => setNewPartyBankAccount(e.target.value)} placeholder="e.g., 1234567890" />
                    <InputField label="Bank Name" id="newPartyBankName" value={newPartyBankName} onChange={(e) => setNewPartyBankName(e.target.value)} placeholder="e.g., State Bank of India" />
                    <InputField label="IFS Code" id="newPartyIfscCode" value={newPartyIfscCode} onChange={(e) => setNewPartyIfscCode(e.target.value)} placeholder="e.g., SBIN0000001" />
                </Modal>
            </div>
        );
    };


    // New Stock Control Page Component
    const StockControlPage = () => {
    const { API_BASE_URL } = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [finishedGoods, setFinishedGoods] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/items`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            const processedItems = data.map(item => ({
                ...item,
                unit_rate: parseFloat(item.unit_rate) // Ensure unit_rate is parsed as float
            }));
            
            setItems(processedItems);
            
            // Segregate items by category
            const finishedGoodsItems = processedItems.filter(item => 
                item.category_name === 'Finish Good'
            );
            const rawMaterialItems = processedItems.filter(item => 
                item.category_name === 'Raw Material'
            );
            
            setFinishedGoods(finishedGoodsItems);
            setRawMaterials(rawMaterialItems);
            
        } catch (error) {
            console.error("Error fetching items for Stock Control:", error);
            setModal({ show: true, title: "Error", message: "Failed to load stock data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const getStockStatusColor = (currentStock, minLevel) => {
        if (currentStock <= minLevel) {
            return 'text-red-600 font-bold';
        } else if (currentStock > minLevel && currentStock <= minLevel * 1.5) {
            return 'text-orange-600 font-bold';
        }
        return 'text-green-600';
    };

    const getStockStatusText = (currentStock, minLevel) => {
        if (currentStock <= minLevel) {
            return 'Below Threshold';
        } else if (currentStock > minLevel && currentStock <= minLevel * 1.5) {
            return 'Near Threshold';
        }
        return 'Good Stock';
    };

    const renderStockTable = (items, categoryTitle, categoryIcon) => (
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-400 pb-2 flex items-center">
                <span className="mr-2 text-3xl">{categoryIcon}</span>
                {categoryTitle} Stock Status
            </h3>
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Code</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Name</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Current Stock</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Min Threshold</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Rack/BIN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                                    No {categoryTitle.toLowerCase()} items registered.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.item_code}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.item_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.full_description}</td>
                                    <td className={`py-3 px-4 text-sm ${getStockStatusColor(item.stock, item.min_level)}`}>
                                        {item.stock}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.min_level}</td>
                                    <td className={`py-3 px-4 text-sm ${getStockStatusColor(item.stock, item.min_level)}`}>
                                        {getStockStatusText(item.stock, item.min_level)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">₹{item.unit_rate.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.rack_bin}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                Stock Control Overview
            </h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                    <div className="text-2xl mb-2 text-green-600">📦</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-1">Finished Goods</h3>
                    <p className="text-2xl font-bold text-green-700">{finishedGoods.length}</p>
                    <p className="text-sm text-gray-600">Total Items</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                    <div className="text-2xl mb-2 text-blue-600">🔧</div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">Raw Materials</h3>
                    <p className="text-2xl font-bold text-blue-700">{rawMaterials.length}</p>
                    <p className="text-sm text-gray-600">Total Items</p>
                </div>
                
                <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
                    <div className="text-2xl mb-2 text-red-600">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Low Stock Alert</h3>
                    <p className="text-2xl font-bold text-red-700">
                        {items.filter(item => item.stock <= item.min_level).length}
                    </p>
                    <p className="text-sm text-gray-600">Items Below Threshold</p>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg shadow-md border border-orange-200">
                    <div className="text-2xl mb-2 text-orange-600">📊</div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-1">Near Threshold</h3>
                    <p className="text-2xl font-bold text-orange-700">
                        {items.filter(item => 
                            item.stock > item.min_level && item.stock <= item.min_level * 1.5
                        ).length}
                    </p>
                    <p className="text-sm text-gray-600">Items Near Threshold</p>
                </div>
            </div>

            {isLoading ? <LoadingSpinner /> : (
                <>
                    {/* Finished Goods Table */}
                    {renderStockTable(finishedGoods, "Finished Goods", "📦")}
                    
                    {/* Raw Materials Table */}
                    {renderStockTable(rawMaterials, "Raw Materials", "🔧")}
                </>
            )}
            
            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                onClose={modal.onClose}
                onConfirm={modal.onConfirm}
                showConfirmButton={modal.showConfirmButton}
            />
        </div>
    );
};

    // New Party Overview Page Component
    const PartyOverviewPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [parties, setParties] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchParties = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/parties`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setParties(data);
            } catch (error) {
                console.error("Error fetching parties for overview:", error);
                setModal({ show: true, title: "Error", message: "Failed to load party data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchParties();
        }, []);

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Party Overview</h2>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Party Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Party Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">GST#</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Address</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">City</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bank A/c</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bank Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">IFS Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parties.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-4 px-4 text-center text-gray-500">No parties registered.</td>
                                    </tr>
                                ) : (
                                    parties.map((party) => (
                                        <tr key={party.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.party_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.party_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.gst_number}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.address}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.city}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.bank_account}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.bank_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{party.ifsc_code}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // New Item Catalog Overview Page Component
    const ItemCatalogOverviewPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [items, setItems] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/items`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setItems(data.map(item => ({
                    ...item,
                    unit_rate: parseFloat(item.unit_rate) // Ensure unit_rate is parsed as float
                })));
            } catch (error) {
                console.error("Error fetching items for Item Catalog Overview:", error);
                setModal({ show: true, title: "Error", message: "Failed to load item catalog data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchItems();
        }, []);

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Item Catalog Overview</h2>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Rack/BIN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No items registered.</td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.item_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.full_description}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.stock}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.unit_rate.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.rack_bin}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // New Production Overview Page Component
    const ProductionOverviewPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [issueNotes, setIssueNotes] = useState([]);
        const [inwardInternals, setInwardInternals] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchProductionData = async () => {
            setIsLoading(true);
            try {
                const issueNotesResponse = await fetch(`${API_BASE_URL}/issue-notes-internal`);
                if (!issueNotesResponse.ok) throw new Error(`HTTP error! status: ${issueNotesResponse.status}`);
                const issueNotesData = await issueNotesResponse.json();
                setIssueNotes(issueNotesData);

                const inwardInternalsResponse = await fetch(`${API_BASE_URL}/inward-internals`);
                if (!inwardInternalsResponse.ok) throw new Error(`HTTP error! status: ${inwardInternalsResponse.status}`);
                const inwardInternalsData = await inwardInternalsResponse.json();
                setInwardInternals(inwardInternalsData);

            } catch (error) {
                console.error("Error fetching production data:", error);
                setModal({ show: true, title: "Error", message: "Failed to load production data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchProductionData();
        }, []);

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Production Flow Overview</h2>

                <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-b border-gray-300 pb-2">Issue Notes (Raw Material to Production)</h3>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md mb-8">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issue No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issued By</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items Issued</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issueNotes.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 px-4 text-center text-gray-500">No issue notes recorded.</td>
                                    </tr>
                                ) : (
                                    issueNotes.map((note) => (
                                        <tr key={note.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{note.issue_no}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{new Date(note.issue_date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{note.department}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{note.issued_by}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {note.items && note.items.map((item, idx) => (
                                                    <div key={idx}>{item.item_description} ({item.quantity} {item.uom})</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-b border-gray-300 pb-2">Inward (Product Ready Entries)</h3>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Received Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Finished Goods</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Materials Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inwardInternals.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 px-4 text-center text-gray-500">No inward internal entries recorded.</td>
                                    </tr>
                                ) : (
                                    inwardInternals.map((entry) => (
                                        <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{entry.receipt_no}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.received_date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{entry.department}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {entry.finishGoods && entry.finishGoods.map((item, idx) => (
                                                    <div key={idx}>{item.item_description} ({item.quantity} {item.uom})</div>
                                                ))}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {entry.materialUsed && entry.materialUsed.map((item, idx) => (
                                                    <div key={idx}>{item.item_description} ({item.quantity} {item.uom})</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // New Dispatch Overview Page Component
    const DispatchOverviewPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [outwardChallans, setOutwardChallans] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchOutwardChallans = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/outward-challans`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setOutwardChallans(data);
            } catch (error) {
                console.error("Error fetching outward challans for overview:", error);
                setModal({ show: true, title: "Error", message: "Failed to load dispatch data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchOutwardChallans();
        }, []);

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Dispatch & Sales Overview</h2>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Challan No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Challan Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Party</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Transport</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">L/R No.</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items Dispatched</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outwardChallans.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No outward challans recorded.</td>
                                    </tr>
                                ) : (
                                    outwardChallans.map((challan) => (
                                        <tr key={challan.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{challan.challan_no}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{new Date(challan.challan_date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{challan.party_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{challan.transport}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{challan.lr_no}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {challan.items && challan.items.map((item, idx) => (
                                                    <div key={idx}>{item.item_description} ({item.quantity} {item.value_of_goods_uom})</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };
    // Add this new component after DispatchOverviewPage
    // Replace the existing RecordedEntriesPage component with this enhanced version

    const RecordedEntriesPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [activeTab, setActiveTab] = useState('gateInward');
        const [entries, setEntries] = useState([]);
        const [filteredEntries, setFilteredEntries] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        
        // Filter and sort states
        const [searchTerm, setSearchTerm] = useState('');
        const [dateFrom, setDateFrom] = useState('');
        const [dateTo, setDateTo] = useState('');
        const [sortBy, setSortBy] = useState('created_at');
        const [sortOrder, setSortOrder] = useState('DESC');
        const [supplierFilter, setSupplierFilter] = useState('');
        const [departmentFilter, setDepartmentFilter] = useState('');
        const [partyFilter, setPartyFilter] = useState('');
        
        // Available options for filters
        const [suppliers, setSuppliers] = useState([]);
        const [parties, setParties] = useState([]);
        const [departments] = useState(['Production', 'Quality Control', 'Packaging', 'Maintenance', 'Administration']);

        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        // Tab configuration
        const tabs = [
            { id: 'gateInward', label: 'Gate Inward', endpoint: 'gate-inwards', icon: '📥' },
            { id: 'issueNoteInternal', label: 'Issue Note (Internal)', endpoint: 'issue-notes-internal', icon: '📤' },
            { id: 'inwardInternal', label: 'Inward (Internal)', endpoint: 'inward-internals', icon: '🔄' },
            { id: 'outwardChallan', label: 'Outward Challan', endpoint: 'outward-challans', icon: '🚚' }
        ];

        // Fetch filter options
        const fetchFilterOptions = async () => {
            try {
                const [partiesResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/parties`)
                ]);
                
                if (partiesResponse.ok) {
                    const partiesData = await partiesResponse.json();
                    setParties(partiesData);
                    setSuppliers(partiesData); // Suppliers are also parties
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        // Fetch entries based on active tab
        const fetchEntries = async () => {
            setIsLoading(true);
            try {
                const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                const response = await fetch(`${API_BASE_URL}/${activeTabConfig.endpoint}?limit=100&orderBy=${sortBy}&order=${sortOrder}`);
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                setEntries(data);
                setFilteredEntries(data);
            } catch (error) {
                console.error(`Error fetching ${activeTab} entries:`, error);
                setModal({
                    show: true,
                    title: "Error",
                    message: `Failed to load ${activeTab} entries. Please try again.`,
                    onClose: () => setModal({ ...modal, show: false })
                });
            } finally {
                setIsLoading(false);
            }
        };

        // Apply filters and search
        const applyFilters = () => {
            let filtered = [...entries];

            // Search filter
            if (searchTerm) {
                filtered = filtered.filter(entry => {
                    const searchFields = getSearchFields(entry, activeTab);
                    return searchFields.some(field => 
                        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    );
                });
            }

            // Date range filter
            if (dateFrom || dateTo) {
                filtered = filtered.filter(entry => {
                    const entryDate = getEntryDate(entry, activeTab);
                    if (!entryDate) return true;
                    
                    const date = new Date(entryDate);
                    const fromDate = dateFrom ? new Date(dateFrom) : null;
                    const toDate = dateTo ? new Date(dateTo) : null;
                    
                    if (fromDate && date < fromDate) return false;
                    if (toDate && date > toDate) return false;
                    return true;
                });
            }

            // Supplier/Party filter
            if (supplierFilter && activeTab === 'gateInward') {
                filtered = filtered.filter(entry => entry.supplier_id === parseInt(supplierFilter));
            }
            if (partyFilter && activeTab === 'outwardChallan') {
                filtered = filtered.filter(entry => entry.party_id === parseInt(partyFilter));
            }

            // Department filter
            if (departmentFilter && (activeTab === 'issueNoteInternal' || activeTab === 'inwardInternal')) {
                filtered = filtered.filter(entry => entry.department === departmentFilter);
            }

            setFilteredEntries(filtered);
        };

        // Helper functions
        const getSearchFields = (entry, tabType) => {
            switch (tabType) {
                case 'gateInward':
                    return [entry.grn_number, entry.bill_no, entry.supplier_name, entry.payment_terms];
                case 'issueNoteInternal':
                    return [entry.issue_no, entry.department, entry.issued_by];
                case 'inwardInternal':
                    return [entry.receipt_no, entry.department, entry.received_by];
                case 'outwardChallan':
                    return [entry.challan_no, entry.party_name, entry.transport, entry.lr_no];
                default:
                    return [];
            }
        };

        const getEntryDate = (entry, tabType) => {
            switch (tabType) {
                case 'gateInward':
                    return entry.grn_date;
                case 'issueNoteInternal':
                    return entry.issue_date;
                case 'inwardInternal':
                    return entry.received_date;
                case 'outwardChallan':
                    return entry.challan_date;
                default:
                    return entry.created_at;
            }
        };

        // Print functionality
        const handlePrint = (entry) => {
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            const printContent = generatePrintContent(entry, activeTab);
            printWindow.document.write(printContent);
            printWindow.document.close();
        };

        const generatePrintContent = (entry, tabType) => {
            const commonStyles = `
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                    .document-title { font-size: 18px; color: #666; }
                    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                    .detail-item { padding: 5px 0; }
                    .detail-label { font-weight: bold; display: inline-block; width: 120px; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .items-table th { background-color: #f5f5f5; font-weight: bold; }
                    .total-row { background-color: #e8f4f8; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                    @media print { body { margin: 0; } .no-print { display: none; } }
                </style>
            `;

            switch (tabType) {
                case 'gateInward':
                    return `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Gate Inward Receipt - ${entry.grn_number}</title>
                            ${commonStyles}
                        </head>
                        <body>
                            <div class="header">
                                <div class="company-name">Flour Mill ERP</div>
                                <div class="document-title">Gate Inward Receipt</div>
                            </div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">GRN Number:</span>
                                    <span>${entry.grn_number}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">GRN Date:</span>
                                    <span>${entry.grn_date ? new Date(entry.grn_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Supplier:</span>
                                    <span>${entry.supplier_name}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Payment Terms:</span>
                                    <span>${entry.payment_terms || 'N/A'}</span>
                                </div>
                                ${entry.bill_no ? `
                                <div class="detail-item">
                                    <span class="detail-label">Bill Number:</span>
                                    <span>${entry.bill_no}</span>
                                </div>
                                ` : ''}
                                ${entry.bill_date ? `
                                <div class="detail-item">
                                    <span class="detail-label">Bill Date:</span>
                                    <span>${new Date(entry.bill_date).toLocaleDateString()}</span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="items-section">
                                <h3>Items Received</h3>
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Description</th>
                                            <th>UOM</th>
                                            <th>Quantity</th>
                                            <th>Unit Rate</th>
                                            <th>Amount</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${entry.items && entry.items.length > 0 ? 
                                            entry.items.map(item => `
                                                <tr>
                                                    <td>${item.item_description}</td>
                                                    <td>${item.uom}</td>
                                                    <td>${item.quantity}</td>
                                                    <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                                    <td>₹${parseFloat(item.amount).toFixed(2)}</td>
                                                    <td>${item.remark || '-'}</td>
                                                </tr>
                                            `).join('') : 
                                            '<tr><td colspan="6" style="text-align: center;">No items recorded</td></tr>'
                                        }
                                        <tr class="total-row">
                                            <td colspan="4" style="text-align: right;"><strong>Total Amount:</strong></td>
                                            <td><strong>₹${entry.items ? entry.items.reduce((total, item) => total + parseFloat(item.amount || 0), 0).toFixed(2) : '0.00'}</strong></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="footer">
                                <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                                <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                            </div>
                        </body>
                        </html>
                    `;

                case 'issueNoteInternal':
                    return `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Issue Note Internal - ${entry.issue_no}</title>
                            ${commonStyles}
                        </head>
                        <body>
                            <div class="header">
                                <div class="company-name">Flour Mill ERP</div>
                                <div class="document-title">Internal Issue Note</div>
                            </div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Issue No:</span>
                                    <span>${entry.issue_no}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Issue Date:</span>
                                    <span>${entry.issue_date ? new Date(entry.issue_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Department:</span>
                                    <span>${entry.department}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Issued By:</span>
                                    <span>${entry.issued_by}</span>
                                </div>
                            </div>
                            <div class="items-section">
                                <h3>Items Issued</h3>
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Description</th>
                                            <th>UOM</th>
                                            <th>Quantity</th>
                                            <th>Unit Rate</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${entry.items && entry.items.length > 0 ? 
                                            entry.items.map(item => `
                                                <tr>
                                                    <td>${item.item_description}</td>
                                                    <td>${item.uom}</td>
                                                    <td>${item.quantity}</td>
                                                    <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                                    <td>${item.remark || '-'}</td>
                                                </tr>
                                            `).join('') : 
                                            '<tr><td colspan="5" style="text-align: center;">No items recorded</td></tr>'
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div class="footer">
                                <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                                <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                            </div>
                        </body>
                        </html>
                    `;

                case 'inwardInternal':
                    return `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Internal Inward Receipt - ${entry.receipt_no}</title>
                            ${commonStyles}
                        </head>
                        <body>
                            <div class="header">
                                <div class="company-name">Flour Mill ERP</div>
                                <div class="document-title">Internal Inward Receipt</div>
                            </div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Receipt No:</span>
                                    <span>${entry.receipt_no}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Received Date:</span>
                                    <span>${entry.received_date ? new Date(entry.received_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Department:</span>
                                    <span>${entry.department}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Received By:</span>
                                    <span>${entry.received_by}</span>
                                </div>
                            </div>
                            <div class="items-section">
                                <h3>Finished Goods Received</h3>
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Description</th>
                                            <th>UOM</th>
                                            <th>Quantity</th>
                                            <th>Unit Rate</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${entry.finishGoods && entry.finishGoods.length > 0 ? 
                                            entry.finishGoods.map(item => `
                                                <tr>
                                                    <td>${item.item_description}</td>
                                                    <td>${item.uom}</td>
                                                    <td>${item.quantity}</td>
                                                    <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                                    <td>${item.remark || '-'}</td>
                                                </tr>
                                            `).join('') : 
                                            '<tr><td colspan="5" style="text-align: center;">No finished goods recorded</td></tr>'
                                        }
                                    </tbody>
                                </table>
                                
                                <h3>Materials Used</h3>
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Description</th>
                                            <th>UOM</th>
                                            <th>Quantity</th>
                                            <th>Unit Rate</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${entry.materialsUsed && entry.materialsUsed.length > 0 ? 
                                            entry.materialsUsed.map(item => `
                                                <tr>
                                                    <td>${item.item_description}</td>
                                                    <td>${item.uom}</td>
                                                    <td>${item.quantity}</td>
                                                    <td>₹${parseFloat(item.unit_rate).toFixed(2)}</td>
                                                    <td>${item.remark || '-'}</td>
                                                </tr>
                                            `).join('') : 
                                            '<tr><td colspan="5" style="text-align: center;">No materials used recorded</td></tr>'
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div class="footer">
                                <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                                <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                            </div>
                        </body>
                        </html>
                    `;

                case 'outwardChallan':
                    return `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Outward Challan - ${entry.challan_no}</title>
                            ${commonStyles}
                        </head>
                        <body>
                            <div class="header">
                                <div class="company-name">Flour Mill ERP</div>
                                <div class="document-title">Outward Challan / Dispatch Note</div>
                            </div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Challan No:</span>
                                    <span>${entry.challan_no}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Challan Date:</span>
                                    <span>${entry.challan_date ? new Date(entry.challan_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Party:</span>
                                    <span>${entry.party_name}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Transport:</span>
                                    <span>${entry.transport || 'N/A'}</span>
                                </div>
                                ${entry.lr_no ? `
                                <div class="detail-item">
                                    <span class="detail-label">LR No:</span>
                                    <span>${entry.lr_no}</span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="items-section">
                                <h3>Items Dispatched</h3>
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Description</th>
                                            <th>UOM</th>
                                            <th>Quantity</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${entry.items && entry.items.length > 0 ? 
                                            entry.items.map(item => `
                                                <tr>
                                                    <td>${item.item_description}</td>
                                                    <td>${item.value_of_goods_uom}</td>
                                                    <td>${item.quantity}</td>
                                                    <td>${item.remark || '-'}</td>
                                                </tr>
                                            `).join('') : 
                                            '<tr><td colspan="4" style="text-align: center;">No items recorded</td></tr>'
                                        }
                                    </tbody>
                                </table>
                            </div>
                            ${entry.remark ? `
                            <div style="margin-top: 20px;">
                                <strong>General Remarks:</strong>
                                <p>${entry.remark}</p>
                            </div>
                            ` : ''}
                            <div class="footer">
                                <p>Generated on ${new Date().toLocaleString()} | Flour Mill ERP System</p>
                                <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Document</button>
                            </div>
                        </body>
                        </html>
                    `;

                default:
                    return '<html><body>Print format not available for this entry type.</body></html>';
            }
        };

        // Delete functionality
        const handleDelete = (entryId) => {
            const activeTabConfig = tabs.find(tab => tab.id === activeTab);
            setModal({
                show: true,
                title: "Confirm Deletion",
                message: `Are you sure you want to delete this ${activeTabConfig.label} entry? This action cannot be undone and may affect stock levels.`,
                showConfirmButton: true,
                onConfirm: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/${activeTabConfig.endpoint}/${entryId}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        setModal({ 
                            show: true, 
                            title: "Success", 
                            message: `${activeTabConfig.label} entry deleted successfully!`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                        fetchEntries(); // Refresh the list
                    } catch (error) {
                        console.error(`Error deleting ${activeTab} entry:`, error);
                        setModal({ 
                            show: true, 
                            title: "Error", 
                            message: `Failed to delete entry: ${error.message}`, 
                            onClose: () => setModal({ ...modal, show: false }) 
                        });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        // Clear all filters
        const clearFilters = () => {
            setSearchTerm('');
            setDateFrom('');
            setDateTo('');
            setSortBy('created_at');
            setSortOrder('DESC');
            setSupplierFilter('');
            setDepartmentFilter('');
            setPartyFilter('');
            setFilteredEntries(entries);
        };

        // Effects
        useEffect(() => {
            fetchFilterOptions();
        }, []);

        useEffect(() => {
            fetchEntries();
        }, [activeTab, sortBy, sortOrder]);

        useEffect(() => {
            applyFilters();
        }, [entries, searchTerm, dateFrom, dateTo, supplierFilter, departmentFilter, partyFilter]);

        // Render entry cards based on type
        const renderEntryCard = (entry, index) => {
            switch (activeTab) {
                case 'gateInward':
                    return (
                        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">GRN Number:</span>
                                        <p className="text-lg font-bold text-blue-700">{entry.grn_number}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">GRN Date:</span>
                                        <p className="text-gray-800">{entry.grn_date ? new Date(entry.grn_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Supplier:</span>
                                        <p className="text-gray-800">{entry.supplier_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
                                        <p className="text-gray-800 font-bold">₹{entry.items ? entry.items.reduce((total, item) => total + parseFloat(item.amount || 0), 0).toFixed(2) : '0.00'}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <Button onClick={() => handlePrint(entry)} className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded">🖨️ Print</Button>
                                    <Button onClick={() => handleDelete(entry.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded">🗑️ Delete</Button>
                                </div>
                            </div>
                            
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-blue-700 mb-2">📦 Items Received</h4>
                                {entry.items && entry.items.length > 0 ? (
                                    <div className="space-y-1">
                                        {entry.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="text-sm text-gray-700">
                                                <strong>{item.item_description}</strong> - {item.quantity} {item.uom} @ ₹{parseFloat(item.unit_rate).toFixed(2)}
                                            </div>
                                        ))}
                                        {entry.items.length > 3 && (
                                            <p className="text-xs text-gray-500">+ {entry.items.length - 3} more items</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No items recorded</p>
                                )}
                            </div>
                            
                            {(entry.bill_no || entry.payment_terms) && (
                                <div className="mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600">
                                    {entry.bill_no && <span className="mr-4"><strong>Bill#:</strong> {entry.bill_no}</span>}
                                    {entry.payment_terms && <span><strong>Payment:</strong> {entry.payment_terms}</span>}
                                </div>
                            )}
                        </div>
                    );

                case 'issueNoteInternal':
                    return (
                        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Issue No:</span>
                                        <p className="text-lg font-bold text-red-700">{entry.issue_no}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Issue Date:</span>
                                        <p className="text-gray-800">{entry.issue_date ? new Date(entry.issue_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Department:</span>
                                        <p className="text-gray-800">{entry.department}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Issued By:</span>
                                        <p className="text-gray-800">{entry.issued_by}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <Button onClick={() => handlePrint(entry)} className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded">🖨️ Print</Button>
                                    <Button onClick={() => handleDelete(entry.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded">🗑️ Delete</Button>
                                </div>
                            </div>
                            
                            <div className="border-l-4 border-red-500 pl-4">
                                <h4 className="font-semibold text-red-700 mb-2">📤 Items Issued</h4>
                                {entry.items && entry.items.length > 0 ? (
                                    <div className="space-y-1">
                                        {entry.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="text-sm text-gray-700">
                                                <strong>{item.item_description}</strong> - {item.quantity} {item.uom}
                                            </div>
                                        ))}
                                        {entry.items.length > 3 && (
                                            <p className="text-xs text-gray-500">+ {entry.items.length - 3} more items</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No items recorded</p>
                                )}
                            </div>
                        </div>
                    );

                case 'inwardInternal':
                    return (
                        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Receipt No:</span>
                                        <p className="text-lg font-bold text-green-700">{entry.receipt_no}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Received Date:</span>
                                        <p className="text-gray-800">{entry.received_date ? new Date(entry.received_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Department:</span>
                                        <p className="text-gray-800">{entry.department}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Received By:</span>
                                        <p className="text-gray-800">{entry.received_by}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <Button onClick={() => handlePrint(entry)} className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded">🖨️ Print</Button>
                                    <Button onClick={() => handleDelete(entry.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded">🗑️ Delete</Button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h4 className="font-semibold text-green-700 mb-2">✅ Finished Goods</h4>
                                    {entry.finishGoods && entry.finishGoods.length > 0 ? (
                                        <div className="space-y-1">
                                            {entry.finishGoods.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="text-sm text-gray-700">
                                                    <strong>{item.item_description}</strong> - {item.quantity} {item.uom}
                                                </div>
                                            ))}
                                            {entry.finishGoods.length > 2 && (
                                                <p className="text-xs text-gray-500">+ {entry.finishGoods.length - 2} more items</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No finished goods</p>
                                    )}
                                </div>
                                
                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-orange-700 mb-2">🔧 Materials Used</h4>
                                    {entry.materialsUsed && entry.materialsUsed.length > 0 ? (
                                        <div className="space-y-1">
                                            {entry.materialsUsed.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="text-sm text-gray-700">
                                                    <strong>{item.item_description}</strong> - {item.quantity} {item.uom}
                                                </div>
                                            ))}
                                            {entry.materialsUsed.length > 2 && (
                                                <p className="text-xs text-gray-500">+ {entry.materialsUsed.length - 2} more items</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No materials used</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );

                case 'outwardChallan':
                    return (
                        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Challan No:</span>
                                        <p className="text-lg font-bold text-purple-700">{entry.challan_no}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Challan Date:</span>
                                        <p className="text-gray-800">{entry.challan_date ? new Date(entry.challan_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Party:</span>
                                        <p className="text-gray-800">{entry.party_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Transport:</span>
                                        <p className="text-gray-800">{entry.transport || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <Button onClick={() => handlePrint(entry)} className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded">🖨️ Print</Button>
                                    <Button onClick={() => handleDelete(entry.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded">🗑️ Delete</Button>
                                </div>
                            </div>
                            
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-purple-700 mb-2">🚚 Items Dispatched</h4>
                                {entry.items && entry.items.length > 0 ? (
                                    <div className="space-y-1">
                                        {entry.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="text-sm text-gray-700">
                                                <strong>{item.item_description}</strong> - {item.quantity} {item.value_of_goods_uom}
                                            </div>
                                        ))}
                                        {entry.items.length > 3 && (
                                            <p className="text-xs text-gray-500">+ {entry.items.length - 3} more items</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No items recorded</p>
                                )}
                            </div>
                            
                            {(entry.lr_no || entry.remark) && (
                                <div className="mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600">
                                    {entry.lr_no && <span className="mr-4"><strong>LR No:</strong> {entry.lr_no}</span>}
                                    {entry.remark && <p className="mt-2"><strong>Remark:</strong> {entry.remark}</p>}
                                </div>
                            )}
                        </div>
                    );

                default:
                    return null;
            }
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    📋 Recorded Entries
                </h2>

                {/* Tab Navigation - Clickable Tabs Only */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors duration-200 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Advanced Filters & Search
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <InputField
                            label="Search"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search entries..."
                        />
                        
                        {/* Date Range */}
                        <InputField
                            label="Date From"
                            id="dateFrom"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            // max prop will be automatically set to today by InputField
                        />
                        <InputField
                            label="Date To"
                            id="dateTo"
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            min={dateFrom} // Don't allow "to" date before "from" date
                            // max prop will be automatically set to today by InputField
                        />
                        
                        {/* Sort Options */}
                        <SelectField
                            label="Sort By"
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            options={[
                                { label: 'Created Date', value: 'created_at' },
                                { label: 'Entry Date', value: 'entry_date' },
                                { label: 'Reference Number', value: 'reference_number' }
                            ]}
                        />
                    </div>

                    {/* Additional filters based on active tab */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {(activeTab === 'gateInward') && (
                            <SelectField
                                label="Filter by Supplier"
                                id="supplierFilter"
                                value={supplierFilter}
                                onChange={(e) => setSupplierFilter(e.target.value)}
                                options={[{ label: 'All Suppliers', value: '' }, ...suppliers.map(s => ({ label: s.party_name, value: s.id }))]}
                            />
                        )}
                        
                        {(activeTab === 'issueNoteInternal' || activeTab === 'inwardInternal') && (
                            <SelectField
                                label="Filter by Department"
                                id="departmentFilter"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                options={[{ label: 'All Departments', value: '' }, ...departments.map(d => ({ label: d, value: d }))]}
                            />
                        )}
                        
                        {activeTab === 'outwardChallan' && (
                            <SelectField
                                label="Filter by Party"
                                id="partyFilter"
                                value={partyFilter}
                                onChange={(e) => setPartyFilter(e.target.value)}
                                options={[{ label: 'All Parties', value: '' }, ...parties.map(p => ({ label: p.party_name, value: p.id }))]}
                            />
                        )}
                        
                        <SelectField
                            label="Sort Order"
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            options={[
                                { label: 'Newest First', value: 'DESC' },
                                { label: 'Oldest First', value: 'ASC' }
                            ]}
                        />
                        
                        <div className="flex items-end">
                            <Button 
                                onClick={clearFilters} 
                                className="bg-gray-500 hover:bg-gray-600 text-white w-full"
                                type="button"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-gray-600">
                        Showing {filteredEntries.length} of {entries.length} {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} entries
                    </div>
                    <div className="text-sm text-gray-500">
                        {filteredEntries.length > 0 && `Total entries available: ${entries.length}`}
                    </div>
                </div>

                {/* Entries Display */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-6">
                        {filteredEntries.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-6xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">No {tabs.find(t => t.id === activeTab)?.label} Entries Found</h3>
                                <p>
                                    {searchTerm || dateFrom || dateTo || supplierFilter || departmentFilter || partyFilter
                                        ? 'Try adjusting your filters to see more results.'
                                        : `No ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} entries have been recorded yet.`
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredEntries.map((entry, index) => renderEntryCard(entry, index))
                        )}
                    </div>
                )}

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };

    // Add new component for Production Floor Stock Management
    const ProductionFloorStockPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [productionStocks, setProductionStocks] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchProductionStocks = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/production-floor-stocks`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setProductionStocks(data);
            } catch (error) {
                console.error("Error fetching production floor stocks:", error);
                setModal({ show: true, title: "Error", message: "Failed to load production floor stock data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchProductionStocks();
        }, []);

        const getStockStatusColor = (currentStock, minLevel = 10) => {
            if (currentStock <= minLevel) {
                return 'text-red-600 font-bold';
            } else if (currentStock > minLevel && currentStock <= minLevel * 1.5) {
                return 'text-orange-600 font-bold';
            }
            return 'text-green-600';
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    Production Floor Stock
                </h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                        <div className="text-2xl mb-2 text-blue-600">🏭</div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-1">Total Items</h3>
                        <p className="text-2xl font-bold text-blue-700">{productionStocks.length}</p>
                        <p className="text-sm text-gray-600">On Production Floor</p>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                        <div className="text-2xl mb-2 text-green-600">✅</div>
                        <h3 className="text-lg font-semibold text-green-800 mb-1">Available</h3>
                        <p className="text-2xl font-bold text-green-700">
                            {productionStocks.filter(item => item.quantity > 10).length}
                        </p>
                        <p className="text-sm text-gray-600">Items in Good Stock</p>
                    </div>
                    
                    <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
                        <div className="text-2xl mb-2 text-red-600">⚠️</div>
                        <h3 className="text-lg font-semibold text-red-800 mb-1">Low Stock</h3>
                        <p className="text-2xl font-bold text-red-700">
                            {productionStocks.filter(item => item.quantity <= 10).length}
                        </p>
                        <p className="text-sm text-gray-600">Need Replenishment</p>
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Description</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Available Quantity</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Value</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionStocks.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                                            No raw materials available on production floor.
                                        </td>
                                    </tr>
                                ) : (
                                    productionStocks.map((stock) => (
                                        <tr key={stock.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">{stock.item_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{stock.item_description}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{stock.category_name}</td>
                                            <td className={`py-3 px-4 text-sm ${getStockStatusColor(stock.quantity)}`}>
                                                {stock.quantity} {stock.uom}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800">₹{parseFloat(stock.unit_rate).toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">₹{(parseFloat(stock.unit_rate) * parseFloat(stock.quantity)).toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{new Date(stock.updated_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />
            </div>
        );
    };
    export default App;
