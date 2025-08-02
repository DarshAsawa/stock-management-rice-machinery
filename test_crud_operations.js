const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Test data
const testParty = {
    partyName: 'Test Supplier',
    partyType: 'supplier',
    contactPerson: 'John Doe',
    phone: '1234567890',
    email: 'test@example.com',
    address: '123 Test Street',
    gstNumber: 'GST123456789',
    userId: 'test-user-123'
};

const testCategory = {
    categoryName: 'Test Category',
    description: 'Test category description',
    userId: 'test-user-123'
};

const testSubcategory = {
    categoryId: 1,
    subcategoryName: 'Test Subcategory',
    field1Name: 'Field 1',
    field2Name: 'Field 2',
    field3Name: 'Field 3',
    field4Name: 'Field 4',
    field5Name: 'Field 5',
    userId: 'test-user-123'
};

const testItem = {
    categoryId: 1,
    subcategoryId: 1,
    itemCode: 'TEST001',
    itemName: 'Test Item',
    description1: 'Test Description 1',
    description2: 'Test Description 2',
    description3: 'Test Description 3',
    description4: 'Test Description 4',
    description5: 'Test Description 5',
    fullDescription: 'Complete test item description',
    stock: 100,
    minLevel: 10,
    unitRate: 50.00,
    rackBin: 'A1-B2',
    userId: 'test-user-123'
};

// Test functions
async function testPartyCRUD() {
    console.log('\n=== Testing Party CRUD Operations ===');
    
    try {
        // Create
        console.log('Creating party...');
        const createResponse = await axios.post(`${API_BASE_URL}/parties`, testParty);
        const partyId = createResponse.data.id;
        console.log('✅ Party created with ID:', partyId);
        
        // Read
        console.log('Reading party...');
        const readResponse = await axios.get(`${API_BASE_URL}/parties`);
        const parties = readResponse.data;
        const createdParty = parties.find(p => p.id === partyId);
        console.log('✅ Party read successfully:', createdParty ? 'Found' : 'Not found');
        
        // Update
        console.log('Updating party...');
        const updateData = { ...testParty, partyName: 'Updated Test Supplier' };
        await axios.put(`${API_BASE_URL}/parties/${partyId}`, updateData);
        console.log('✅ Party updated successfully');
        
        // Delete
        console.log('Deleting party...');
        await axios.delete(`${API_BASE_URL}/parties/${partyId}`);
        console.log('✅ Party deleted successfully');
        
    } catch (error) {
        console.error('❌ Party CRUD test failed:', error.response?.data || error.message);
    }
}

async function testCategoryCRUD() {
    console.log('\n=== Testing Category CRUD Operations ===');
    
    try {
        // Read categories (should exist from init.sql)
        console.log('Reading categories...');
        const readResponse = await axios.get(`${API_BASE_URL}/categories`);
        const categories = readResponse.data;
        console.log('✅ Categories read successfully. Count:', categories.length);
        
    } catch (error) {
        console.error('❌ Category CRUD test failed:', error.response?.data || error.message);
    }
}

async function testSubcategoryCRUD() {
    console.log('\n=== Testing Subcategory CRUD Operations ===');
    
    try {
        // Create
        console.log('Creating subcategory...');
        const createResponse = await axios.post(`${API_BASE_URL}/subcategories`, testSubcategory);
        const subcategoryId = createResponse.data.id;
        console.log('✅ Subcategory created with ID:', subcategoryId);
        
        // Read
        console.log('Reading subcategories...');
        const readResponse = await axios.get(`${API_BASE_URL}/subcategories`);
        const subcategories = readResponse.data;
        const createdSubcategory = subcategories.find(s => s.id === subcategoryId);
        console.log('✅ Subcategory read successfully:', createdSubcategory ? 'Found' : 'Not found');
        
        // Update
        console.log('Updating subcategory...');
        const updateData = { ...testSubcategory, subcategoryName: 'Updated Test Subcategory' };
        await axios.put(`${API_BASE_URL}/subcategories/${subcategoryId}`, updateData);
        console.log('✅ Subcategory updated successfully');
        
        // Delete
        console.log('Deleting subcategory...');
        await axios.delete(`${API_BASE_URL}/subcategories/${subcategoryId}`);
        console.log('✅ Subcategory deleted successfully');
        
    } catch (error) {
        console.error('❌ Subcategory CRUD test failed:', error.response?.data || error.message);
    }
}

async function testItemCRUD() {
    console.log('\n=== Testing Item CRUD Operations ===');
    
    try {
        // Create
        console.log('Creating item...');
        const createResponse = await axios.post(`${API_BASE_URL}/items`, testItem);
        const itemId = createResponse.data.id;
        console.log('✅ Item created with ID:', itemId);
        
        // Read
        console.log('Reading items...');
        const readResponse = await axios.get(`${API_BASE_URL}/items`);
        const items = readResponse.data;
        const createdItem = items.find(i => i.id === itemId);
        console.log('✅ Item read successfully:', createdItem ? 'Found' : 'Not found');
        
        // Update
        console.log('Updating item...');
        const updateData = { ...testItem, itemName: 'Updated Test Item' };
        await axios.put(`${API_BASE_URL}/items/${itemId}`, updateData);
        console.log('✅ Item updated successfully');
        
        // Delete
        console.log('Deleting item...');
        await axios.delete(`${API_BASE_URL}/items/${itemId}`);
        console.log('✅ Item deleted successfully');
        
    } catch (error) {
        console.error('❌ Item CRUD test failed:', error.response?.data || error.message);
    }
}

