// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001; // Backend will run on port 3001

// Middleware
app.use(cors()); // Allow cross-origin requests from your React frontend
app.use(bodyParser.json()); // Parse JSON request bodies

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'flour_mill_erp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.stack);
        process.exit(1); // Exit if DB connection fails
    });

// Helper function to update item stock
const updateItemStock = async (itemId, quantityChange, type, connection) => {
    try {
        const [rows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [itemId]);
        if (rows.length === 0) {
            console.warn(`Item with ID ${itemId} not found. Stock not updated.`);
            return false;
        }

        const currentStock = rows[0].stock;
        let newStock = currentStock;

        if (type === 'inward') {
            newStock = currentStock + quantityChange;
        } else if (type === 'outward') {
            newStock = currentStock - quantityChange;
        }

        await connection.execute('UPDATE items SET stock = ?, updated_at = NOW() WHERE id = ?', [newStock, itemId]);
        console.log(`Stock for item ${itemId} updated to ${newStock}`);
        return true;
    } catch (error) {
        console.error(`Error updating stock for item ${itemId}:`, error);
        throw error; // Re-throw to be caught by the transaction
    }
};

// Production Floor Stock Management
app.get('/api/production-floor-stocks', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                pfs.id,
                pfs.item_id,
                pfs.quantity,
                pfs.unit_rate,
                pfs.uom,
                pfs.updated_at,
                i.item_code,
                i.full_description as item_description,
                ic.category_name,
                s.subcategory_name
            FROM production_floor_stocks pfs
            JOIN items i ON pfs.item_id = i.id
            LEFT JOIN item_categories ic ON i.category_id = ic.id
            LEFT JOIN subcategories s ON i.subcategory_id = s.id
            WHERE pfs.quantity > 0
            ORDER BY i.item_code
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching production floor stocks:', err);
        res.status(500).json({ message: 'Error fetching production floor stocks', error: err.message });
    }
});

// Helper function to update production floor stock
const updateProductionFloorStock = async (itemId, quantityChange, type, connection) => {
    try {
        // Check if item exists in production floor stock
        const [existingRows] = await connection.execute(
            'SELECT quantity FROM production_floor_stocks WHERE item_id = ?',
            [itemId]
        );

        if (existingRows.length === 0) {
            // Create new entry if doesn't exist (only for inward)
            if (type === 'inward') {
                const [itemDetails] = await connection.execute(
                    'SELECT unit_rate FROM items WHERE id = ?',
                    [itemId]
                );
                
                await connection.execute(
                    'INSERT INTO production_floor_stocks (item_id, quantity, unit_rate, uom) VALUES (?, ?, ?, ?)',
                    [itemId, quantityChange, itemDetails[0]?.unit_rate || 0, 'PC']
                );
                console.log(`New production floor stock entry created for item ${itemId} with quantity ${quantityChange}`);
            }
            return true;
        }

        const currentQuantity = existingRows[0].quantity;
        let newQuantity = currentQuantity;

        if (type === 'inward') {
            newQuantity = currentQuantity + quantityChange;
        } else if (type === 'outward') {
            newQuantity = currentQuantity - quantityChange;
            if (newQuantity < 0) {
                throw new Error(`Insufficient production floor stock for item ${itemId}`);
            }
        }

        await connection.execute(
            'UPDATE production_floor_stocks SET quantity = ?, updated_at = NOW() WHERE item_id = ?',
            [newQuantity, itemId]
        );
        
        console.log(`Production floor stock for item ${itemId} updated to ${newQuantity}`);
        return true;
    } catch (error) {
        console.error(`Error updating production floor stock for item ${itemId}:`, error);
        throw error;
    }
};

// API Endpoints

// Parties
app.get('/api/parties', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM parties');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching parties:', err);
        res.status(500).json({ message: 'Error fetching parties', error: err.message });
    }
});

// Add endpoint to generate party code
app.get('/api/parties/generate-party-code', async (req, res) => {
    try {
        const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM parties');
        const nextNumber = countResult[0].total + 1;
        const partyCode = `P${nextNumber.toString().padStart(3, '0')}`;
        res.json({ partyCode });
    } catch (err) {
        console.error('Error generating party code:', err);
        res.status(500).json({ message: 'Error generating party code', error: err.message });
    }
});

app.post('/api/parties', async (req, res) => {
    const { partyCode, partyName, gst, address, city, bankAccount, bankName, ifscCode, userId } = req.body;
    if (!partyName) {
        return res.status(400).json({ message: 'Party Name is required.' });
    }
    
    try {
        let finalPartyCode = partyCode;
        
        // If no party code provided, generate auto-incrementing code
        if (!partyCode || partyCode.trim() === '') {
            const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM parties');
            const nextNumber = countResult[0].total + 1;
            finalPartyCode = `P${nextNumber.toString().padStart(3, '0')}`;
        }
        
        const [result] = await pool.execute(
            'INSERT INTO parties (party_code, party_name, gst_number, address, city, bank_account, bank_name, ifsc_code, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [finalPartyCode, partyName, gst, address, city, bankAccount, bankName, ifscCode, userId]
        );
        res.status(201).json({ 
            message: 'Party added successfully', 
            id: result.insertId,
            actualPartyCode: finalPartyCode 
        });
    } catch (err) {
        console.error('Error adding party:', err);
        res.status(500).json({ message: 'Error adding party', error: err.message });
    }
});

app.put('/api/parties/:id', async (req, res) => {
    const { id } = req.params;
    const { partyCode, partyName, gst, address, city, bankAccount, bankName, ifscCode, userId } = req.body;
    if (!partyCode || !partyName) {
        return res.status(400).json({ message: 'Party Code and Party Name are required.' });
    }
    try {
        const [result] = await pool.execute(
            'UPDATE parties SET party_code = ?, party_name = ?, gst_number = ?, address = ?, city = ?, bank_account = ?, bank_name = ?, ifsc_code = ?, user_id = ?, updated_at = NOW() WHERE id = ?',
            [partyCode, partyName, gst, address, city, bankAccount, bankName, ifscCode, userId, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Party not found.' });
        }
        res.json({ message: 'Party updated successfully' });
    } catch (err) {
        console.error('Error updating party:', err);
        res.status(500).json({ message: 'Error updating party', error: err.message });
    }
});

app.delete('/api/parties/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM parties WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Party not found.' });
        }
        res.json({ message: 'Party deleted successfully' });
    } catch (err) {
        console.error('Error deleting party:', err);
        res.status(500).json({ message: 'Error deleting party', error: err.message });
    }
});

