const fs = require('fs');
const path = require('path');

// Component templates
const componentTemplate = (name, content) => `import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const ${name} = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    // Component implementation will be added here
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">${name.replace('Form', '').replace(/([A-Z])/g, ' $1').trim()}</h2>
            <div className="text-center text-gray-600 py-8">
                <p className="text-lg">This component is being implemented...</p>
                <p className="text-sm mt-2">Full functionality will be available soon.</p>
            </div>
        </div>
    );
};

export default ${name};`;

// List of components to create
const components = [
    'IssueNoteInternalForm',
    'InwardInternalForm', 
    'OutwardChallanForm',
    'StockControlPage',
    'PartyOverviewPage',
    'ItemCatalogOverviewPage',
    'ProductionOverviewPage',
    'DispatchOverviewPage',
    'RecordedEntriesPage',
    'ProductionFloorStockPage'
];

// Create components directory if it doesn't exist
const formsDir = path.join(__dirname, 'frontend/src/components/forms');
const pagesDir = path.join(__dirname, 'frontend/src/components/pages');

if (!fs.existsSync(formsDir)) {
    fs.mkdirSync(formsDir, { recursive: true });
}
if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
}

// Generate components
components.forEach(componentName => {
    const isPage = componentName.includes('Page');
    const dir = isPage ? pagesDir : formsDir;
    const filePath = path.join(dir, `${componentName}.js`);
    
    fs.writeFileSync(filePath, componentTemplate(componentName, ''));
    console.log(`Created ${componentName}.js`);
});

console.log('All components created successfully!'); 