async function testDashboardStats() {
    console.log('\n=== Testing Dashboard Stats ===');
    
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-stats`);
        const stats = response.data;
        console.log('✅ Dashboard stats retrieved successfully');
        console.log('📊 Stats:', {
            totalParties: stats.totalParties,
            totalItems: stats.totalItems,
            totalCategories: stats.totalCategories,
            recentGateInwards: stats.recentGateInwards?.length || 0,
            recentIssueNotes: stats.recentIssueNotes?.length || 0,
            recentInwards: stats.recentInwards?.length || 0,
            recentOutwards: stats.recentOutwards?.length || 0
        });
        
    } catch (error) {
        console.error('❌ Dashboard stats test failed:', error.response?.data || error.message);
    }
}

async function testGateInwardCRUD() {
    console.log('\n=== Testing Gate Inward CRUD Operations ===');
    
    try {
        // Generate GRN number
        console.log('Generating GRN number...');
        const grnResponse = await axios.get(`${API_BASE_URL}/gate-inwards/generate-grn-number`);
        const grnNumber = grnResponse.data.grnNumber;
        console.log('✅ GRN number generated:', grnNumber);
        
        // Read gate inwards
        console.log('Reading gate inwards...');
        const readResponse = await axios.get(`${API_BASE_URL}/gate-inwards`);
        const gateInwards = readResponse.data;
        console.log('✅ Gate inwards read successfully. Count:', gateInwards.length);
        
    } catch (error) {
        console.error('❌ Gate Inward CRUD test failed:', error.response?.data || error.message);
    }
}

async function testIssueNoteInternalCRUD() {
    console.log('\n=== Testing Issue Note Internal CRUD Operations ===');
    
    try {
        // Generate issue number
        console.log('Generating issue number...');
        const issueResponse = await axios.get(`${API_BASE_URL}/issue-notes-internal/generate-issue-number`);
        const issueNumber = issueResponse.data.issueNumber;
        console.log('✅ Issue number generated:', issueNumber);
        
        // Read issue notes
        console.log('Reading issue notes...');
        const readResponse = await axios.get(`${API_BASE_URL}/issue-notes-internal`);
        const issueNotes = readResponse.data;
        console.log('✅ Issue notes read successfully. Count:', issueNotes.length);
        
    } catch (error) {
        console.error('❌ Issue Note Internal CRUD test failed:', error.response?.data || error.message);
    }
}

async function testInwardInternalCRUD() {
    console.log('\n=== Testing Inward Internal CRUD Operations ===');
    
    try {
        // Generate receipt number
        console.log('Generating receipt number...');
        const receiptResponse = await axios.get(`${API_BASE_URL}/inward-internals/generate-receipt-number`);
        const receiptNumber = receiptResponse.data.receiptNumber;
        console.log('✅ Receipt number generated:', receiptNumber);
        
        // Read inwards
        console.log('Reading inwards...');
        const readResponse = await axios.get(`${API_BASE_URL}/inward-internals`);
        const inwards = readResponse.data;
        console.log('✅ Inwards read successfully. Count:', inwards.length);
        
    } catch (error) {
        console.error('❌ Inward Internal CRUD test failed:', error.response?.data || error.message);
    }
}

async function testOutwardChallanCRUD() {
    console.log('\n=== Testing Outward Challan CRUD Operations ===');
    
    try {
        // Read outward challans
        console.log('Reading outward challans...');
        const readResponse = await axios.get(`${API_BASE_URL}/outward-challans`);
        const outwardChallans = readResponse.data;
        console.log('✅ Outward challans read successfully. Count:', outwardChallans.length);
        
    } catch (error) {
        console.error('❌ Outward Challan CRUD test failed:', error.response?.data || error.message);
    }
}

async function testProductionFloorStock() {
    console.log('\n=== Testing Production Floor Stock ===');
    
    try {
        const response = await axios.get(`${API_BASE_URL}/production-floor-stocks`);
        const stocks = response.data;
        console.log('✅ Production floor stocks read successfully. Count:', stocks.length);
        
    } catch (error) {
        console.error('❌ Production floor stock test failed:', error.response?.data || error.message);
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting CRUD Operations Test Suite...');
    console.log('API Base URL:', API_BASE_URL);
    
    try {
        await testDashboardStats();
        await testCategoryCRUD();
        await testPartyCRUD();
        await testSubcategoryCRUD();
        await testItemCRUD();
        await testGateInwardCRUD();
        await testIssueNoteInternalCRUD();
        await testInwardInternalCRUD();
        await testOutwardChallanCRUD();
        await testProductionFloorStock();
        
        console.log('\n🎉 All tests completed!');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    runAllTests,
    testPartyCRUD,
    testItemCRUD,
    testDashboardStats
}; 