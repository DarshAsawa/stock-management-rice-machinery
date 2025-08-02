export const getPageTitle = (page) => {
    const titles = {
        dashboard: 'Dashboard',
        partyMaster: 'Party Master',
        itemMaster: 'Item Master',
        subcategoryManager: 'Subcategory Manager',
        gateInward: 'Gate Inward',
        issueNoteInternal: 'Issue Note (Internal)',
        inwardInternal: 'Inward (Internal)',
        outwardChallan: 'Outward Challan',
        stockControl: 'Stock Control',
        partyOverview: 'Party Overview',
        itemCatalog: 'Item Catalog Overview',
        productionOverview: 'Production Overview',
        dispatchOverview: 'Dispatch Overview',
        recordedEntries: 'Recorded Entries',
        productionFloorStock: 'Production Floor Stock'
    };
    return titles[page] || 'Page';
};

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = (c === 'x') ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}; 