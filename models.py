from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    size = db.Column(db.String(50))
    description = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    unit = db.Column(db.String(20))
    min_level = db.Column(db.Float)
    rack_no = db.Column(db.String(20))
    category = db.relationship('Category', backref=db.backref('items', lazy=True))

class StockLedger(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(20))  # INWARD, OUTWARD, RECEIVING, CHALLAN
    quantity = db.Column(db.Float, nullable=False)
    remarks = db.Column(db.String(200))
    item = db.relationship('Item', backref=db.backref('ledger', lazy=True)) 