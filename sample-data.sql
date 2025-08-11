
-- Sample Items for different subcategories
-- Cutting Tools
INSERT INTO items (item_code, item_name, category_id, subcategory_id, description1, description2, description3, description4, description5, full_description, stock, min_level, unit_rate, uom, rack_bin, user_id) VALUES
('CUT-001', 'End Mill 10mm HSS', 1, 3, 'End Mill', '10mm', 'HSS', 'TiN Coated', 'Kennametal', 'End Mill 10mm HSS TiN Coated Kennametal', 20, 5, 850.00, 'PC', 'C1-D1', 'admin'),
('CUT-002', 'Drill Bit Set HSS', 1, 3, 'Drill Bit', '1-10mm Set', 'HSS', 'Uncoated', 'Bosch', 'Drill Bit 1-10mm Set HSS Uncoated Bosch', 15, 3, 1250.00, 'SET', 'C1-D2', 'admin'),
('CUT-003', 'Lathe Tool Carbide', 1, 3, 'Lathe Tool', '12mm', 'Carbide', 'CVD Coated', 'Sandvik', 'Lathe Tool 12mm Carbide CVD Coated Sandvik', 30, 8, 650.00, 'PC', 'C1-D3', 'admin');

-- Chemical items
INSERT INTO items (item_code, item_name, category_id, subcategory_id, description1, description2, description3, description4, description5, full_description, stock, min_level, unit_rate, uom, rack_bin, user_id) VALUES
('CHE-001', 'Cutting Oil Soluble', 1, 4, 'Cutting Oil', 'Industrial Grade', 'Liquid', '20 Ltr', 'Castrol', 'Cutting Oil Industrial Grade Liquid 20 Ltr Castrol', 50, 10, 2500.00, 'LTR', 'D1-E1', 'admin'),
('CHE-002', 'Rust Remover WD40', 1, 4, 'Rust Remover', 'Technical Grade', 'Spray', '400ml', 'WD-40', 'Rust Remover Technical Grade Spray 400ml WD-40', 100, 20, 285.00, 'PC', 'D1-E2', 'admin'),
('CHE-003', 'Grease Bearing High Temp', 1, 4, 'Grease', 'High Temperature', 'Semi Solid', '1 KG', 'Shell', 'Grease High Temperature Semi Solid 1 KG Shell', 25, 5, 450.00, 'KG', 'D1-E3', 'admin');

-- Packing Material items
INSERT INTO items (item_code, item_name, category_id, subcategory_id, description1, description2, description3, description4, description5, full_description, stock, min_level, unit_rate, uom, rack_bin, user_id) VALUES
('PAC-001', 'Carton Box Medium', 1, 6, 'Carton Box', '30x20x15 cm', '5mm Thick', 'Brown', 'VRL Pack', 'Carton Box 30x20x15 cm 5mm Thick Brown VRL Pack', 100, 20, 45.00, 'PC', 'F1-G1', 'admin'),
('PAC-002', 'Bubble Wrap Roll', 1, 6, 'Bubble Wrap', '1 Mtr Width', '2mm Thick', 'Transparent', 'Supreme', 'Bubble Wrap 1 Mtr Width 2mm Thick Transparent Supreme', 50, 10, 125.00, 'MTR', 'F1-G2', 'admin'),
('PAC-003', 'Packaging Tape Brown', 1, 6, 'Packaging Tape', '2 inch Width', '1mm Thick', 'Brown', '3M', 'Packaging Tape 2 inch Width 1mm Thick Brown 3M', 200, 40, 85.00, 'ROLL', 'F1-G3', 'admin');