// Categories route - ensure it returns the correct category names
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT id, category_name, created_at, updated_at, user_id 
            FROM item_categories 
            ORDER BY 
                CASE 
                    WHEN category_name = 'Raw Material' THEN 1 
                    WHEN category_name = 'Finish Good' THEN 2 
                    ELSE 3 
                END, 
                category_name
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});

// Enhanced subcategories route with category filtering
app.get('/api/subcategories', async (req, res) => {
    const { categoryId } = req.query;
    
    try {
        let query = `
            SELECT s.*, ic.category_name 
            FROM subcategories s
            JOIN item_categories ic ON s.category_id = ic.id
        `;
        let params = [];
        
        if (categoryId) {
            query += ` WHERE s.category_id = ?`;
            params.push(categoryId);
        }
        
        query += ` ORDER BY ic.category_name, s.subcategory_name`;
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Subcategory routes (corrected to use MySQL syntax)
app.get('/api/subcategories', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT s.*, ic.category_name 
            FROM subcategories s
            JOIN item_categories ic ON s.category_id = ic.id
            ORDER BY ic.category_name, s.subcategory_name
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/subcategories', async (req, res) => {
    const { categoryId, subcategoryName, field1Name, field2Name, field3Name, field4Name, field5Name, userId } = req.body;
    
    if (!categoryId || !subcategoryName || !userId) {
        return res.status(400).json({ message: 'Category ID, subcategory name, and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [categoryId, subcategoryName, field1Name || 'Description 1', field2Name || 'Description 2', 
             field3Name || 'Description 3', field4Name || 'Description 4', field5Name || 'Description 5', userId]
        );
        res.status(201).json({ message: 'Subcategory created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (error.code === 'ER_DUP_ENTRY') { // MySQL duplicate entry error
            res.status(400).json({ message: 'Subcategory with this name already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

app.put('/api/subcategories/:id', async (req, res) => {
    const { id } = req.params;
    const { categoryId, subcategoryName, field1Name, field2Name, field3Name, field4Name, field5Name, userId } = req.body;

    if (!categoryId || !subcategoryName || !userId) {
        return res.status(400).json({ message: 'Category ID, subcategory name, and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE subcategories 
             SET category_id = ?, subcategory_name = ?, field1_name = ?, field2_name = ?, 
                 field3_name = ?, field4_name = ?, field5_name = ?, updated_at = NOW()
             WHERE id = ?`,
            [categoryId, subcategoryName, field1Name, field2Name, field3Name, field4Name, field5Name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.json({ message: 'Subcategory updated successfully' });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/subcategories/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if subcategory is being used by any items
        const [itemCheck] = await pool.execute('SELECT COUNT(*) as count FROM items WHERE subcategory_id = ?', [id]);
        if (parseInt(itemCheck[0].count) > 0) {
            return res.status(400).json({ message: 'Cannot delete subcategory as it is being used by items' });
        }

        const [result] = await pool.execute('DELETE FROM subcategories WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Items (Item Master) - Updated to use correct table structure
app.get('/api/items', async (req, res) => {
    const { categoryId, subcategoryId } = req.query;
    
    try {
        let query = `
            SELECT i.*, ic.category_name, s.subcategory_name
            FROM items i
            LEFT JOIN item_categories ic ON i.category_id = ic.id
            LEFT JOIN subcategories s ON i.subcategory_id = s.id
        `;
        let params = [];
        let whereConditions = [];
        
        if (categoryId) {
            whereConditions.push('i.category_id = ?');
            params.push(categoryId);
        }
        
        if (subcategoryId) {
            whereConditions.push('i.subcategory_id = ?');
            params.push(subcategoryId);
        }
        
        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY i.item_code`;
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Error fetching items', error: err.message });
    }
});

// ...existing code...

// Add this DELETE endpoint for items after the existing items endpoints
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if item is being used in other tables
        const checks = [
            { table: 'gate_inward_items', column: 'item_id', name: 'Gate Inward entries' },
            { table: 'issue_note_internal_items', column: 'item_id', name: 'Issue Note entries' },
            { table: 'outward_challan_items', column: 'item_id', name: 'Outward Challan entries' },
            { table: 'inward_internal_finished_goods', column: 'item_id', name: 'Inward Internal entries' },
            { table: 'inward_internal_materials_used', column: 'item_id', name: 'Production entries' },
            { table: 'production_floor_stocks', column: 'item_id', name: 'Production Floor Stock' }
        ];

        for (const check of checks) {
            const [usageCheck] = await connection.execute(
                `SELECT COUNT(*) as count FROM ${check.table} WHERE ${check.column} = ?`, 
                [id]
            );
            if (parseInt(usageCheck[0].count) > 0) {
                await connection.rollback();
                return res.status(409).json({ 
                    message: `Cannot delete item. It is being used in ${check.name}.` 
                });
            }
        }

        // Get item details before deletion for logging
        const [itemDetails] = await connection.execute(
            'SELECT item_code, item_name FROM items WHERE id = ?', 
            [id]
        );

        if (itemDetails.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Item not found.' });
        }

        // Delete the item
        const [result] = await connection.execute('DELETE FROM items WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Item not found.' });
        }

        await connection.commit();
        console.log(`Item deleted: ${itemDetails[0].item_code} - ${itemDetails[0].item_name}`);
        res.json({ 
            message: 'Item deleted successfully',
            deletedItem: {
                id: id,
                itemCode: itemDetails[0].item_code,
                itemName: itemDetails[0].item_name
            }
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});


// Add endpoint to get items by category name for easier filtering
app.get('/api/items/by-category/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    
    try {
        const [rows] = await pool.execute(`
            SELECT i.*, ic.category_name, s.subcategory_name
            FROM items i
            LEFT JOIN item_categories ic ON i.category_id = ic.id
            LEFT JOIN subcategories s ON i.subcategory_id = s.id
            WHERE ic.category_name = ?
            ORDER BY i.item_code
        `, [categoryName]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching items by category:', err);
        res.status(500).json({ message: 'Error fetching items by category', error: err.message });
    }
});

app.post('/api/items', async (req, res) => {
    const { code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, uom, rackBin, userId } = req.body;
    
    if (!code || !itemName || !categoryId || !subcategoryId || !userId || !uom) {
        return res.status(400).json({ message: 'Code, item name, category ID, subcategory ID, UOM, and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO items (item_code, item_name, category_id, subcategory_id, description1, description2, description3, description4, description5, full_description, stock, min_level, unit_rate, uom, rack_bin, user_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, uom, rackBin, userId]
        );
        res.status(201).json({ message: 'Item created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating item:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Item with this code already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, uom, rackBin, userId } = req.body;

    if (!code || !itemName || !categoryId || !subcategoryId || !userId || !uom) {
        return res.status(400).json({ message: 'Code, item name, category ID, subcategory ID, UOM, and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE items 
             SET item_code = ?, item_name = ?, category_id = ?, subcategory_id = ?, description1 = ?, description2 = ?, description3 = ?, description4 = ?, description5 = ?, full_description = ?, stock = ?, min_level = ?, unit_rate = ?, uom = ?, rack_bin = ?, updated_at = NOW()
             WHERE id = ?`,
            [code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, uom, rackBin, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Gate Inward
app.get('/api/gate-inwards', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT gi.*, p.party_name AS supplier_name
            FROM gate_inwards gi
            JOIN parties p ON gi.supplier_id = p.id
            ORDER BY gi.created_at DESC
        `);
        // Fetch associated items for each inward entry
        for (let i = 0; i < rows.length; i++) {
            const [items] = await pool.execute(`
                SELECT gii.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM gate_inward_items gii
                JOIN items it ON gii.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE gii.gate_inward_id = ?
            `, [rows[i].id]);
            rows[i].items = items;
        }
        res.json(rows);
    } catch (err) {
        console.error('Error fetching gate inwards:', err);
        res.status(500).json({ message: 'Error fetching gate inwards', error: err.message });
    }
});

app.post('/api/gate-inwards', async (req, res) => {
    const { grn, grnDate, billNo, billDate, supplierId, paymentTerms, items, userId } = req.body;
    
    if (!grn || !grnDate || !supplierId || !items || items.length === 0) {
        return res.status(400).json({ message: 'GRN number, GRN date, supplier, and items are required for Gate Inward.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if GRN already exists (safety check)
        const [existingGrn] = await connection.execute(
            'SELECT id FROM gate_inwards WHERE grn_number = ?',
            [grn]
        );
        
        if (existingGrn.length > 0) {
            // If GRN exists, generate a new one automatically
            const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM gate_inwards');
            const nextNumber = countResult[0].total + 1;
            const newGrn = `GRN-${nextNumber.toString().padStart(3, '0')}`;
            
            console.log(`GRN ${grn} already exists, using ${newGrn} instead`);
            
            // Use the new GRN
            const [gateInwardResult] = await connection.execute(
                'INSERT INTO gate_inwards (grn_number, grn_date, bill_no, bill_date, supplier_id, payment_terms, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [newGrn, grnDate, billNo || null, billDate || null, supplierId, paymentTerms, userId]
            );
            const gateInwardId = gateInwardResult.insertId;

            // Insert items
            for (const item of items) {
                await connection.execute(
                    'INSERT INTO gate_inward_items (gate_inward_id, item_id, unit_rate, uom, quantity, amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [gateInwardId, item.itemId, item.unitRate, item.uom, item.qty, item.amount, item.remark]
                );
                await updateItemStock(item.itemId, item.qty, 'inward', connection);
            }

            await connection.commit();
            res.status(201).json({ 
                message: 'Gate Inward entry added successfully with auto-corrected GRN and stock updated!', 
                id: gateInwardId,
                actualGrn: newGrn
            });
        } else {
            // Original GRN is available, proceed normally
            const [gateInwardResult] = await connection.execute(
                'INSERT INTO gate_inwards (grn_number, grn_date, bill_no, bill_date, supplier_id, payment_terms, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [grn, grnDate, billNo || null, billDate || null, supplierId, paymentTerms, userId]
            );
            const gateInwardId = gateInwardResult.insertId;

            // Insert items
            for (const item of items) {
                await connection.execute(
                    'INSERT INTO gate_inward_items (gate_inward_id, item_id, unit_rate, uom, quantity, amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [gateInwardId, item.itemId, item.unitRate, item.uom, item.qty, item.amount, item.remark]
                );
                await updateItemStock(item.itemId, item.qty, 'inward', connection);
            }

            await connection.commit();
            res.status(201).json({ message: 'Gate Inward entry added successfully and stock updated!', id: gateInwardId });
        }
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding gate inward entry:', err);
        res.status(500).json({ message: 'Error adding gate inward entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// PUT endpoint for updating Gate Inward entries
app.put('/api/gate-inwards/:id', async (req, res) => {
    const { id } = req.params;
    const { grn, grnDate, billNo, billDate, supplierId, paymentTerms, items, userId } = req.body;
    
    if (!grn || !grnDate || !supplierId || !items || items.length === 0) {
        return res.status(400).json({ message: 'GRN number, GRN date, supplier, and items are required for Gate Inward update.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // First, get the existing entry to reverse its stock effects
        const [existingEntry] = await connection.execute(
            'SELECT * FROM gate_inwards WHERE id = ?',
            [id]
        );
        
        if (existingEntry.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Gate Inward entry not found.' });
        }

        // Get existing items and reverse their stock impact
        const [existingItems] = await connection.execute(
            'SELECT * FROM gate_inward_items WHERE gate_inward_id = ?',
            [id]
        );
        
        for (const item of existingItems) {
            // Reverse the previous inward effect (reduce from main stock)
            await updateItemStock(item.item_id, item.quantity, 'outward', connection);
        }

        // Delete existing items
        await connection.execute('DELETE FROM gate_inward_items WHERE gate_inward_id = ?', [id]);

        // Update the main record
        await connection.execute(
            'UPDATE gate_inwards SET grn_number = ?, grn_date = ?, bill_no = ?, bill_date = ?, supplier_id = ?, payment_terms = ?, updated_at = NOW() WHERE id = ?',
            [grn, grnDate, billNo || null, billDate || null, supplierId, paymentTerms, id]
        );

        // Insert new items and update stocks
        for (const item of items) {
            await connection.execute(
                'INSERT INTO gate_inward_items (gate_inward_id, item_id, unit_rate, uom, quantity, amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, item.itemId, item.unitRate, item.uom, item.qty, item.amount, item.remark]
            );
            
            // Add to main stock
            await updateItemStock(item.itemId, item.qty, 'inward', connection);
        }

        await connection.commit();
        res.json({ message: 'Gate Inward entry updated successfully! Stock adjusted accordingly.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error updating gate inward entry:', err);
        res.status(500).json({ message: 'Error updating gate inward entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// DELETE endpoint for Gate Inward entries
app.delete('/api/gate-inwards/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get the entry to reverse its stock effects
        const [entry] = await connection.execute(
            'SELECT * FROM gate_inwards WHERE id = ?',
            [id]
        );
        
        if (entry.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Gate Inward entry not found.' });
        }

        // Get items and reverse their stock impact
        const [items] = await connection.execute(
            'SELECT * FROM gate_inward_items WHERE gate_inward_id = ?',
            [id]
        );
        
        for (const item of items) {
            // Reverse the inward effect (reduce from main stock)
            await updateItemStock(item.item_id, item.quantity, 'outward', connection);
        }

        // Delete related records
        await connection.execute('DELETE FROM gate_inward_items WHERE gate_inward_id = ?', [id]);
        
        // Delete main record
        await connection.execute('DELETE FROM gate_inwards WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: 'Gate Inward entry deleted successfully! Stock levels restored.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error deleting gate inward entry:', err);
        res.status(500).json({ message: 'Error deleting gate inward entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Issue Note - Internal
app.get('/api/issue-notes-internal', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM issue_notes_internal ORDER BY created_at DESC');
        for (let i = 0; i < rows.length; i++) {
            const [items] = await pool.execute(`
                SELECT inii.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM issue_note_internal_items inii
                JOIN items it ON inii.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE inii.issue_note_id = ?
            `, [rows[i].id]);
            rows[i].items = items;
        }
        res.json(rows);
    } catch (err) {
        console.error('Error fetching issue notes internal:', err);
        res.status(500).json({ message: 'Error fetching issue notes internal', error: err.message });
    }
});

app.post('/api/issue-notes-internal', async (req, res) => {
    const { department, issueNo, issueDate, issuedBy, items, userId } = req.body;
    if (!department || !issueNo || !issueDate || !issuedBy || !items || items.length === 0) {
        return res.status(400).json({ message: 'Required fields are missing for Issue Note Internal.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if Issue Number already exists (safety check)
        const [existingIssue] = await connection.execute(
            'SELECT id FROM issue_notes_internal WHERE issue_no = ?',
            [issueNo]
        );
        
        let finalIssueNo = issueNo;
        
        if (existingIssue.length > 0) {
            // If issue number exists, generate a new one automatically
            const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM issue_notes_internal');
            const nextNumber = countResult[0].total + 1;
            finalIssueNo = `ISS-${nextNumber.toString().padStart(3, '0')}`;
            console.log(`Issue number ${issueNo} already exists, using ${finalIssueNo} instead`);
        }

        // Check stock levels before proceeding
        for (const item of items) {
            const [stockRows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [item.itemId]);
            if (stockRows.length === 0 || stockRows[0].stock < item.qty) {
                await connection.rollback();
                const itemName = stockRows.length > 0 ? 'Item' : 'Unknown item';
                return res.status(400).json({ 
                    message: `Not enough stock for ${itemName} ID ${item.itemId}. Available: ${stockRows[0]?.stock || 0}, Required: ${item.qty}` 
                });
            }
        }

        // Insert Issue Note header
        const [issueResult] = await connection.execute(
            'INSERT INTO issue_notes_internal (department, issue_no, issue_date, issued_by, user_id) VALUES (?, ?, ?, ?, ?)',
            [department, finalIssueNo, issueDate, issuedBy, userId]
        );
        const issueNoteId = issueResult.insertId;

        // Insert Issue Note items, update main stock (outward), and update production floor stock (inward)
        for (const item of items) {
            await connection.execute(
                'INSERT INTO issue_note_internal_items (issue_note_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                [issueNoteId, item.itemId, item.unitRate, item.uom, item.qty, item.remark]
            );
            
            // Reduce from main stock
            await updateItemStock(item.itemId, item.qty, 'outward', connection);
            
            // Add to production floor stock
            await updateProductionFloorStock(item.itemId, item.qty, 'inward', connection);
        }

        await connection.commit();
        res.status(201).json({ 
            message: 'Issue Note Internal entry added successfully! Stock moved to production floor.', 
            id: issueNoteId,
            actualIssueNo: finalIssueNo 
        });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding issue note internal entry:', err);
        res.status(500).json({ message: 'Error adding issue note internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Generate auto-increment issue number for issue notes internal
app.get('/api/issue-notes-internal/generate-issue-number', async (req, res) => {
    try {
        // Get the latest issue number
        const [rows] = await pool.execute(
            'SELECT issue_no FROM issue_notes_internal ORDER BY id DESC LIMIT 1'
        );
        
        let nextNumber = 1;
        let prefix = 'ISS-';
        
        if (rows.length > 0) {
            const lastIssueNo = rows[0].issue_no;
            // Extract number from issue like "ISS-001"
            const match = lastIssueNo.match(/ISS-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        
        // Generate new issue number with zero padding
        const newIssueNo = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
        
        res.json({ issueNumber: newIssueNo });
    } catch (err) {
        console.error('Error generating issue number:', err);
        res.status(500).json({ message: 'Error generating issue number', error: err.message });
    }
});

// Update the existing issue-notes-internal GET endpoint to support pagination
app.get('/api/issue-notes-internal', async (req, res) => {
    const { limit = 50, orderBy = 'created_at', order = 'DESC' } = req.query;
    
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM issue_notes_internal 
             ORDER BY ${orderBy} ${order} 
             LIMIT ?`,
            [parseInt(limit)]
        );
        
        // Fetch associated items for each issue note
        for (let i = 0; i < rows.length; i++) {
            const [items] = await pool.execute(`
                SELECT inii.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM issue_note_internal_items inii
                JOIN items it ON inii.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE inii.issue_note_id = ?
            `, [rows[i].id]);
            rows[i].items = items;
        }
        
        res.json(rows);
    } catch (err) {
        console.error('Error fetching issue notes internal:', err);
        res.status(500).json({ message: 'Error fetching issue notes internal', error: err.message });
    }
});

// Update the existing POST endpoint to handle duplicate issue numbers
app.post('/api/issue-notes-internal', async (req, res) => {
    const { department, issueNo, issueDate, issuedBy, items, userId } = req.body;
    if (!department || !issueNo || !issueDate || !issuedBy || !items || items.length === 0) {
        return res.status(400).json({ message: 'Required fields are missing for Issue Note Internal.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if Issue Number already exists (safety check)
        const [existingIssue] = await connection.execute(
            'SELECT id FROM issue_notes_internal WHERE issue_no = ?',
            [issueNo]
        );
        
        let finalIssueNo = issueNo;
        
        if (existingIssue.length > 0) {
            // If issue number exists, generate a new one automatically
            const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM issue_notes_internal');
            const nextNumber = countResult[0].total + 1;
            finalIssueNo = `ISS-${nextNumber.toString().padStart(3, '0')}`;
            console.log(`Issue number ${issueNo} already exists, using ${finalIssueNo} instead`);
        }

        // Check stock levels before proceeding
        for (const item of items) {
            const [stockRows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [item.itemId]);
            if (stockRows.length === 0 || stockRows[0].stock < item.qty) {
                await connection.rollback();
                const itemName = stockRows.length > 0 ? 'Item' : 'Unknown item';
                return res.status(400).json({ 
                    message: `Not enough stock for ${itemName} ID ${item.itemId}. Available: ${stockRows[0]?.stock || 0}, Required: ${item.qty}` 
                });
            }
        }

        // Insert Issue Note header
        const [issueResult] = await connection.execute(
            'INSERT INTO issue_notes_internal (department, issue_no, issue_date, issued_by, user_id) VALUES (?, ?, ?, ?, ?)',
            [department, finalIssueNo, issueDate, issuedBy, userId]
        );
        const issueNoteId = issueResult.insertId;

        // Insert Issue Note items, update main stock (outward), and update production floor stock (inward)
        for (const item of items) {
            await connection.execute(
                'INSERT INTO issue_note_internal_items (issue_note_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                [issueNoteId, item.itemId, item.unitRate, item.uom, item.qty, item.remark]
            );
            
            // Reduce from main stock
            await updateItemStock(item.itemId, item.qty, 'outward', connection);
            
            // Add to production floor stock
            await updateProductionFloorStock(item.itemId, item.qty, 'inward', connection);
        }

        await connection.commit();
        res.status(201).json({ 
            message: 'Issue Note Internal entry added successfully! Stock moved to production floor.', 
            id: issueNoteId,
            actualIssueNo: finalIssueNo 
        });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding issue note internal entry:', err);
        res.status(500).json({ message: 'Error adding issue note internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Add UPDATE endpoint for issue notes internal
app.put('/api/issue-notes-internal/:id', async (req, res) => {
    const { id } = req.params;
    const { department, issueNo, issueDate, issuedBy, items, userId } = req.body;
    
    if (!department || !issueNo || !issueDate || !issuedBy || !items || items.length === 0) {
        return res.status(400).json({ message: 'Required fields are missing for Issue Note Internal update.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // First, get the existing entry to reverse its stock effects
        const [existingEntry] = await connection.execute(
            'SELECT * FROM issue_notes_internal WHERE id = ?',
            [id]
        );
        
        if (existingEntry.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Issue Note Internal entry not found.' });
        }

        // Get existing items and reverse their stock impact
        const [existingItems] = await connection.execute(
            'SELECT * FROM issue_note_internal_items WHERE issue_note_id = ?',
            [id]
        );
        
        for (const item of existingItems) {
            // Reverse the previous outward effect (add back to main stock)
            await updateItemStock(item.item_id, item.quantity, 'inward', connection);
            // Reverse the previous inward effect (reduce from production floor stock)
            await updateProductionFloorStock(item.item_id, item.quantity, 'outward', connection);
        }

        // Delete existing items
        await connection.execute('DELETE FROM issue_note_internal_items WHERE issue_note_id = ?', [id]);

        // Update the main record
        await connection.execute(
            'UPDATE issue_notes_internal SET department = ?, issue_no = ?, issue_date = ?, issued_by = ?, updated_at = NOW() WHERE id = ?',
            [department, issueNo, issueDate, issuedBy, id]
        );

        // Check stock levels for new items
        for (const item of items) {
            const [stockRows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [item.itemId]);
            if (stockRows.length === 0 || stockRows[0].stock < item.qty) {
                await connection.rollback();
                return res.status(400).json({ 
                    message: `Not enough stock for item ID ${item.itemId}. Available: ${stockRows[0]?.stock || 0}, Required: ${item.qty}` 
                });
            }
        }

        // Insert new items and update stocks
        for (const item of items) {
            await connection.execute(
                'INSERT INTO issue_note_internal_items (issue_note_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                [id, item.itemId, item.unitRate, item.uom, item.qty, item.remark]
            );
            
            // Reduce from main stock
            await updateItemStock(item.itemId, item.qty, 'outward', connection);
            
            // Add to production floor stock
            await updateProductionFloorStock(item.itemId, item.qty, 'inward', connection);
        }

        await connection.commit();
        res.json({ message: 'Issue Note Internal entry updated successfully! Stocks adjusted accordingly.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error updating issue note internal entry:', err);
        res.status(500).json({ message: 'Error updating issue note internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Delete inward internal entry
app.delete('/api/issue-notes-internal/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get the entry to reverse its stock effects
        const [entry] = await connection.execute(
            'SELECT * FROM issue_notes_internal WHERE id = ?',
            [id]
        );
        
        if (entry.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Inward Internal entry not found.' });
        }

        // Get finished goods and reverse their stock impact
        const [finishedGoods] = await connection.execute(
            'SELECT * FROM inward_internal_finished_goods WHERE inward_internal_id = ?',
            [id]
        );
        
        for (const fg of finishedGoods) {
            // Reverse the inward effect (reduce main stock)
            await updateItemStock(fg.item_id, fg.quantity, 'outward', connection);
        }

        // Get materials used and reverse their stock impact
        const [materialsUsed] = await connection.execute(
            'SELECT * FROM inward_internal_materials_used WHERE inward_internal_id = ?',
            [id]
        );
        
        for (const mu of materialsUsed) {
            // Reverse the outward effect (add back to production floor stock)
            await updateProductionFloorStock(mu.item_id, mu.quantity, 'inward', connection);
        }

        // Delete related records
        await connection.execute('DELETE FROM inward_internal_finished_goods WHERE inward_internal_id = ?', [id]);
        await connection.execute('DELETE FROM inward_internal_materials_used WHERE inward_internal_id = ?', [id]);
        
        // Delete main record
        await connection.execute('DELETE FROM inward_internals WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: 'Inward Internal entry deleted successfully! Stock levels restored.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error deleting inward internal entry:', err);
        res.status(500).json({ message: 'Error deleting inward internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Generate item code based on category and subcategory
app.get('/api/items/generate-code/:categoryId/:subcategoryId', async (req, res) => {
    const { categoryId, subcategoryId } = req.params;
    
    try {
        // Get category and subcategory details
        const [categoryResult] = await pool.execute(
            'SELECT category_name FROM item_categories WHERE id = ?',
            [categoryId]
        );
        
        const [subcategoryResult] = await pool.execute(
            'SELECT subcategory_name FROM subcategories WHERE id = ?',
            [subcategoryId]
        );
        
        if (categoryResult.length === 0 || subcategoryResult.length === 0) {
            return res.status(404).json({ message: 'Category or subcategory not found' });
        }
        
        const categoryName = categoryResult[0].category_name;
        const subcategoryName = subcategoryResult[0].subcategory_name;
        
        // Create category prefix (first 2 letters of category)
        const categoryPrefix = categoryName.substring(0, 2).toUpperCase();
        
        // Create subcategory prefix (first 2 letters of subcategory)
        const subcategoryPrefix = subcategoryName.substring(0, 2).toUpperCase();
        
        // Count existing items with same category and subcategory
        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as count FROM items WHERE category_id = ? AND subcategory_id = ?',
            [categoryId, subcategoryId]
        );
        
        const nextSequence = countResult[0].count + 1;
        
        // Generate item code: PREFIX-SUBPREFIX-001
        const itemCode = `${categoryPrefix}${subcategoryPrefix}-${nextSequence.toString().padStart(3, '0')}`;
        
        res.json({ itemCode });
    } catch (error) {
        console.error('Error generating item code:', error);
        res.status(500).json({ message: 'Error generating item code', error: error.message });
    }
});

// Generate auto-increment GRN number for gate inwards
app.get('/api/gate-inwards/generate-grn-number', async (req, res) => {
    try {
        // Get the latest GRN number
        const [rows] = await pool.execute(
            'SELECT grn_number FROM gate_inwards ORDER BY id DESC LIMIT 1'
        );
        
        let nextNumber = 1;
        let prefix = 'GRN-';
        
        if (rows.length > 0) {
            const lastGrnNumber = rows[0].grn_number;
            // Extract number from GRN like "GRN-001"
            const match = lastGrnNumber.match(/GRN-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        
        // Generate new GRN number with zero padding
        const newGrnNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
        
        res.json({ grnNumber: newGrnNumber });
    } catch (err) {
        console.error('Error generating GRN number:', err);
        res.status(500).json({ message: 'Error generating GRN number', error: err.message });
    }
});

// Generate auto-increment challan number for outward challans
app.get('/api/outward-challans/generate-challan-number', async (req, res) => {
    try {
        // Get the latest challan number
        const [rows] = await pool.execute(
            'SELECT challan_no FROM outward_challans ORDER BY id DESC LIMIT 1'
        );
        
        let nextNumber = 1;
        let prefix = 'CHL-';
        
        if (rows.length > 0) {
            const lastChallanNumber = rows[0].challan_no;
            // Extract number from challan like "CHL-001"
            const match = lastChallanNumber.match(/CHL-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        
        // Generate new challan number with zero padding
        const newChallanNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
        
        res.json({ challanNumber: newChallanNumber });
    } catch (err) {
        console.error('Error generating challan number:', err);
        res.status(500).json({ message: 'Error generating challan number', error: err.message });
    }
});

// Outward Challans
// Update the app.get('/api/outward-challans') route with this fixed version
// Fix the outward challans endpoint to properly handle parameters
app.get('/api/outward-challans', async (req, res) => {
    const { limit = 5 } = req.query;
    
    try {
        // Ensure limit is a valid integer
        const limitValue = parseInt(limit) || 5;
        
        // Use question mark placeholder for the LIMIT clause
        const [rows] = await pool.query(`
            SELECT oc.*, p.party_name
            FROM outward_challans oc
            JOIN parties p ON oc.party_id = p.id
            ORDER BY oc.created_at DESC
            LIMIT ?
        `, [limitValue]);  // Pass limitValue as a parameter
        
        // Fetch associated items for each outward challan
        for (let i = 0; i < rows.length; i++) {
            const [items] = await pool.query(`
                SELECT oci.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM outward_challan_items oci
                JOIN items it ON oci.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE oci.outward_challan_id = ?
            `, [rows[i].id]);
            rows[i].items = items;
        }
        
        res.json(rows);
    } catch (err) {
        console.error('Error fetching outward challans:', err);
        res.status(500).json({ message: 'Error fetching outward challans', error: err.message });
    }
});

app.post('/api/outward-challans', async (req, res) => {
    const { partyId, challanNo, challanDate, transport, lrNo, remark, items, userId } = req.body;
    
    if (!partyId || !challanNo || !challanDate || !items || items.length === 0) {
        return res.status(400).json({ message: 'Party, challan number, challan date, and items are required for Outward Challan.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check stock levels before proceeding
        for (const item of items) {
            const [stockRows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [item.itemId]);
            if (stockRows.length === 0 || stockRows[0].stock < item.qty) {
                await connection.rollback();
                const itemName = stockRows.length > 0 ? 'Item' : 'Unknown item';
                return res.status(400).json({ 
                    message: `Not enough stock for ${itemName} ID ${item.itemId}. Available: ${stockRows[0]?.stock || 0}, Required: ${item.qty}` 
                });
            }
        }

        // Insert Outward Challan header
        const [challanResult] = await connection.execute(
            'INSERT INTO outward_challans (party_id, challan_no, challan_date, transport, lr_no, remark, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [partyId, challanNo, challanDate, transport, lrNo, remark, userId]
        );
        const challanId = challanResult.insertId;

        // Insert Outward Challan items and update stock (outward)
        for (const item of items) {
            await connection.execute(
                'INSERT INTO outward_challan_items (outward_challan_id, item_id, value_of_goods_uom, quantity, remark) VALUES (?, ?, ?, ?, ?)',
                [challanId, item.itemId, item.valueOfGoodsUom, item.qty, item.remark]
            );
            
            // Reduce from main stock
            await updateItemStock(item.itemId, item.qty, 'outward', connection);
        }

        await connection.commit();
        res.status(201).json({ 
            message: 'Outward Challan created successfully! Items dispatched and stock updated.', 
            id: challanId
        });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding outward challan:', err);
        res.status(500).json({ message: 'Error adding outward challan', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.put('/api/outward-challans/:id', async (req, res) => {
    const { id } = req.params;
    const { partyId, challanNo, challanDate, transport, lrNo, remark, items, userId } = req.body;
    
    if (!partyId || !challanNo || !challanDate || !items || items.length === 0) {
        return res.status(400).json({ message: 'Required fields are missing for Outward Challan update.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get existing items and reverse their stock impact
        const [existingItems] = await connection.execute(
            'SELECT * FROM outward_challan_items WHERE outward_challan_id = ?',
            [id]
        );
        
        for (const item of existingItems) {
            // Reverse the previous outward effect (add back to stock)
            await updateItemStock(item.item_id, item.quantity, 'inward', connection);
        }

        // Delete existing items
        await connection.execute('DELETE FROM outward_challan_items WHERE outward_challan_id = ?', [id]);

        // Update the main record
        await connection.execute(
            'UPDATE outward_challans SET party_id = ?, challan_no = ?, challan_date = ?, transport = ?, lr_no = ?, remark = ?, updated_at = NOW() WHERE id = ?',
            [partyId, challanNo, challanDate, transport, lrNo, remark, id]
        );

        // Check stock levels for new items
        for (const item of items) {
            const [stockRows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [item.itemId]);
            if (stockRows.length === 0 || stockRows[0].stock < item.qty) {
                await connection.rollback();
                return res.status(400).json({ 
                    message: `Not enough stock for item ID ${item.itemId}. Available: ${stockRows[0]?.stock || 0}, Required: ${item.qty}` 
                });
            }
        }

        // Insert new items and update stocks
        for (const item of items) {
            await connection.execute(
                'INSERT INTO outward_challan_items (outward_challan_id, item_id, value_of_goods_uom, quantity, remark) VALUES (?, ?, ?, ?, ?)',
                [id, item.itemId, item.valueOfGoodsUom, item.qty, item.remark]
            );
            
            // Reduce from stock
            await updateItemStock(item.itemId, item.qty, 'outward', connection);
        }

        await connection.commit();
        res.json({ message: 'Outward Challan updated successfully! Stock adjusted accordingly.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error updating outward challan:', err);
        res.status(500).json({ message: 'Error updating outward challan', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.delete('/api/outward-challans/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get items and reverse their stock impact
        const [items] = await connection.execute(
            'SELECT * FROM outward_challan_items WHERE outward_challan_id = ?',
            [id]
        );
        
        for (const item of items) {
            // Reverse the outward effect (add back to stock)
            await updateItemStock(item.item_id, item.quantity, 'inward', connection);
        }

        // Delete related records
        await connection.execute('DELETE FROM outward_challan_items WHERE outward_challan_id = ?', [id]);
        
        // Delete main record
        await connection.execute('DELETE FROM outward_challans WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: 'Outward Challan deleted successfully! Stock levels restored.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error deleting outward challan:', err);
        res.status(500).json({ message: 'Error deleting outward challan', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Fix the PUT /api/inward-internals/:id endpoint in server.js
app.put('/api/inward-internals/:id', async (req, res) => {
    const { id } = req.params;
    const { itemId, qty, unitRate, remark, userId } = req.body;

    if (!itemId || !qty || qty <= 0) {
        return res.status(400).json({ message: 'Item ID and quantity are required for Inward Internal update.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get the current record to calculate differences
        const [currentRecord] = await connection.execute(
            'SELECT item_id, quantity FROM inward_internals WHERE id = ?',
            [id]
        );

        if (currentRecord.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Inward Internal record not found.' });
        }

        const oldItemId = currentRecord[0].item_id;
        const oldQuantity = parseFloat(currentRecord[0].quantity);
        const newQuantity = parseFloat(qty);

        // If item changed, revert old item's stock and update new item's stock
        if (oldItemId !== parseInt(itemId)) {
            // Revert old item's stock (subtract from both tables)
            await connection.execute(
                'UPDATE items SET stock = stock - ? WHERE id = ?',
                [oldQuantity, oldItemId]
            );
            await connection.execute(
                'UPDATE production_floor_stocks SET quantity = quantity - ? WHERE item_id = ?',
                [oldQuantity, oldItemId]
            );

            // Add to new item's stock
            await connection.execute(
                'UPDATE items SET stock = stock + ? WHERE id = ?',
                [newQuantity, itemId]
            );
            await connection.execute(
                'UPDATE production_floor_stocks SET quantity = quantity + ? WHERE item_id = ?',
                [newQuantity, itemId]
            );
        } else {
            // Same item, just update the quantity difference
            const quantityDifference = newQuantity - oldQuantity;
            
            await connection.execute(
                'UPDATE items SET stock = stock + ? WHERE id = ?',
                [quantityDifference, itemId]
            );
            await connection.execute(
                'UPDATE production_floor_stocks SET quantity = quantity + ? WHERE item_id = ?',
                [quantityDifference, itemId]
            );
        }

        // Update the inward internal record
        await connection.execute(`
            UPDATE inward_internals 
            SET item_id = ?, quantity = ?, unit_rate = ?, remark = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [itemId, newQuantity, unitRate || 0, remark || '', id]);

        await connection.commit();
        res.json({ message: 'Inward Internal updated successfully!', id });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error updating inward internal:', err);
        res.status(500).json({ message: 'Error updating inward internal', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Replace the existing GET endpoint for inward-internals with this corrected version
app.get('/api/inward-internals', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT * FROM inward_internals 
            ORDER BY created_at DESC
        `);
        
        // Fetch associated items for each inward entry
        for (let i = 0; i < rows.length; i++) {
            // Get finished goods
            const [finishedGoodsRows] = await pool.execute(`
                SELECT iifg.*, i.item_name, i.item_code, i.full_description
                FROM inward_internal_finished_goods iifg
                LEFT JOIN items i ON iifg.item_id = i.id
                WHERE iifg.inward_internal_id = ?
            `, [rows[i].id]);
            
            // Get materials used
            const [materialsUsedRows] = await pool.execute(`
                SELECT iimu.*, i.item_name, i.item_code, i.full_description
                FROM inward_internal_materials_used iimu
                LEFT JOIN items i ON iimu.item_id = i.id
                WHERE iimu.inward_internal_id = ?
            `, [rows[i].id]);
            
            rows[i].finished_goods = finishedGoodsRows;
            rows[i].materials_used = materialsUsedRows;
        }
        
        res.json(rows);
    } catch (err) {
        console.error('Error fetching inward internals:', err);
        res.status(500).json({ message: 'Error fetching inward internals', error: err.message });
    }
});

// Add endpoint to generate receipt number (MUST be before the :id route)
app.get('/api/inward-internals/generate-receipt-number', async (req, res) => {
    try {
        console.log('Generating receipt number...');
        
        // Get the latest receipt number
        const [rows] = await pool.execute(
            'SELECT receipt_no FROM inward_internals WHERE receipt_no IS NOT NULL ORDER BY id DESC LIMIT 1'
        );
        
        console.log('Found existing receipt numbers:', rows);
        
        let nextNumber = 1;
        let prefix = 'REC-';
        
        if (rows.length > 0 && rows[0].receipt_no) {
            const lastReceiptNo = rows[0].receipt_no;
            console.log('Last receipt number:', lastReceiptNo);
            
            // Extract number from receipt like "REC-001"
            const match = lastReceiptNo.match(/REC-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
                console.log('Next number calculated:', nextNumber);
            }
        }
        
        // Generate new receipt number with zero padding
        const newReceiptNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
        console.log('Generated receipt number:', newReceiptNumber);
        
        res.json({ receiptNumber: newReceiptNumber });
    } catch (err) {
        console.error('Error generating receipt number:', err);
        res.status(500).json({ message: 'Error generating receipt number', error: err.message });
    }
});

// Add endpoint to get individual inward internal entry with items
app.get('/api/inward-internals/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get the main entry
        const [mainRows] = await pool.execute(
            'SELECT * FROM inward_internals WHERE id = ?',
            [id]
        );
        
        if (mainRows.length === 0) {
            return res.status(404).json({ message: 'Inward internal entry not found' });
        }
        
        const entry = mainRows[0];
        
        // Get finished goods
        const [finishedGoodsRows] = await pool.execute(`
            SELECT iifg.*, i.item_name, i.item_code, i.full_description
            FROM inward_internal_finished_goods iifg
            LEFT JOIN items i ON iifg.item_id = i.id
            WHERE iifg.inward_internal_id = ?
        `, [id]);
        
        // Get materials used
        const [materialsUsedRows] = await pool.execute(`
            SELECT iimu.*, i.item_name, i.item_code, i.full_description, pfs.quantity as available_stock
            FROM inward_internal_materials_used iimu
            LEFT JOIN items i ON iimu.item_id = i.id
            LEFT JOIN production_floor_stocks pfs ON iimu.item_id = pfs.item_id
            WHERE iimu.inward_internal_id = ?
        `, [id]);
        
        const result = {
            ...entry,
            finished_goods: finishedGoodsRows,
            materials_used: materialsUsedRows
        };
        
        res.json(result);
    } catch (err) {
        console.error('Error fetching inward internal entry:', err);
        res.status(500).json({ message: 'Error fetching inward internal entry', error: err.message });
    }
});
// Replace your current POST endpoint for inward-internals with this updated version
app.post('/api/inward-internals', async (req, res) => {
    const { receiptNo, receivedDate, receivedBy, department, finishGoods, materialUsed, userId } = req.body;
    
    // Validate required fields
    if (!finishGoods || finishGoods.length === 0 || !materialUsed || materialUsed.length === 0) {
        return res.status(400).json({ message: 'Finished goods and materials used are required for Inward Internal.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insert the main inward internal record
        const [result] = await connection.execute(
            'INSERT INTO inward_internals (receipt_no, received_date, received_by, department, user_id) VALUES (?, ?, ?, ?, ?)',
            [receiptNo || null, receivedDate, receivedBy, department, userId]
        );

        const inwardId = result.insertId;

        // Process finished goods (add to inventory)
        for (const item of finishGoods) {
            if (!item.itemId || item.qty <= 0) continue;
            
            // Insert finished goods entry
            await connection.execute(
                'INSERT INTO inward_internal_finished_goods (inward_internal_id, item_id, quantity, uom, unit_rate, remark) VALUES (?, ?, ?, ?, ?, ?)',
                [inwardId, item.itemId, item.qty, item.uom || 'PC', item.unitRate || 0, item.remark || null]
            );

            // Update main inventory (increase finished goods stock)
            await connection.execute(
                'UPDATE items SET stock = stock + ? WHERE id = ?',
                [item.qty, item.itemId]
            );
        }

        // Process materials used (deduct from production floor)
        for (const item of materialUsed) {
            if (!item.itemId || item.qty <= 0) continue;
            
            // Insert materials used entry
            await connection.execute(
                'INSERT INTO inward_internal_materials_used (inward_internal_id, item_id, quantity, uom, unit_rate, remark) VALUES (?, ?, ?, ?, ?, ?)',
                [inwardId, item.itemId, item.qty, item.uom || 'PC', item.unitRate || 0, item.remark || null]
            );

            // Update production floor stock (decrease raw materials)
            await connection.execute(
                'UPDATE production_floor_stocks SET quantity = quantity - ? WHERE item_id = ?',
                [item.qty, item.itemId]
            );
        }

        await connection.commit();
        res.status(201).json({ 
            message: 'Production entry added successfully! Finished goods added to inventory and materials deducted from production floor.', 
            id: inwardId 
        });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding inward internal entry:', err);
        res.status(500).json({ message: 'Error adding inward internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Dashboard Stats Endpoint
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const [partiesResult] = await pool.execute('SELECT COUNT(*) as total FROM parties');
        const totalParties = partiesResult[0].total;

        const [itemsResult] = await pool.execute('SELECT COUNT(*) as total FROM items');
        const totalItems = itemsResult[0].total;

        const [categoriesResult] = await pool.execute('SELECT COUNT(*) as total FROM item_categories');
        const totalCategories = categoriesResult[0].total;

        // Get recent gate inwards
        const [recentGateInwards] = await pool.execute(`
            SELECT gi.id, gi.grn_number, gi.grn_date, p.party_name as supplier_name
            FROM gate_inwards gi
            JOIN parties p ON gi.supplier_id = p.id
            ORDER BY gi.created_at DESC
            LIMIT 5
        `);

        // Get recent issue notes
        const [recentIssueNotes] = await pool.execute(`
            SELECT ini.id, ini.issue_no, ini.issue_date, ini.department
            FROM issue_notes_internal ini
            ORDER BY ini.created_at DESC
            LIMIT 5
        `);

        // Get recent inwards
        const [recentInwards] = await pool.execute(`
            SELECT ii.id, ii.receipt_no, ii.received_date, ii.department
            FROM inward_internals ii
            ORDER BY ii.created_at DESC
            LIMIT 5
        `);

        // Get recent outwards
        const [recentOutwards] = await pool.execute(`
            SELECT oc.id, oc.challan_no, oc.challan_date, p.party_name as customer_name
            FROM outward_challans oc
            JOIN parties p ON oc.party_id = p.id
            ORDER BY oc.created_at DESC
            LIMIT 5
        `);

        res.json({
            totalParties,
            totalItems,
            totalCategories,
            recentGateInwards,
            recentIssueNotes,
            recentInwards,
            recentOutwards
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
