-- Database: flour_mill_erp
-- Uncomment these lines if you want to create database automatically
-- CREATE DATABASE IF NOT EXISTS flour_mill_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE flour_mill_erp;

-- Table: parties (Party Master)
CREATE TABLE IF NOT EXISTS parties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    party_code VARCHAR(50) UNIQUE NOT NULL,
    party_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(15),
    address TEXT,
    city VARCHAR(100),
    bank_account VARCHAR(50),
    bank_name VARCHAR(255),
    ifsc_code VARCHAR(11),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    INDEX idx_party_code (party_code),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: item_categories (Main Categories: Raw Material, Finish Good)
CREATE TABLE IF NOT EXISTS item_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    INDEX idx_category_name (category_name),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert main categories (ensure exact names for consistency)
INSERT INTO item_categories (category_name, user_id) 
SELECT 'Raw Material', 'system'
WHERE NOT EXISTS (SELECT 1 FROM item_categories WHERE category_name = 'Raw Material');

INSERT INTO item_categories (category_name, user_id) 
SELECT 'Finish Good', 'system'
WHERE NOT EXISTS (SELECT 1 FROM item_categories WHERE category_name = 'Finish Good');

-- Table: subcategories (proper foreign key and naming consistency)
CREATE TABLE IF NOT EXISTS subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    subcategory_name VARCHAR(255) NOT NULL,
    field1_name VARCHAR(100) DEFAULT 'Description 1',
    field2_name VARCHAR(100) DEFAULT 'Description 2',
    field3_name VARCHAR(100) DEFAULT 'Description 3',
    field4_name VARCHAR(100) DEFAULT 'Description 4',
    field5_name VARCHAR(100) DEFAULT 'Description 5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_subcategory_per_category (category_id, subcategory_name),
    INDEX idx_category_id (category_id),
    INDEX idx_subcategory_name (subcategory_name),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Raw Material subcategories (cleaned up names for consistency)
INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Raw Material' LIMIT 1),
    'Electrical',
    'Component Type',
    'Specification', 
    'Power Rating',
    'Voltage',
    'Brand',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Raw Material' AND s.subcategory_name = 'Electrical'
);

INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Raw Material' LIMIT 1),
    'Hydraulic',
    'Component Type',
    'Pressure Rating',
    'Flow Rate',
    'Connection Size',
    'Brand',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Raw Material' AND s.subcategory_name = 'Hydraulic'
);

INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Raw Material' LIMIT 1),
    'Cutting Tool',
    'Tool Type',
    'Size',
    'Material',
    'Coating',
    'Brand',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Raw Material' AND s.subcategory_name = 'Cutting Tool'
);

-- Fixed naming for chemical subcategory
INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Raw Material' LIMIT 1),
    'Chemical',
    'Chemical Name',
    'Grade',
    'Form',
    'Pack Size',
    'Supplier',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Raw Material' AND s.subcategory_name = 'Chemical'
);

-- Fixed naming for hardware subcategory
INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Raw Material' LIMIT 1),
    'Hardware',
    'Type',
    'Size',
    'Material',
    'Grade',
    'Thread Pitch',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Raw Material' AND s.subcategory_name = 'Hardware'
);

INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Raw Material' LIMIT 1),
    'Packing Material',
    'Material Type',
    'Size',
    'Thickness',
    'Color',
    'Brand',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Raw Material' AND s.subcategory_name = 'Packing Material'
);

-- Finish Good subcategories
INSERT INTO subcategories (category_id, subcategory_name, field1_name, field2_name, field3_name, field4_name, field5_name, user_id) 
SELECT 
    (SELECT id FROM item_categories WHERE category_name = 'Finish Good' LIMIT 1),
    'Product',
    'Product Type',
    'Model',
    'Capacity',
    'Power Rating',
    'Warranty Period',
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM subcategories s 
    JOIN item_categories ic ON s.category_id = ic.id 
    WHERE ic.category_name = 'Finish Good' AND s.subcategory_name = 'Product'
);