-- Finish Good Products
INSERT INTO items (item_code, item_name, category_id, subcategory_id, description1, description2, description3, description4, description5, full_description, stock, min_level, unit_rate, uom, rack_bin, user_id) VALUES
('PRD-001', 'Rice Huller Machine 5HP', 2, 7, 'Rice Huller', 'RH-500', '500 kg/hr', '5 HP Motor', '2 Years', 'Rice Huller RH-500 500 kg/hr 5 HP Motor 2 Years', 3, 1, 125000.00, 'PC', 'G1-H1', 'admin'),
('PRD-002', 'Paddy Separator PS-300', 2, 7, 'Paddy Separator', 'PS-300', '300 kg/hr', '3 HP Motor', '2 Years', 'Paddy Separator PS-300 300 kg/hr 3 HP Motor 2 Years', 5, 1, 85000.00, 'PC', 'G1-H2', 'admin'),
('PRD-003', 'Rice Polisher RP-200', 2, 7, 'Rice Polisher', 'RP-200', '200 kg/hr', '2 HP Motor', '1.5 Years', 'Rice Polisher RP-200 200 kg/hr 2 HP Motor 1.5 Years', 4, 1, 65000.00, 'PC', 'G1-H3', 'admin');

-- Sample Gate Inward Records
INSERT INTO gate_inwards (grn_number, grn_date, bill_no, bill_date, supplier_id, payment_terms, user_id) VALUES
('GRN-001', '2025-01-15', 'INV-2025-001', '2025-01-15', 1, '30 Days Credit', 'admin'),
('GRN-002', '2025-01-18', 'INV-2025-002', '2025-01-18', 2, '45 Days Credit', 'admin'),
('GRN-003', '2025-01-20', 'INV-2025-003', '2025-01-20', 3, 'Cash on Delivery', 'admin'),
('GRN-004', '2025-01-22', 'INV-2025-004', '2025-01-22', 4, '30 Days Credit', 'admin');

-- Sample Gate Inward Items
INSERT INTO gate_inward_items (gate_inward_id, item_id, unit_rate, uom, quantity, amount, remark) VALUES
-- GRN-001 items
(1, 1, 12500.00, 'PC', 5.000, 62500.00, 'Motors for new production line'),
(1, 2, 1250.00, 'PC', 10.000, 12500.00, 'Contactors for control panel'),
(1, 3, 85.00, 'MTR', 100.000, 8500.00, 'Wiring cable for installation'),
-- GRN-002 items  
(2, 4, 25000.00, 'PC', 2.000, 50000.00, 'Hydraulic pumps for press machine'),
(2, 5, 8500.00, 'PC', 3.000, 25500.00, 'Hydraulic cylinders'),
(2, 6, 125.00, 'MTR', 50.000, 6250.00, 'Hydraulic hoses'),
-- GRN-003 items
(3, 7, 850.00, 'PC', 10.000, 8500.00, 'End mills for machining'),
(3, 8, 1250.00, 'SET', 5.000, 6250.00, 'Drill bit sets'),
(3, 9, 650.00, 'PC', 15.000, 9750.00, 'Lathe tools'),
-- GRN-004 items
(4, 10, 2500.00, 'LTR', 20.000, 50000.00, 'Cutting oil for machining'),
(4, 11, 285.00, 'PC', 50.000, 14250.00, 'Rust remover spray'),
(4, 12, 450.00, 'KG', 10.000, 4500.00, 'High temperature grease');

-- Sample Issue Notes Internal
INSERT INTO issue_notes_internal (department, issue_no, issue_date, issued_by, user_id) VALUES
('Production Floor', 'ISS-001', '2025-01-25', 'Store Manager', 'admin'),
('Assembly Unit', 'ISS-002', '2025-01-26', 'Production Head', 'admin'),
('Maintenance Dept', 'ISS-003', '2025-01-27', 'Maintenance Manager', 'admin'),
('Quality Control', 'ISS-004', '2025-01-28', 'QC Manager', 'admin');

