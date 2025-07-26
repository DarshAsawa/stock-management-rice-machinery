import React, { useState, useEffect, createContext, useContext } from 'react';

// Context for API Base URL and User
const AppContext = createContext(null);

// Base URL for your backend API
// When running within Docker Compose, 'backend' is the service name for the backend container.
// If running the frontend development server directly (npm start) outside Docker,
// you would typically set REACT_APP_API_BASE_URL in a .env file or use 'http://localhost:3001/api'.
const API_BASE_URL = 'http://localhost:3001/api'; // Hardcoded for Docker Compose internal network

const App = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); // State for navigation

    useEffect(() => {
        // Simulate user authentication for now
        // In a real app, you'd use a proper auth system (e.g., JWT from backend)
        setUserId(crypto.randomUUID()); // Generate a unique ID for the session
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
            <div className="min-h-screen bg-gray-100 font-sans antialiased">
                {/* Navigation */}
                <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg rounded-b-lg">
                    <div className="container mx-auto flex flex-wrap justify-between items-center">
                        <h1 className="text-3xl font-bold text-white tracking-wide">Flour Mill ERP</h1>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <NavItem label="Dashboard" page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Party Master" page="partyMaster" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Item Master" page="itemMaster" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Subcategory Manager" page="subcategoryManager" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Stock Control" page="stockControl" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Gate Inward" page="gateInward" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Issue Note (Internal)" page="issueNoteInternal" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Inward (Internal)" page="inwardInternal" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Outward Challan" page="outwardChallan" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <NavItem label="Recorded Entries" page="recordedEntries" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="container mx-auto p-6">
                    {currentPage === 'dashboard' && <DashboardPage userId={userId} setCurrentPage={setCurrentPage} />}
                    {currentPage === 'partyMaster' && <PartyMasterForm />}
                    {currentPage === 'itemMaster' && <ItemMasterForm />}
                    {currentPage === 'subcategoryManager' && <SubcategoryManagerPage />}
                    {currentPage === 'stockControl' && <StockControlPage />}
                    {currentPage === 'gateInward' && <GateInwardForm />}
                    {currentPage === 'issueNoteInternal' && <IssueNoteInternalForm />}
                    {currentPage === 'inwardInternal' && <InwardInternalForm />}
                    {currentPage === 'outwardChallan' && <OutwardChallanForm />}
                    {currentPage === 'recordedEntries' && <RecordedEntriesPage />}


                    {/* New Overview Pages */}
                    {currentPage === 'partyOverview' && <PartyOverviewPage />}
                    {currentPage === 'itemCatalogOverview' && <ItemCatalogOverviewPage />}
                    {currentPage === 'productionOverview' && <ProductionOverviewPage />}
                    {currentPage === 'dispatchOverview' && <DispatchOverviewPage />}
                </main>
            </div>
        </AppContext.Provider>
    );
};

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
                <DashboardCard title="Stock Control" description="Track material inward, outward, and production flow." icon="📊" page="stockControl" setCurrentPage={setCurrentPage} /> {/* Updated to new page */}
                <DashboardCard title="Production Flow" description="Manage raw material issuance and finished goods receipt." icon="🏭" page="productionOverview" setCurrentPage={setCurrentPage} />
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

    const InputField = ({ label, id, type = "text", value, onChange, placeholder, required = false, className = "" }) => (
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
            />
        </div>
    );

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

    const Modal = ({ show, title, message, onClose, onConfirm, showConfirmButton = false, confirmText = "Confirm", children }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
                    <p className="text-gray-700 mb-6">{message}</p>
                    {children} /* Render children inside the modal for custom content like InputField */
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

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading...</p>
        </div>
    );


    // Form Components
    // 1. Party Master Form
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

                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        <Button type="submit">{editingPartyId ? 'Update Party' : 'Add Party'}</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear</Button>
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
    const ItemMasterForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [items, setItems] = useState([]);
        const [categories, setCategories] = useState([]);
        const [subcategories, setSubcategories] = useState([]);
        const [code, setCode] = useState('');
        const [itemName, setItemName] = useState('');
        const [categoryId, setCategoryId] = useState('');
        const [subcategoryId, setSubcategoryId] = useState('');
        const [desc1, setDesc1] = useState('');
        const [desc2, setDesc2] = useState('');
        const [desc3, setDesc3] = useState('');
        const [desc4, setDesc4] = useState('');
        const [desc5, setDesc5] = useState('');
        const [fullDescription, setFullDescription] = useState('');
        const [stock, setStock] = useState(0);
        const [minLevel, setMinLevel] = useState(0);
        const [unitRate, setUnitRate] = useState(0);
        const [rackBin, setRackBin] = useState('');
        const [editingItemId, setEditingItemId] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });
        const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);

        // New subcategory form states
        const [newSubcategoryName, setNewSubcategoryName] = useState('');
        const [newSubcategoryDesc1, setNewSubcategoryDesc1] = useState('');
        const [newSubcategoryDesc2, setNewSubcategoryDesc2] = useState('');
        const [newSubcategoryDesc3, setNewSubcategoryDesc3] = useState('');
        const [newSubcategoryDesc4, setNewSubcategoryDesc4] = useState('');
        const [newSubcategoryDesc5, setNewSubcategoryDesc5] = useState('');

        const fetchItemsAndCategories = async () => {
            setIsLoading(true);
            try {
                // Fetch main categories (Raw Material, Finish Good)
                const categoryResponse = await fetch(`${API_BASE_URL}/categories`);
                if (!categoryResponse.ok) throw new Error(`HTTP error! status: ${categoryResponse.status}`);
                const categoryData = await categoryResponse.json();
                setCategories(categoryData.map(cat => ({ id: cat.id, label: cat.category_name, value: cat.id, ...cat })));

                // Fetch subcategories
                const subcategoryResponse = await fetch(`${API_BASE_URL}/subcategories`);
                if (!subcategoryResponse.ok) throw new Error(`HTTP error! status: ${subcategoryResponse.status}`);
                const subcategoryData = await subcategoryResponse.json();
                setSubcategories(subcategoryData.map(sub => ({ id: sub.id, label: sub.subcategory_name, value: sub.id, ...sub })));

                // Fetch items
                const itemResponse = await fetch(`${API_BASE_URL}/items`);
                if (!itemResponse.ok) throw new Error(`HTTP error! status: ${itemResponse.status}`);
                const itemData = await itemResponse.json();
                setItems(itemData.map(item => ({
                    ...item,
                    unit_rate: parseFloat(item.unit_rate)
                })));
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

        // Filter subcategories based on selected category
        const filteredSubcategories = subcategories.filter(sub => sub.category_id === categoryId);

        // Effect to pre-fill desc fields and update full description when subcategory changes
        useEffect(() => {
            const selectedSubcategory = subcategories.find(sub => sub.id === subcategoryId);
            if (selectedSubcategory) {
                // Pre-fill desc fields from selected subcategory's field mappings
                setDesc1(selectedSubcategory.field1_name || '');
                setDesc2(selectedSubcategory.field2_name || '');
                setDesc3(selectedSubcategory.field3_name || '');
                setDesc4(selectedSubcategory.field4_name || '');
                setDesc5(selectedSubcategory.field5_name || '');
            } else if (!editingItemId) {
                // Clear desc fields if no subcategory is selected, but only if not in edit mode
                setDesc1('');
                setDesc2('');
                setDesc3('');
                setDesc4('');
                setDesc5('');
            }
            
            // // Update full description
            // const selectedCategory = categories.find(cat => cat.id === categoryId);
            // const parts = [
            //     itemName,
            //     selectedCategory ? selectedCategory.category_name : '',
            //     selectedSubcategory ? selectedSubcategory.subcategory_name : '',
            //     desc1,
            //     desc2,
            //     desc3,
            //     desc4,
            //     desc5
            // ].filter(Boolean).join(' ');
            // setFullDescription(parts.trim());
        }, [subcategoryId, subcategories, categoryId, categories]);

        // Effect to update full description when individual desc fields change
        useEffect(() => {

            const parts = [
                desc1,
                desc2,
                desc3,
                desc4,
                desc5
            ].filter(Boolean).join(' ');
            setFullDescription(parts.trim());
        }, [desc1, desc2, desc3, desc4, desc5]);

        const resetForm = () => {
            setCode('');
            setItemName('');
            setCategoryId('');
            setSubcategoryId('');
            setDesc1('');
            setDesc2('');
            setDesc3('');
            setDesc4('');
            setDesc5('');
            setFullDescription('');
            setStock(0);
            setMinLevel(0);
            setUnitRate(0);
            setRackBin('');
            setEditingItemId(null);
        };

        const resetSubcategoryForm = () => {
            setNewSubcategoryName('');
            setNewSubcategoryDesc1('');
            setNewSubcategoryDesc2('');
            setNewSubcategoryDesc3('');
            setNewSubcategoryDesc4('');
            setNewSubcategoryDesc5('');
        };

        const handleCreateSubcategory = async () => {
            if (!categoryId || !newSubcategoryName.trim()) {
                setModal({ show: true, title: "Error", message: "Please select a category and enter subcategory name.", onClose: () => setModal({ ...modal, show: false }) });
                return;
            }

            try {
                const subcategoryData = {
                    categoryId: Number(categoryId),
                    subcategoryName: newSubcategoryName,
                    field1Name: newSubcategoryDesc1 || 'Description 1',
                    field2Name: newSubcategoryDesc2 || 'Description 2',
                    field3Name: newSubcategoryDesc3 || 'Description 3',
                    field4Name: newSubcategoryDesc4 || 'Description 4',
                    field5Name: newSubcategoryDesc5 || 'Description 5',
                    userId
                };

                const response = await fetch(`${API_BASE_URL}/subcategories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subcategoryData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setModal({ show: true, title: "Success", message: `Subcategory "${newSubcategoryName}" created successfully!`, onClose: () => setModal({ ...modal, show: false }) });
                setShowSubcategoryModal(false);
                resetSubcategoryForm();
                fetchItemsAndCategories(); // Re-fetch data
                setSubcategoryId(result.id); // Select the newly created subcategory
            } catch (error) {
                console.error("Error creating subcategory:", error);
                setModal({ show: true, title: "Error", message: `Failed to create subcategory: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
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

                setModal({ show: true, title: "Success", message: `Item ${editingItemId ? 'updated' : 'added'} successfully!`, onClose: () => setModal({ ...modal, show: false }) });
                resetForm();
                fetchItemsAndCategories();
            } catch (error) {
                console.error("Error saving item:", error);
                setModal({ show: true, title: "Error", message: `Failed to save item: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        const handleEdit = (item) => {
            setEditingItemId(item.id);
            setCode(item.item_code);
            setItemName(item.item_name);
            setCategoryId(item.category_id);
            setSubcategoryId(item.subcategory_id);
            setDesc1(item.description1 || '');
            setDesc2(item.description2 || '');
            setDesc3(item.description3 || '');
            setDesc4(item.description4 || '');
            setDesc5(item.description5 || '');
            setFullDescription(item.full_description);
            setStock(item.stock);
            setMinLevel(item.min_level);
            setUnitRate(item.unit_rate);
            setRackBin(item.rack_bin);
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
                        setModal({ show: true, title: "Success", message: "Item deleted successfully!", onClose: () => setModal({ ...modal, show: false }) });
                        fetchItemsAndCategories();
                    } catch (error) {
                        console.error("Error deleting item:", error);
                        setModal({ show: true, title: "Error", message: `Failed to delete item: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
                    }
                },
                onClose: () => setModal({ ...modal, show: false })
            });
        };

        const getStockStatusColor = (currentStock, minLevel) => {
            if (currentStock <= minLevel) {
                return 'text-red-600 font-bold';
            } else if (currentStock > minLevel && currentStock <= minLevel * 1.5) {
                return 'text-orange-600 font-bold';
            }
            return 'text-green-600';
        };

        // Get dynamic labels for description fields from subcategory
        const getDescLabel = (descNum) => {
            const selectedSubcategory = subcategories.find(sub => sub.id === subcategoryId);
            if (selectedSubcategory) {
                switch (descNum) {
                    case 1: return selectedSubcategory.field1_name || 'Description 1';
                    case 2: return selectedSubcategory.field2_name || 'Description 2';
                    case 3: return selectedSubcategory.field3_name || 'Description 3';
                    case 4: return selectedSubcategory.field4_name || 'Description 4';
                    case 5: return selectedSubcategory.field5_name || 'Description 5';
                    default: return `Description ${descNum}`;
                }
            }
            return `Description ${descNum}`;
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Item Master</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField label="Item Code" id="itemCode" value={code} onChange={(e) => setCode(e.target.value)} required={true} placeholder="e.g., RM001" />
                    <InputField label="Item Name" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required={true} placeholder="e.g., Cutting Wheel" />
                    
                    <SelectField
                        label="Category"
                        id="itemCategory"
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(Number(e.target.value));
                            setSubcategoryId(''); // Reset subcategory when category changes
                        }}
                        options={categories.map(cat => ({ label: cat.category_name, value: cat.id }))}
                        required={true}
                    />
                    
                    <div className="flex items-end gap-2">
                        <SelectField
                            label="Subcategory"
                            id="itemSubcategory"
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(Number(e.target.value))}
                            options={filteredSubcategories.map(sub => ({ label: sub.subcategory_name, value: sub.id }))}
                            required={true}
                            className="flex-grow"
                        />
                        <Button 
                            onClick={() => setShowSubcategoryModal(true)} 
                            type="button" 
                            className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 h-10 rounded-lg shadow-md"
                            disabled={!categoryId}
                        >
                            New Subcategory
                        </Button>
                    </div>

                    <InputField label={getDescLabel(1)} id="itemDesc1" value={desc1} onChange={(e) => setDesc1(e.target.value)} placeholder="e.g., PRODUCT" />
                    <InputField label={getDescLabel(2)} id="itemDesc2" value={desc2} onChange={(e) => setDesc2(e.target.value)} placeholder="e.g., PLY" />
                    <InputField label={getDescLabel(3)} id="itemDesc3" value={desc3} onChange={(e) => setDesc3(e.target.value)} placeholder="e.g., LENGTH" />
                    <InputField label={getDescLabel(4)} id="itemDesc4" value={desc4} onChange={(e) => setDesc4(e.target.value)} placeholder="e.g., WIDTH" />
                    <InputField label={getDescLabel(5)} id="itemDesc5" value={desc5} onChange={(e) => setDesc5(e.target.value)} placeholder="e.g., HEIGHT" />
                    <InputField label="Full Description" id="fullDescription" value={fullDescription} readOnly={true} className="bg-gray-100" />
                    <InputField label="Stock" id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required={true} />
                    <InputField label="Min Level" id="minLevel" type="number" value={minLevel} onChange={(e) => setMinLevel(e.target.value)} required={true} />
                    <InputField label="Unit Rate" id="unitRate" type="number" value={unitRate} onChange={(e) => setUnitRate(e.target.value)} required={true} />
                    <InputField label="Rack/BIN" id="rackBin" value={rackBin} onChange={(e) => setRackBin(e.target.value)} required={true} />

                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        <Button type="submit">{editingItemId ? 'Update Item' : 'Add Item'}</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear</Button>
                    </div>
                </form>

                <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Registered Items</h3>
                {isLoading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Subcategory</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Min Level</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Rack/BIN</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="py-4 px-4 text-center text-gray-500">No items registered yet.</td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.item_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.item_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.subcategory_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.full_description}</td>
                                            <td className={`py-3 px-4 text-sm ${getStockStatusColor(item.stock, item.min_level)}`}>{item.stock}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.min_level}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.unit_rate.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.rack_bin}</td>
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

                {/* Subcategory Creation Modal */}
                <Modal
                    show={showSubcategoryModal}
                    title="Create New Subcategory"
                    onClose={() => { setShowSubcategoryModal(false); resetSubcategoryForm(); }}
                    showConfirmButton={true}
                    confirmText="Create Subcategory"
                    onConfirm={handleCreateSubcategory}
                >
                    <InputField label="Subcategory Name" id="newSubcategoryName" value={newSubcategoryName} onChange={(e) => setNewSubcategoryName(e.target.value)} required={true} placeholder="e.g., Electrical" />
                    <InputField label="Field 1 Label" id="newSubcategoryDesc1" value={newSubcategoryDesc1} onChange={(e) => setNewSubcategoryDesc1(e.target.value)} placeholder="e.g., Voltage" />
                    <InputField label="Field 2 Label" id="newSubcategoryDesc2" value={newSubcategoryDesc2} onChange={(e) => setNewSubcategoryDesc2(e.target.value)} placeholder="e.g., Current" />
                    <InputField label="Field 3 Label" id="newSubcategoryDesc3" value={newSubcategoryDesc3} onChange={(e) => setNewSubcategoryDesc3(e.target.value)} placeholder="e.g., Power" />
                    <InputField label="Field 4 Label" id="newSubcategoryDesc4" value={newSubcategoryDesc4} onChange={(e) => setNewSubcategoryDesc4(e.target.value)} placeholder="e.g., Brand" />
                    <InputField label="Field 5 Label" id="newSubcategoryDesc5" value={newSubcategoryDesc5} onChange={(e) => setNewSubcategoryDesc5(e.target.value)} placeholder="e.g., Model" />
                </Modal>

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
                message: "Are you sure you want to delete this subcategory? This action cannot be undone.",
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
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
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
                        placeholder="e.g., Electrical, Hydraulic, etc." 
                    />
                    
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Field Label Configuration</h3>
                    </div>
                    
                    <InputField 
                        label="Field 1 Label" 
                        id="field1Name" 
                        value={field1Name} 
                        onChange={(e) => setField1Name(e.target.value)} 
                        placeholder="e.g., Voltage, Brand, Size" 
                    />
                    <InputField 
                        label="Field 2 Label" 
                        id="field2Name" 
                        value={field2Name} 
                        onChange={(e) => setField2Name(e.target.value)} 
                        placeholder="e.g., Current, Model, Color" 
                    />
                    <InputField 
                        label="Field 3 Label" 
                        id="field3Name" 
                        value={field3Name} 
                        onChange={(e) => setField3Name(e.target.value)} 
                        placeholder="e.g., Power, Type, Material" 
                    />
                    <InputField 
                        label="Field 4 Label" 
                        id="field4Name" 
                        value={field4Name} 
                        onChange={(e) => setField4Name(e.target.value)} 
                        placeholder="e.g., Phase, Grade, Dimension" 
                    />
                    <InputField 
                        label="Field 5 Label" 
                        id="field5Name" 
                        value={field5Name} 
                        onChange={(e) => setField5Name(e.target.value)} 
                        placeholder="e.g., Frequency, Capacity, Weight" 
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
    const GateInwardForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [parties, setParties] = useState([]);
        const [items, setItems] = useState([]);
        const [billNo, setBillNo] = useState('');
        const [billDate, setBillDate] = useState('');
        const [supplierId, setSupplierId] = useState(''); // Store supplier ID
        const [grn, setGrn] = useState('');
        const [grnDate, setGrnDate] = useState('');
        const [paymentTerms, setPaymentTerms] = useState('');
        const [inwardItems, setInwardItems] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, amount: 0, remark: '' }]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

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
                setItems(itemData.map(i => ({ id: i.id, label: i.full_description, value: i.id, unitRate: parseFloat(i.unit_rate) }))); // Convert to float here
            } catch (error) {
                console.error("Error fetching initial data for Gate Inward:", error);
                setModal({ show: true, title: "Error", message: "Failed to load initial data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchInitialData();
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
            setBillNo('');
            setBillDate('');
            setSupplierId('');
            setGrn('');
            setGrnDate('');
            setPaymentTerms('');
            setInwardItems([{ itemId: '', unitRate: 0, uom: '', qty: 0, amount: 0, remark: '' }]);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const inwardData = {
                billNo,
                billDate,
                supplierId: Number(supplierId),
                grn,
                grnDate,
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
                const response = await fetch(`${API_BASE_URL}/gate-inwards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inwardData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ show: true, title: "Success", message: "Gate Inward entry added successfully and stock updated!", onClose: () => setModal({ ...modal, show: false }) });
                resetForm();
                // No need to fetch again here, as stock updates are handled by backend
            } catch (error) {
                console.error("Error adding gate inward entry:", error);
                setModal({ show: true, title: "Error", message: `Failed to save entry: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Gate Inward</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <InputField label="Bill No" id="billNo" value={billNo} onChange={(e) => setBillNo(e.target.value)} required={true} />
                        <InputField label="Bill Date" id="billDate" type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} required={true} />
                        <SelectField label="Supplier" id="supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} options={parties} required={true} />
                        <InputField label="GRN#" id="grn" value={grn} onChange={(e) => setGrn(e.target.value)} required={true} />
                        <InputField label="GRN Date" id="grnDate" type="date" value={grnDate} onChange={(e) => setGrnDate(e.target.value)} required={true} />
                        <InputField label="Payment Terms" id="paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Items Received</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        inwardItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-2 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <SelectField label="Item" id={`item-${index}`} value={item.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} options={items} required={true} className="col-span-2" />
                                <InputField label="Unit Rate" id={`unitRate-${index}`} type="number" value={item.unitRate} onChange={(e) => handleItemChange(index, 'unitRate', e.target.value)} required={true} />
                                <InputField label="UOM" id={`uom-${index}`} value={item.uom} onChange={(e) => handleItemChange(index, 'uom', e.target.value)} placeholder="e.g., KG, PC" />
                                <InputField label="Qty" id={`qty-${index}`} type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} required={true} />
                                <InputField label="Amount" id={`amount-${index}`} type="number" value={item.amount} readOnly={true} className="bg-gray-100" />
                                <div className="flex items-end justify-end col-span-full md:col-span-1">
                                    <Button onClick={() => removeItemRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Remark" id={`remark-${index}`} value={item.remark} onChange={(e) => handleItemChange(index, 'remark', e.target.value)} className="col-span-full" />
                            </div>
                        ))
                    )}

                    <div className="flex justify-end mb-6">
                        <Button onClick={addItemRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Add Another Item</Button>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="submit">Submit Inward Entry</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear Form</Button>
                    </div>
                </form>
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
    const IssueNoteInternalForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [departments, setDepartments] = useState([
            { label: 'Production', value: 'Production' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Quality Control', value: 'Quality Control' },
            { label: 'R&D', value: 'R&D' }
        ]); // Example departments, could be fetched from backend
        const [items, setItems] = useState([]); // All items from item master
        const [department, setDepartment] = useState('');
        const [issueNo, setIssueNo] = useState('');
        const [issueDate, setIssueDate] = useState('');
        const [issuedBy, setIssuedBy] = useState('');
        const [issuedItems, setIssuedItems] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/items`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setItems(data.map(i => ({ id: i.id, label: i.full_description, value: i.id, unitRate: parseFloat(i.unit_rate), stock: i.stock }))); // Convert to float here
            } catch (error) {
                console.error("Error fetching items for issue note:", error);
                setModal({ show: true, title: "Error", message: "Failed to load items. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchItems();
        }, []);

        const handleItemChange = (index, field, value) => {
            const updatedItems = [...issuedItems];
            updatedItems[index][field] = value;

            if (field === 'itemId') {
                const selectedItem = items.find(i => i.value === Number(value));
                if (selectedItem) {
                    updatedItems[index].unitRate = selectedItem.unitRate;
                }
            }
            setIssuedItems(updatedItems);
        };

        const addItemRow = () => {
            setIssuedItems([...issuedItems, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
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
            setIssuedItems([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

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
                const response = await fetch(`${API_BASE_URL}/issue-notes-internal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(issueData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ show: true, title: "Success", message: "Issue Note entry added successfully and stock updated!", onClose: () => setModal({ ...modal, show: false }) });
                resetForm();
                fetchItems(); // Re-fetch items to update stock display
            } catch (error) {
                console.error("Error adding issue note entry:", error);
                setModal({ show: true, title: "Error", message: `Failed to save entry: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Issue Note - Internal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <SelectField label="Department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} options={departments} required={true} />
                        <InputField label="Issue No." id="issueNo" value={issueNo} onChange={(e) => setIssueNo(e.target.value)} required={true} />
                        <InputField label="Issue Date" id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required={true} />
                        <InputField label="Issued By" id="issuedBy" value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} required={true} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Items Issued</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        issuedItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-2 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <SelectField label="Item" id={`issuedItem-${index}`} value={item.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} options={items} required={true} className="col-span-2" />
                                <InputField label="Unit Rate" id={`issuedUnitRate-${index}`} type="number" value={item.unitRate} readOnly={true} className="bg-gray-100" />
                                <InputField label="UOM" id={`issuedUom-${index}`} value={item.uom} onChange={(e) => handleItemChange(index, 'uom', e.target.value)} placeholder="e.g., KG, PC" />
                                <InputField label="Qty" id={`issuedQty-${index}`} type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} required={true} />
                                <div className="flex items-end justify-end col-span-full md:col-span-1">
                                    <Button onClick={() => removeItemRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Remark" id={`issuedRemark-${index}`} value={item.remark} onChange={(e) => handleItemChange(index, 'remark', e.target.value)} className="col-span-full" />
                            </div>
                        ))
                    )}

                    <div className="flex justify-end mb-6">
                        <Button onClick={addItemRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Add Another Item</Button>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="submit">Submit Issue Note</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear Form</Button>
                    </div>
                </form>
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

    // 6. Inward - Internal Form (Finished Goods from Production)
    // 6. Inward - Internal Form (Finished Goods from Production)
    const InwardInternalForm = () => {
        const { API_BASE_URL, userId } = useContext(AppContext);
        const [departments, setDepartments] = useState([
            { label: 'Production', value: 'Production' },
            { label: 'Assembly', value: 'Assembly' },
        ]);
        const [allItems, setAllItems] = useState([]); // Store all items
        const [finishedGoodsItems, setFinishedGoodsItems] = useState([]); // Filtered finished goods
        const [rawMaterialItems, setRawMaterialItems] = useState([]); // Filtered raw materials
        const [receiptNo, setReceiptNo] = useState('');
        const [recvDate, setRecvDate] = useState('');
        const [receivedBy, setReceivedBy] = useState('');
        const [department, setDepartment] = useState('');
        const [finishGoods, setFinishGoods] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        const [materialUsed, setMaterialUsed] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        const [isLoading, setIsLoading] = useState(true);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/items`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                
                setAllItems(data);
                
                // Filter items by category name
                const finishedGoods = data.filter(item => 
                    item.category_name === 'Finish Good'
                ).map(item => ({
                    id: item.id,
                    label: item.full_description,
                    value: item.id,
                    unitRate: parseFloat(item.unit_rate),
                    stock: item.stock
                }));
                
                const rawMaterials = data.filter(item => 
                    item.category_name === 'Raw Material'
                ).map(item => ({
                    id: item.id,
                    label: item.full_description,
                    value: item.id,
                    unitRate: parseFloat(item.unit_rate),
                    stock: item.stock
                }));
                
                setFinishedGoodsItems(finishedGoods);
                setRawMaterialItems(rawMaterials);
                
                console.log("Filtered finished goods:", finishedGoods);
                console.log("Filtered raw materials:", rawMaterials);
            } catch (error) {
                console.error("Error fetching items for inward internal:", error);
                setModal({ show: true, title: "Error", message: "Failed to load items. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchItems();
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

        // Handle changes for material used items
        const handleMaterialUsedChange = (index, field, value) => {
            const updatedItems = [...materialUsed];
            updatedItems[index][field] = value;

            if (field === 'itemId') {
                const selectedItem = rawMaterialItems.find(i => i.value === Number(value));
                if (selectedItem) {
                    updatedItems[index].unitRate = selectedItem.unitRate;
                }
            }
            setMaterialUsed(updatedItems);
        };

        // Add new finished good row
        const addFinishGoodRow = () => {
            setFinishGoods([...finishGoods, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        };

        // Remove finished good row
        const removeFinishGoodRow = (index) => {
            const updatedItems = finishGoods.filter((_, i) => i !== index);
            setFinishGoods(updatedItems);
        };

        // Add new material used row
        const addMaterialUsedRow = () => {
            setMaterialUsed([...materialUsed, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        };

        // Remove material used row
        const removeMaterialUsedRow = (index) => {
            const updatedItems = materialUsed.filter((_, i) => i !== index);
            setMaterialUsed(updatedItems);
        };

        // Reset form to initial state
        const resetForm = () => {
            setReceiptNo('');
            setRecvDate('');
            setReceivedBy('');
            setDepartment('');
            setFinishGoods([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
            setMaterialUsed([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '' }]);
        };

        // Handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault();

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
                const response = await fetch(`${API_BASE_URL}/inward-internals`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inwardData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ 
                    show: true, 
                    title: "Success", 
                    message: "Inward Internal entry added successfully and stock updated!", 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                resetForm();
                fetchItems(); // Re-fetch items to update stock display
            } catch (error) {
                console.error("Error adding inward internal entry:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: `Failed to save entry: ${error.message}`, 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            }
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Inward - Internal (Finished Goods)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <InputField label="Receipt No." id="receiptNo" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} required={true} />
                        <InputField label="Received Date" id="recvDate" type="date" value={recvDate} onChange={(e) => setRecvDate(e.target.value)} required={true} />
                        <InputField label="Received By" id="receivedBy" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} required={true} />
                        <SelectField label="Department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} options={departments} required={true} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Finished Goods Received (Category: Finish Good)</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        finishGoods.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-2 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <SelectField 
                                    label="Finished Good Item" 
                                    id={`fgItem-${index}`} 
                                    value={item.itemId} 
                                    onChange={(e) => handleFinishGoodChange(index, 'itemId', e.target.value)} 
                                    options={finishedGoodsItems} 
                                    required={true} 
                                    className="col-span-2" 
                                />
                                <InputField label="Unit Rate" id={`fgUnitRate-${index}`} type="number" value={item.unitRate} readOnly={true} className="bg-gray-100" />
                                <InputField label="UOM" id={`fgUom-${index}`} value={item.uom} onChange={(e) => handleFinishGoodChange(index, 'uom', e.target.value)} placeholder="e.g., PC" />
                                <InputField label="Qty" id={`fgQty-${index}`} type="number" value={item.qty} onChange={(e) => handleFinishGoodChange(index, 'qty', e.target.value)} required={true} />
                                <div className="flex items-end justify-end col-span-full md:col-span-1">
                                    <Button onClick={() => removeFinishGoodRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Remark" id={`fgRemark-${index}`} value={item.remark} onChange={(e) => handleFinishGoodChange(index, 'remark', e.target.value)} className="col-span-full" />
                            </div>
                        ))
                    )}
                    <div className="flex justify-end mb-6">
                        <Button onClick={addFinishGoodRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Add Another Finished Good</Button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Raw Material Used in Production (Category: Raw Material)</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        materialUsed.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-2 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <SelectField 
                                    label="Raw Material Item" 
                                    id={`muItem-${index}`} 
                                    value={item.itemId} 
                                    onChange={(e) => handleMaterialUsedChange(index, 'itemId', e.target.value)} 
                                    options={rawMaterialItems} 
                                    required={true} 
                                    className="col-span-2" 
                                />
                                <InputField label="Unit Rate" id={`muUnitRate-${index}`} type="number" value={item.unitRate} readOnly={true} className="bg-gray-100" />
                                <InputField label="UOM" id={`muUom-${index}`} value={item.uom} onChange={(e) => handleMaterialUsedChange(index, 'uom', e.target.value)} placeholder="e.g., KG, PC" />
                                <InputField label="Qty" id={`muQty-${index}`} type="number" value={item.qty} onChange={(e) => handleMaterialUsedChange(index, 'qty', e.target.value)} required={true} />
                                <div className="flex items-end justify-end col-span-full md:col-span-1">
                                    <Button onClick={() => removeMaterialUsedRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Remark" id={`muRemark-${index}`} value={item.remark} onChange={(e) => handleMaterialUsedChange(index, 'remark', e.target.value)} className="col-span-full" />
                            </div>
                        ))
                    )}
                    <div className="flex justify-end mb-6">
                        <Button onClick={addMaterialUsedRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Add Another Material Used</Button>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="submit">Submit Inward (Internal) Entry</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear Form</Button>
                    </div>
                </form>
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
        const [items, setItems] = useState([]); // Will be finished goods
        const [selectedPartyId, setSelectedPartyId] = useState(''); // Store party ID
        const [challanNo, setChallanNo] = useState('');
        const [challanDate, setChallanDate] = useState('');
        const [transport, setTransport] = useState('');
        const [lrNo, setLrNo] = useState('');
        const [remark, setRemark] = useState('');
        const [outwardItems, setOutwardItems] = useState([{ itemId: '', valueOfGoodsUom: '', qty: 0, remark: '' }]);
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

                // Fetch only finished goods items using the category filter
                const itemResponse = await fetch(`${API_BASE_URL}/items/by-category/Finish Good`);
                if (!itemResponse.ok) throw new Error(`HTTP error! status: ${itemResponse.status}`);
                const itemData = await itemResponse.json();
                setItems(itemData.map(item => ({ 
                    id: item.id, 
                    label: item.full_description, 
                    value: item.id, 
                    stock: item.stock 
                })));
            } catch (error) {
                console.error("Error fetching initial data for Outward Challan:", error);
                setModal({ show: true, title: "Error", message: "Failed to load initial data. Please try again.", onClose: () => setModal({ ...modal, show: false }) });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchInitialData();
        }, []);

        const handleItemChange = (index, field, value) => {
            const updatedItems = [...outwardItems];
            updatedItems[index][field] = value;
            setOutwardItems(updatedItems);
        };

        const addItemRow = () => {
            setOutwardItems([...outwardItems, { itemId: '', valueOfGoodsUom: '', qty: 0, remark: '' }]);
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
            setOutwardItems([{ itemId: '', valueOfGoodsUom: '', qty: 0, remark: '' }]);
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
                    partyCode: `ADHOC-${Date.now()}`, // Simple ad-hoc code
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
                resetNewPartyForm(); // Reset new party form fields
                fetchInitialData(); // Re-fetch parties to update the dropdown
                setSelectedPartyId(result.id); // Select the newly created party by its ID
            } catch (error) {
                console.error("Error creating new party ad-hoc:", error);
                setModal({ show: true, title: "Error", message: `Failed to create new party: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const outwardData = {
                partyId: Number(selectedPartyId),
                challanNo,
                challanDate,
                transport,
                lrNo,
                remark,
                items: outwardItems.map(item => ({
                    itemId: Number(item.itemId),
                    valueOfGoodsUom: item.valueOfGoodsUom,
                    qty: Number(item.qty),
                    remark: item.remark
                })),
                userId
            };

            try {
                const response = await fetch(`${API_BASE_URL}/outward-challans`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(outwardData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                setModal({ show: true, title: "Success", message: "Outward Challan entry added successfully and stock updated!", onClose: () => setModal({ ...modal, show: false }) });
                resetForm();
                fetchInitialData(); // Re-fetch items to update stock display
            } catch (error) {
                console.error("Error adding outward challan entry:", error);
                setModal({ show: true, title: "Error", message: `Failed to save entry: ${error.message}`, onClose: () => setModal({ ...modal, show: false }) });
            }
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Outward Challan / Dispatch Note</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div className="flex items-end gap-2">
                            <SelectField label="Party" id="party" value={selectedPartyId} onChange={(e) => setSelectedPartyId(e.target.value)} options={parties} required={true} className="flex-grow" />
                            <Button onClick={() => setShowNewPartyModal(true)} type="button" className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 h-10 rounded-lg shadow-md">
                                New Party
                            </Button>
                        </div>
                        <InputField label="Challan No" id="challanNo" value={challanNo} onChange={(e) => setChallanNo(e.target.value)} required={true} />
                        <InputField label="Challan Date" id="challanDate" type="date" value={challanDate} onChange={(e) => setChallanDate(e.target.value)} required={true} />
                        <InputField label="Transport" id="transport" value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="e.g., Roadways" />
                        <InputField label="L/R No." id="lrNo" value={lrNo} onChange={(e) => setLrNo(e.target.value)} />
                        <InputField label="Remark (Header)" id="headerRemark" value={remark} onChange={(e) => setRemark(e.target.value)} className="col-span-full" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Items Dispatched</h3>
                    {isLoading ? <LoadingSpinner /> : (
                        outwardItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-2 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <SelectField label="Item" id={`outwardItem-${index}`} value={item.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} options={items} required={true} className="col-span-2" />
                                <InputField label="Value of Goods UOM" id={`uom-${index}`} value={item.valueOfGoodsUom} onChange={(e) => handleItemChange(index, 'valueOfGoodsUom', e.target.value)} placeholder="e.g., PC, KG" />
                                <InputField label="Qty" id={`qty-${index}`} type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} required={true} />
                                <div className="flex items-end justify-end col-span-full md:col-span-1">
                                    <Button onClick={() => removeItemRow(index)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 text-sm">Remove</Button>
                                </div>
                                <InputField label="Remark" id={`itemRemark-${index}`} value={item.remark} onChange={(e) => handleItemChange(index, 'remark', e.target.value)} className="col-span-full" />
                            </div>
                        ))
                    )}

                    <div className="flex justify-end mb-6">
                        <Button onClick={addItemRow} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Add Another Item</Button>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="submit">Submit Outward Challan</Button>
                        <Button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white">Clear Form</Button>
                    </div>
                </form>

                <Modal
                    show={modal.show}
                    title={modal.title}
                    message={modal.message}
                    onClose={modal.onClose}
                    onConfirm={modal.onConfirm}
                    showConfirmButton={modal.showConfirmButton}
                />

                {/* New Party Ad-hoc Modal */}
                <Modal
                    show={showNewPartyModal}
                    title="Create New Party"
                    onClose={() => { setShowNewPartyModal(false); resetNewPartyForm(); }}
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
    const RecordedEntriesPage = () => {
        const { API_BASE_URL } = useContext(AppContext);
        const [activeTab, setActiveTab] = useState('items');
        const [isLoading, setIsLoading] = useState(false);
        const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

        // Data states for different entry types
        const [itemEntries, setItemEntries] = useState([]);
        const [gateInwardEntries, setGateInwardEntries] = useState([]);
        const [issueNoteEntries, setIssueNoteEntries] = useState([]);
        const [inwardInternalEntries, setInwardInternalEntries] = useState([]);
        const [outwardChallanEntries, setOutwardChallanEntries] = useState([]);

        // Fetch functions for each entry type
        const fetchItemEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/items`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setItemEntries(data);
            } catch (error) {
                console.error("Error fetching item entries:", error);
            }
        };

        const fetchGateInwardEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/gate-inwards`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setGateInwardEntries(data);
            } catch (error) {
                console.error("Error fetching gate inward entries:", error);
            }
        };

        const fetchIssueNoteEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/issue-notes-internal`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setIssueNoteEntries(data);
            } catch (error) {
                console.error("Error fetching issue note entries:", error);
            }
        };

        const fetchInwardInternalEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/inward-internals`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setInwardInternalEntries(data);
            } catch (error) {
                console.error("Error fetching inward internal entries:", error);
            }
        };

        const fetchOutwardChallanEntries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/outward-challans`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setOutwardChallanEntries(data);
            } catch (error) {
                console.error("Error fetching outward challan entries:", error);
            }
        };

        const fetchAllEntries = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchItemEntries(),
                    fetchGateInwardEntries(),
                    fetchIssueNoteEntries(),
                    fetchInwardInternalEntries(),
                    fetchOutwardChallanEntries()
                ]);
            } catch (error) {
                console.error("Error fetching all entries:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: "Failed to load recorded entries. Please try again.", 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchAllEntries();
        }, []);

        const TabButton = ({ tabKey, label, icon, count }) => (
            <button
                onClick={() => setActiveTab(tabKey)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tabKey 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tabKey 
                        ? 'bg-blue-400 text-white' 
                        : 'bg-gray-300 text-gray-600'
                }`}>
                    {count}
                </span>
            </button>
        );

        const renderItemsTable = () => (
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
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemEntries.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-4 px-4 text-center text-gray-500">No item entries recorded.</td>
                            </tr>
                        ) : (
                            itemEntries.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.item_code}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.item_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.subcategory_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.full_description}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.stock}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">₹{parseFloat(item.unit_rate).toFixed(2)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(item.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );

        const renderGateInwardTable = () => (
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-green-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bill No</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bill Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">GRN#</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Payment Terms</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items Received</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Entry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gateInwardEntries.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-4 px-4 text-center text-gray-500">No gate inward entries recorded.</td>
                            </tr>
                        ) : (
                            gateInwardEntries.map((entry) => (
                                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.bill_no}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.bill_date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.supplier_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.grn_number}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.payment_terms}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {entry.items && entry.items.map((item, idx) => (
                                            <div key={idx} className="text-xs mb-1">
                                                {item.item_description} ({item.quantity} {item.uom})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        ₹{entry.items ? entry.items.reduce((total, item) => total + parseFloat(item.amount || 0), 0).toFixed(2) : '0.00'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );

        const renderIssueNoteTable = () => (
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-orange-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issue No</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issued By</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items Issued</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Value</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Entry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issueNoteEntries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No issue note entries recorded.</td>
                            </tr>
                        ) : (
                            issueNoteEntries.map((entry) => (
                                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.issue_no}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.issue_date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.department}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.issued_by}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {entry.items && entry.items.map((item, idx) => (
                                            <div key={idx} className="text-xs mb-1">
                                                {item.item_description} ({item.quantity} {item.uom})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        ₹{entry.items ? entry.items.reduce((total, item) => total + (parseFloat(item.unit_rate || 0) * parseFloat(item.quantity || 0)), 0).toFixed(2) : '0.00'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );

        const renderInwardInternalTable = () => (
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Received Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Received By</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Finished Goods</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Materials Used</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Entry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inwardInternalEntries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No inward internal entries recorded.</td>
                            </tr>
                        ) : (
                            inwardInternalEntries.map((entry) => (
                                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.receipt_no}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.received_date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.department}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.received_by}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {entry.finishGoods && entry.finishGoods.map((item, idx) => (
                                            <div key={idx} className="text-xs mb-1 text-green-700">
                                                +{item.item_description} ({item.quantity} {item.uom})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {entry.materialUsed && entry.materialUsed.map((item, idx) => (
                                            <div key={idx} className="text-xs mb-1 text-red-700">
                                                -{item.item_description} ({item.quantity} {item.uom})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );

        const renderOutwardChallanTable = () => (
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-red-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Challan No</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Challan Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Party</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Transport</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">L/R No</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items Dispatched</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Entry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outwardChallanEntries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No outward challan entries recorded.</td>
                            </tr>
                        ) : (
                            outwardChallanEntries.map((entry) => (
                                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.challan_no}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.challan_date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.party_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.transport}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{entry.lr_no}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {entry.items && entry.items.map((item, idx) => (
                                            <div key={idx} className="text-xs mb-1">
                                                {item.item_description} ({item.quantity} {item.value_of_goods_uom})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-800 border-b-2 border-blue-500 pb-2">
                        All Recorded Entries
                    </h2>
                    <Button 
                        onClick={fetchAllEntries} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <span>🔄</span>
                        <span>Refresh</span>
                    </Button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl mb-1 text-blue-600">📦</div>
                        <div className="text-2xl font-bold text-blue-700">{itemEntries.length}</div>
                        <div className="text-sm text-gray-600">Items Created</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl mb-1 text-green-600">⬅️</div>
                        <div className="text-2xl font-bold text-green-700">{gateInwardEntries.length}</div>
                        <div className="text-sm text-gray-600">Gate Inwards</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl mb-1 text-orange-600">📤</div>
                        <div className="text-2xl font-bold text-orange-700">{issueNoteEntries.length}</div>
                        <div className="text-sm text-gray-600">Issue Notes</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-2xl mb-1 text-purple-600">🏭</div>
                        <div className="text-2xl font-bold text-purple-700">{inwardInternalEntries.length}</div>
                        <div className="text-sm text-gray-600">Production Entries</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-2xl mb-1 text-red-600">🚚</div>
                        <div className="text-2xl font-bold text-red-700">{outwardChallanEntries.length}</div>
                        <div className="text-sm text-gray-600">Outward Challans</div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap space-x-2 space-y-2 md:space-y-0 mb-6">
                    <TabButton tabKey="items" label="Items" icon="📦" count={itemEntries.length} />
                    <TabButton tabKey="gateInward" label="Gate Inward" icon="⬅️" count={gateInwardEntries.length} />
                    <TabButton tabKey="issueNote" label="Issue Notes" icon="📤" count={issueNoteEntries.length} />
                    <TabButton tabKey="inwardInternal" label="Production" icon="🏭" count={inwardInternalEntries.length} />
                    <TabButton tabKey="outwardChallan" label="Dispatch" icon="🚚" count={outwardChallanEntries.length} />
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {activeTab === 'items' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="mr-2">📦</span>
                                    Item Master Entries ({itemEntries.length})
                                </h3>
                                {renderItemsTable()}
                            </div>
                        )}

                        {activeTab === 'gateInward' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="mr-2">⬅️</span>
                                    Gate Inward Entries ({gateInwardEntries.length})
                                </h3>
                                {renderGateInwardTable()}
                            </div>
                        )}

                        {activeTab === 'issueNote' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="mr-2">📤</span>
                                    Issue Note Entries ({issueNoteEntries.length})
                                </h3>
                                {renderIssueNoteTable()}
                            </div>
                        )}

                        {activeTab === 'inwardInternal' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="mr-2">🏭</span>
                                    Inward Internal (Production) Entries ({inwardInternalEntries.length})
                                </h3>
                                {renderInwardInternalTable()}
                            </div>
                        )}

                        {activeTab === 'outwardChallan' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="mr-2">🚚</span>
                                    Outward Challan Entries ({outwardChallanEntries.length})
                                </h3>
                                {renderOutwardChallanTable()}
                            </div>
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

    export default App;