-- Table: items (Item Master) - with proper data types and constraints
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    description1 VARCHAR(255),
    description2 VARCHAR(255),
    description3 VARCHAR(255),
    description4 VARCHAR(255),
    description5 VARCHAR(255),
    full_description TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_level INT NOT NULL DEFAULT 0,
    unit_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    rack_bin VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL, -- Made NOT NULL for data integrity
    FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE RESTRICT,
    INDEX idx_item_code (item_code),
    INDEX idx_category_id (category_id),
    INDEX idx_subcategory_id (subcategory_id),
    INDEX idx_stock_level (stock, min_level),
    INDEX idx_user_id (user_id),
    -- Add constraint to ensure stock is not negative
    CHECK (stock >= 0),
    CHECK (min_level >= 0),
    CHECK (unit_rate >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: gate_inwards (Gate Inward)
CREATE TABLE IF NOT EXISTS gate_inwards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_no VARCHAR(100) NOT NULL,
    bill_date DATE NOT NULL,
    supplier_id INT NOT NULL,
    grn_number VARCHAR(100) NOT NULL,
    grn_date DATE NOT NULL,
    payment_terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL, -- Made NOT NULL
    FOREIGN KEY (supplier_id) REFERENCES parties(id) ON DELETE RESTRICT,
    INDEX idx_bill_no (bill_no),
    INDEX idx_grn_number (grn_number),
    INDEX idx_supplier_id (supplier_id),
    INDEX idx_user_id (user_id),
    INDEX idx_bill_date (bill_date),
    INDEX idx_grn_date (grn_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: gate_inward_items (Details for Gate Inward)
CREATE TABLE IF NOT EXISTS gate_inward_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gate_inward_id INT NOT NULL,
    item_id INT NOT NULL,
    unit_rate DECIMAL(10, 2) NOT NULL,
    uom VARCHAR(50) NOT NULL DEFAULT 'PC', -- Added default UOM
    quantity INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    remark TEXT,
    FOREIGN KEY (gate_inward_id) REFERENCES gate_inwards(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    INDEX idx_gate_inward_id (gate_inward_id),
    INDEX idx_item_id (item_id),
    -- Add constraints for positive values
    CHECK (unit_rate >= 0),
    CHECK (quantity > 0),
    CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: issue_notes_internal (Issue Note - Internal)
CREATE TABLE IF NOT EXISTS issue_notes_internal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(255) NOT NULL,
    issue_no VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    issued_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL, -- Made NOT NULL
    INDEX idx_issue_no (issue_no),
    INDEX idx_department (department),
    INDEX idx_issue_date (issue_date),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: issue_note_internal_items (Details for Issue Note - Internal)
CREATE TABLE IF NOT EXISTS issue_note_internal_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_note_id INT NOT NULL,
    item_id INT NOT NULL,
    unit_rate DECIMAL(10, 2) NOT NULL,
    uom VARCHAR(50) NOT NULL DEFAULT 'PC',
    quantity INT NOT NULL,
    remark TEXT,
    FOREIGN KEY (issue_note_id) REFERENCES issue_notes_internal(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    INDEX idx_issue_note_id (issue_note_id),
    INDEX idx_item_id (item_id),
    CHECK (unit_rate >= 0),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: inward_internals (Inward - Internal)
CREATE TABLE IF NOT EXISTS inward_internals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(100) NOT NULL,
    received_date DATE NOT NULL,
    received_by VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL, -- Made NOT NULL
    INDEX idx_receipt_no (receipt_no),
    INDEX idx_department (department),
    INDEX idx_received_date (received_date),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: inward_internal_finished_goods (Finished Goods details for Inward - Internal)
CREATE TABLE IF NOT EXISTS inward_internal_finished_goods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inward_internal_id INT NOT NULL,
    item_id INT NOT NULL,
    unit_rate DECIMAL(10, 2) NOT NULL,
    uom VARCHAR(50) NOT NULL DEFAULT 'PC',
    quantity INT NOT NULL,
    remark TEXT,
    FOREIGN KEY (inward_internal_id) REFERENCES inward_internals(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    INDEX idx_inward_internal_id (inward_internal_id),
    INDEX idx_item_id (item_id),
    CHECK (unit_rate >= 0),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: inward_internal_materials_used (Materials Used details for Inward - Internal)
CREATE TABLE IF NOT EXISTS inward_internal_materials_used (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inward_internal_id INT NOT NULL,
    item_id INT NOT NULL,
    unit_rate DECIMAL(10, 2) NOT NULL,
    uom VARCHAR(50) NOT NULL DEFAULT 'PC',
    quantity INT NOT NULL,
    remark TEXT,
    FOREIGN KEY (inward_internal_id) REFERENCES inward_internals(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    INDEX idx_inward_internal_id (inward_internal_id),
    INDEX idx_item_id (item_id),
    CHECK (unit_rate >= 0),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: outward_challans (Outward Challan / Dispatch Note)
CREATE TABLE IF NOT EXISTS outward_challans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    party_id INT NOT NULL,
    challan_no VARCHAR(100) NOT NULL,
    challan_date DATE NOT NULL,
    transport VARCHAR(255),
    lr_no VARCHAR(100),
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL, -- Made NOT NULL
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE RESTRICT,
    INDEX idx_challan_no (challan_no),
    INDEX idx_party_id (party_id),
    INDEX idx_challan_date (challan_date),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: outward_challan_items (Details for Outward Challan)
CREATE TABLE IF NOT EXISTS outward_challan_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    outward_challan_id INT NOT NULL,
    item_id INT NOT NULL,
    value_of_goods_uom VARCHAR(50) NOT NULL DEFAULT 'PC',
    quantity INT NOT NULL,
    remark TEXT,
    FOREIGN KEY (outward_challan_id) REFERENCES outward_challans(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    INDEX idx_outward_challan_id (outward_challan_id),
    INDEX idx_item_id (item_id),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: production_floor_stocks (Track materials available on production floor)
CREATE TABLE IF NOT EXISTS production_floor_stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    uom VARCHAR(50) NOT NULL DEFAULT 'PC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_item_production_floor (item_id),
    INDEX idx_item_id (item_id),
    INDEX idx_quantity (quantity),
    CHECK (quantity >= 0),
    CHECK (unit_rate >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create triggers for automatic timestamp updates
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_subcategories_updated_at
    BEFORE UPDATE ON subcategories
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER IF NOT EXISTS update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER IF NOT EXISTS update_production_floor_stocks_updated_at
    BEFORE UPDATE ON production_floor_stocks
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- Add triggers for other tables
CREATE TRIGGER IF NOT EXISTS update_parties_updated_at
    BEFORE UPDATE ON parties
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER IF NOT EXISTS update_categories_updated_at
    BEFORE UPDATE ON item_categories
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;
