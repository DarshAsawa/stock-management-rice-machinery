import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

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

    // Auto-generate party code when form is empty (new party)
    useEffect(() => {
        if (!editingPartyId && !partyCode) {
            generatePartyCode();
        }
    }, [editingPartyId]);

    const generatePartyCode = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/parties/generate-party-code`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setPartyCode(data.partyCode);
        } catch (error) {
            console.error("Error generating party code:", error);
            setModal({ 
                show: true, 
                title: "Error", 
                message: "Failed to generate party code. Please try again.", 
                onClose: () => setModal({ ...modal, show: false }) 
            });
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
                <InputField 
                    label="Party Code" 
                    id="partyCode" 
                    value={partyCode} 
                    onChange={(e) => setPartyCode(e.target.value)} 
                    required={false} 
                    placeholder="Auto-generated party code" 
                    readOnly={editingPartyId === null}
                />
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

export default PartyMasterForm; 