-- Sample Issue Note Internal Items
INSERT INTO issue_note_internal_items (issue_note_id, item_id, unit_rate, uom, quantity, remark) VALUES
-- ISS-001 items
(1, 1, 12500.00, 'PC', 2, 'Motors for new rice huller assembly'),
(1, 13, 12.50, 'PC', 100, 'Bolts for motor mounting'),
(1, 14, 4.50, 'PC', 100, 'Nuts for bolts'),
-- ISS-002 items
(2, 4, 25000.00, 'PC', 1, 'Hydraulic pump for press assembly'),
(2, 6, 125.00, 'MTR', 10, 'Hydraulic hoses for connections'),
(2, 15, 1.25, 'PC', 200, 'Washers for hydraulic fittings'),
-- ISS-003 items
(3, 7, 850.00, 'PC', 5, 'End mills for maintenance work'),
(3, 10, 2500.00, 'LTR', 5, 'Cutting oil for machine maintenance'),
(3, 12, 450.00, 'KG', 2, 'Grease for bearing maintenance'),
-- ISS-004 items
(4, 11, 285.00, 'PC', 10, 'Rust remover for equipment cleaning'),
(4, 16, 45.00, 'PC', 20, 'Carton boxes for packaging samples'),
(4, 18, 85.00, 'ROLL', 5, 'Packaging tape for sample sealing');

-- Sample Inward Internal Records
INSERT INTO inward_internals (receipt_no, received_date, received_by, department, item_id, quantity, unit_rate, remark, user_id) VALUES
('REC-001', '2025-02-01', 'Production Supervisor', 'Production Floor', 19, 2.00, 125000.00, 'Completed rice huller machines', 'admin'),
('REC-002', '2025-02-02', 'Assembly Head', 'Assembly Unit', 20, 3.00, 85000.00, 'Finished paddy separators', 'admin'),
('REC-003', '2025-02-03', 'Floor Manager', 'Production Floor', 21, 4.00, 65000.00, 'Completed rice polishers', 'admin'),
('REC-004', '2025-02-05', 'QC Head', 'Quality Control', 19, 1.00, 125000.00, 'Quality tested rice huller', 'admin');

-- Sample Inward Internal Finished Goods
INSERT INTO inward_internal_finished_goods (inward_internal_id, item_id, quantity, uom, unit_rate, remark) VALUES
(1, 19, 2.00, 'PC', 125000.00, 'Rice huller machines ready for dispatch'),
(2, 20, 3.00, 'PC', 85000.00, 'Paddy separators completed testing'),
(3, 21, 4.00, 'PC', 65000.00, 'Rice polishers ready for quality check'),
(4, 19, 1.00, 'PC', 125000.00, 'Rice huller passed quality inspection');

-- Sample Inward Internal Materials Used
INSERT INTO inward_internal_materials_used (inward_internal_id, item_id, quantity, uom, unit_rate, remark) VALUES
-- Materials used for REC-001
(1, 1, 2.00, 'PC', 12500.00, 'Motors used in rice huller production'),
(1, 13, 100.00, 'PC', 12.50, 'Bolts used for assembly'),
(1, 14, 100.00, 'PC', 4.50, 'Nuts used for assembly'),
-- Materials used for REC-002
(2, 4, 1.00, 'PC', 25000.00, 'Hydraulic pump for paddy separator'),
(2, 6, 10.00, 'MTR', 125.00, 'Hydraulic hoses'),
(2, 15, 50.00, 'PC', 1.25, 'Washers for hydraulic connections'),
-- Materials used for REC-003  
(3, 7, 5.00, 'PC', 850.00, 'End mills for precision machining'),
(3, 9, 8.00, 'PC', 650.00, 'Lathe tools for finishing'),
(3, 12, 2.00, 'KG', 450.00, 'Grease for bearing lubrication'),
-- Materials used for REC-004
(4, 11, 2.00, 'PC', 285.00, 'Rust remover for cleaning'),
(4, 10, 1.00, 'LTR', 2500.00, 'Cutting oil for final adjustments');

