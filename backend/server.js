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

app.post('/api/parties', async (req, res) => {
    const { partyCode, partyName, gst, address, city, bankAccount, bankName, ifscCode, userId } = req.body;
    if (!partyCode || !partyName) {
        return res.status(400).json({ message: 'Party Code and Party Name are required.' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO parties (party_code, party_name, gst_number, address, city, bank_account, bank_name, ifsc_code, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [partyCode, partyName, gst, address, city, bankAccount, bankName, ifscCode, userId]
        );
        res.status(201).json({ message: 'Party added successfully', id: result.insertId });
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
    const { code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, rackBin, userId } = req.body;
    
    if (!code || !itemName || !categoryId || !subcategoryId || !userId) {
        return res.status(400).json({ message: 'Code, item name, category ID, subcategory ID, and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO items (item_code, item_name, category_id, subcategory_id, description1, description2, description3, description4, description5, full_description, stock, min_level, unit_rate, rack_bin, user_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, rackBin, userId]
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
    const { code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, rackBin, userId } = req.body;

    if (!code || !itemName || !categoryId || !subcategoryId || !userId) {
        return res.status(400).json({ message: 'Code, item name, category ID, subcategory ID, and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE items 
             SET item_code = ?, item_name = ?, category_id = ?, subcategory_id = ?, description1 = ?, description2 = ?, description3 = ?, description4 = ?, description5 = ?, full_description = ?, stock = ?, min_level = ?, unit_rate = ?, rack_bin = ?, updated_at = NOW()
             WHERE id = ?`,
            [code, itemName, categoryId, subcategoryId, desc1, desc2, desc3, desc4, desc5, fullDescription, stock, minLevel, unitRate, rackBin, id]
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
    const { billNo, billDate, supplierId, grn, grnDate, paymentTerms, items, userId } = req.body;
    if (!billNo || !billDate || !supplierId || !grn || !grnDate || !items || items.length === 0) {
        return res.status(400).json({ message: 'Required fields are missing for Gate Inward.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insert Gate Inward header
        const [inwardResult] = await connection.execute(
            'INSERT INTO gate_inwards (bill_no, bill_date, supplier_id, grn_number, grn_date, payment_terms, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [billNo, billDate, supplierId, grn, grnDate, paymentTerms, userId]
        );
        const gateInwardId = inwardResult.insertId;

        // Insert Gate Inward items and update stock
        for (const item of items) {
            await connection.execute(
                'INSERT INTO gate_inward_items (gate_inward_id, item_id, unit_rate, uom, quantity, amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [gateInwardId, item.itemId, item.unitRate, item.uom, item.qty, item.amount, item.remark]
            );
            await updateItemStock(item.itemId, item.qty, 'inward', connection);
        }

        await connection.commit();
        res.status(201).json({ message: 'Gate Inward entry added successfully and stock updated!', id: gateInwardId });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding gate inward entry:', err);
        res.status(500).json({ message: 'Error adding gate inward entry', error: err.message });
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

        // Check stock levels before proceeding
        for (const item of items) {
            const [stockRows] = await connection.execute('SELECT stock FROM items WHERE id = ?', [item.itemId]);
            if (stockRows.length === 0 || stockRows[0].stock < item.qty) {
                await connection.rollback();
                return res.status(400).json({ message: `Not enough stock for item ID ${item.itemId}.` });
            }
        }

        // Insert Issue Note header
        const [issueResult] = await connection.execute(
            'INSERT INTO issue_notes_internal (department, issue_no, issue_date, issued_by, user_id) VALUES (?, ?, ?, ?, ?)',
            [department, issueNo, issueDate, issuedBy, userId]
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
        res.status(201).json({ message: 'Issue Note Internal entry added successfully! Stock moved to production floor.', id: issueNoteId });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding issue note internal entry:', err);
        res.status(500).json({ message: 'Error adding issue note internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Inward - Internal (Finished Goods)
app.get('/api/inward-internals', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM inward_internals ORDER BY created_at DESC');
        for (let i = 0; i < rows.length; i++) {
            const [finishedGoods] = await pool.execute(`
                SELECT iifg.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM inward_internal_finished_goods iifg
                JOIN items it ON iifg.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE iifg.inward_internal_id = ?
            `, [rows[i].id]);
            rows[i].finishGoods = finishedGoods;

            const [materialsUsed] = await pool.execute(`
                SELECT iimu.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM inward_internal_materials_used iimu
                JOIN items it ON iimu.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE iimu.inward_internal_id = ?
            `, [rows[i].id]);
            rows[i].materialUsed = materialsUsed;
        }
        res.json(rows);
    } catch (err) {
        console.error('Error fetching inward internals:', err);
        res.status(500).json({ message: 'Error fetching inward internals', error: err.message });
    }
});

app.post('/api/inward-internals', async (req, res) => {
    const { receiptNo, receivedDate, receivedBy, department, finishGoods, materialUsed, userId } = req.body;
    if (!receiptNo || !receivedDate || !receivedBy || !department || (!finishGoods && !materialUsed)) {
        return res.status(400).json({ message: 'Required fields are missing for Inward Internal.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check production floor stock for materials used before proceeding
        if (materialUsed && materialUsed.length > 0) {
            for (const item of materialUsed) {
                const [stockRows] = await connection.execute(
                    'SELECT quantity FROM production_floor_stocks WHERE item_id = ?', 
                    [item.itemId]
                );
                if (stockRows.length === 0 || stockRows[0].quantity < item.qty) {
                    await connection.rollback();
                    return res.status(400).json({ message: `Not enough production floor stock for material used item ID ${item.itemId}.` });
                }
            }
        }

        // Insert Inward Internal header
        const [inwardInternalResult] = await connection.execute(
            'INSERT INTO inward_internals (receipt_no, received_date, received_by, department, user_id) VALUES (?, ?, ?, ?, ?)',
            [receiptNo, receivedDate, receivedBy, department, userId]
        );
        const inwardInternalId = inwardInternalResult.insertId;

        // Insert Finished Goods and update main stock (inward)
        if (finishGoods && finishGoods.length > 0) {
            for (const fg of finishGoods) {
                await connection.execute(
                    'INSERT INTO inward_internal_finished_goods (inward_internal_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                    [inwardInternalId, fg.itemId, fg.unitRate, fg.uom, fg.qty, fg.remark]
                );
                await updateItemStock(fg.itemId, fg.qty, 'inward', connection);
            }
        }

        // Insert Materials Used and update production floor stock (outward)
        if (materialUsed && materialUsed.length > 0) {
            for (const mu of materialUsed) {
                await connection.execute(
                    'INSERT INTO inward_internal_materials_used (inward_internal_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                    [inwardInternalId, mu.itemId, mu.unitRate, mu.uom, mu.qty, mu.remark]
                );
                
                // Reduce from production floor stock instead of main stock
                await updateProductionFloorStock(mu.itemId, mu.qty, 'outward', connection);
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Inward Internal entry added successfully! Production completed and stocks updated.', id: inwardInternalId });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding inward internal entry:', err);
        res.status(500).json({ message: 'Error adding inward internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Generate auto-increment receipt number for inward internals
app.get('/api/inward-internals/generate-receipt-number', async (req, res) => {
    try {
        // Get the latest receipt number
        const [rows] = await pool.execute(
            'SELECT receipt_no FROM inward_internals ORDER BY id DESC LIMIT 1'
        );
        
        let nextNumber = 1;
        let prefix = 'INT-REC-';
        
        if (rows.length > 0) {
            const lastReceiptNo = rows[0].receipt_no;
            // Extract number from receipt like "INT-REC-001"
            const match = lastReceiptNo.match(/INT-REC-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        
        // Generate new receipt number with zero padding
        const newReceiptNo = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
        
        res.json({ receiptNumber: newReceiptNo });
    } catch (err) {
        console.error('Error generating receipt number:', err);
        res.status(500).json({ message: 'Error generating receipt number', error: err.message });
    }
});

// Get recent inward internal entries with limit and ordering
app.get('/api/inward-internals', async (req, res) => {
    const { limit = 50, orderBy = 'created_at', order = 'DESC' } = req.query;
    
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM inward_internals 
             ORDER BY ${orderBy} ${order} 
             LIMIT ?`,
            [parseInt(limit)]
        );
        
        // Fetch associated items for each entry
        for (let i = 0; i < rows.length; i++) {
            // Get finished goods
            const [finishedGoods] = await pool.execute(`
                SELECT iifg.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM inward_internal_finished_goods iifg
                JOIN items it ON iifg.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE iifg.inward_internal_id = ?
            `, [rows[i].id]);
            rows[i].finishGoods = finishedGoods;

            // Get materials used
            const [materialsUsed] = await pool.execute(`
                SELECT iimu.*, it.full_description AS item_description, it.item_name,
                       ic.category_name, s.subcategory_name
                FROM inward_internal_materials_used iimu
                JOIN items it ON iimu.item_id = it.id
                LEFT JOIN item_categories ic ON it.category_id = ic.id
                LEFT JOIN subcategories s ON it.subcategory_id = s.id
                WHERE iimu.inward_internal_id = ?
            `, [rows[i].id]);
            rows[i].materialUsed = materialsUsed;
        }
        
        res.json(rows);
    } catch (err) {
        console.error('Error fetching inward internals:', err);
        res.status(500).json({ message: 'Error fetching inward internals', error: err.message });
    }
});

// Update existing inward internal entry
app.put('/api/inward-internals/:id', async (req, res) => {
    const { id } = req.params;
    const { receiptNo, receivedDate, receivedBy, department, finishGoods, materialUsed, userId } = req.body;
    
    if (!receiptNo || !receivedDate || !receivedBy || !department) {
        return res.status(400).json({ message: 'Required fields are missing for Inward Internal update.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // First, get the existing entry to reverse its stock effects
        const [existingEntry] = await connection.execute(
            'SELECT * FROM inward_internals WHERE id = ?',
            [id]
        );
        
        if (existingEntry.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Inward Internal entry not found.' });
        }

        // Get existing finished goods and reverse their stock impact
        const [existingFinishedGoods] = await connection.execute(
            'SELECT * FROM inward_internal_finished_goods WHERE inward_internal_id = ?',
            [id]
        );
        
        for (const fg of existingFinishedGoods) {
            // Reverse the previous inward effect (reduce main stock)
            await updateItemStock(fg.item_id, fg.quantity, 'outward', connection);
        }

        // Get existing materials used and reverse their stock impact
        const [existingMaterialsUsed] = await connection.execute(
            'SELECT * FROM inward_internal_materials_used WHERE inward_internal_id = ?',
            [id]
        );
        
        for (const mu of existingMaterialsUsed) {
            // Reverse the previous outward effect (add back to production floor stock)
            await updateProductionFloorStock(mu.item_id, mu.quantity, 'inward', connection);
        }

        // Delete existing related records
        await connection.execute('DELETE FROM inward_internal_finished_goods WHERE inward_internal_id = ?', [id]);
        await connection.execute('DELETE FROM inward_internal_materials_used WHERE inward_internal_id = ?', [id]);

        // Update the main record
        await connection.execute(
            'UPDATE inward_internals SET receipt_no = ?, received_date = ?, received_by = ?, department = ?, updated_at = NOW() WHERE id = ?',
            [receiptNo, receivedDate, receivedBy, department, id]
        );

        // Check production floor stock for new materials used
        if (materialUsed && materialUsed.length > 0) {
            for (const item of materialUsed) {
                const [stockRows] = await connection.execute(
                    'SELECT quantity FROM production_floor_stocks WHERE item_id = ?',
                    [item.itemId]
                );
                if (stockRows.length === 0 || stockRows[0].quantity < item.qty) {
                    await connection.rollback();
                    return res.status(400).json({ 
                        message: `Not enough production floor stock for material used item ID ${item.itemId}.` 
                    });
                }
            }
        }

        // Insert new finished goods and update main stock
        if (finishGoods && finishGoods.length > 0) {
            for (const fg of finishGoods) {
                await connection.execute(
                    'INSERT INTO inward_internal_finished_goods (inward_internal_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                    [id, fg.itemId, fg.unitRate, fg.uom, fg.qty, fg.remark]
                );
                await updateItemStock(fg.itemId, fg.qty, 'inward', connection);
            }
        }

        // Insert new materials used and update production floor stock
        if (materialUsed && materialUsed.length > 0) {
            for (const mu of materialUsed) {
                await connection.execute(
                    'INSERT INTO inward_internal_materials_used (inward_internal_id, item_id, unit_rate, uom, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)',
                    [id, mu.itemId, mu.unitRate, mu.uom, mu.qty, mu.remark]
                );
                await updateProductionFloorStock(mu.itemId, mu.qty, 'outward', connection);
            }
        }

        await connection.commit();
        res.json({ message: 'Inward Internal entry updated successfully! Stocks adjusted accordingly.' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error updating inward internal entry:', err);
        res.status(500).json({ message: 'Error updating inward internal entry', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Delete inward internal entry
app.delete('/api/inward-internals/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get the entry to reverse its stock effects
        const [entry] = await connection.execute(
            'SELECT * FROM inward_internals WHERE id = ?',
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

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