-- Sample Outward Challans
INSERT INTO outward_challans (party_id, challan_no, challan_date, transport, lr_no, remark, user_id) VALUES
(5, 'OUT-001', '2025-02-10', 'VRL Logistics', 'VRL123456', 'Rice processing equipment dispatch', 'admin'),
(6, 'OUT-002', '2025-02-12', 'TCI Express', 'TCI789012', 'Grain processing machinery', 'admin'),
(7, 'OUT-003', '2025-02-15', 'Blue Dart', 'BD345678', 'Modern mill equipment delivery', 'admin'),
(8, 'OUT-004', '2025-02-18', 'DTDC', 'DT901234', 'Mixed equipment and spare parts', 'admin');

-- Sample Outward Challan Items
INSERT INTO outward_challan_items (outward_challan_id, item_id, value_of_goods_uom, quantity, remark) VALUES
-- OUT-001 items
(1, 19, 'PC', 1.00, 'Rice huller machine - Model RH-500'),
(1, 20, 'PC', 1.00, 'Paddy separator - Model PS-300'),
(1, 16, 'PC', 10.00, 'Packaging boxes for spare parts'),
-- OUT-002 items
(2, 21, 'PC', 2.00, 'Rice polisher machines - Model RP-200'),
(2, 17, 'MTR', 20.00, 'Bubble wrap for protection'),
(2, 18, 'ROLL', 5.00, 'Packaging tape'),
-- OUT-003 items  
(3, 19, 'PC', 1.00, 'Rice huller for modern mill'),
(3, 1, 'PC', 2.00, 'Spare motors 5HP'),
(3, 2, 'PC', 5.00, 'Spare contactors'),
-- OUT-004 items
(4, 20, 'PC', 1.00, 'Paddy separator'),
(4, 7, 'PC', 10.00, 'End mills for maintenance'),
(4, 10, 'LTR', 10.00, 'Cutting oil'),
(4, 12, 'KG', 5.00, 'High temperature grease');

-- Update stock levels based on transactions (this would normally be done via triggers)
UPDATE items SET stock = stock + 5 WHERE id = 1; -- Motors received via GRN-001
UPDATE items SET stock = stock + 10 WHERE id = 2; -- Contactors received
UPDATE items SET stock = stock + 100 WHERE id = 3; -- Cable received
UPDATE items SET stock = stock + 2 WHERE id = 4; -- Hydraulic pumps received
UPDATE items SET stock = stock + 3 WHERE id = 5; -- Hydraulic cylinders received
UPDATE items SET stock = stock + 50 WHERE id = 6; -- Hydraulic hoses received

-- Reduce stock for issued items
UPDATE items SET stock = stock - 2 WHERE id = 1; -- Motors issued to production
UPDATE items SET stock = stock - 100 WHERE id = 13; -- Bolts issued
UPDATE items SET stock = stock - 100 WHERE id = 14; -- Nuts issued
UPDATE items SET stock = stock - 1 WHERE id = 4; -- Hydraulic pump issued
UPDATE items SET stock = stock - 10 WHERE id = 6; -- Hydraulic hoses issued

-- Add finished goods to stock
UPDATE items SET stock = stock + 2 WHERE id = 19; -- Rice hullers produced
UPDATE items SET stock = stock + 3 WHERE id = 20; -- Paddy separators produced  
UPDATE items SET stock = stock + 4 WHERE id = 21; -- Rice polishers produced

-- Reduce finished goods stock for outward deliveries
UPDATE items SET stock = stock - 1 WHERE id = 19; -- Rice huller dispatched via OUT-001
UPDATE items SET stock = stock - 1 WHERE id = 20; -- Paddy separator dispatched via OUT-001
UPDATE items SET stock = stock - 2 WHERE id = 21; -- Rice polishers dispatched via OUT-002
UPDATE items SET stock = stock - 1 WHERE id = 19; -- Another rice huller dispatched via OUT-003
UPDATE items SET stock = stock - 1 WHERE id = 20; -- Another paddy separator dispatched via OUT-004