from flask import Flask, render_template, redirect, url_for, request, flash
from models import db, Category, Item, StockLedger
from forms import CategoryForm, ItemForm, StockInwardForm, StockOutwardForm
from datetime import date
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///stock.db')
app.config['SECRET_KEY'] = 'your_secret_key'
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def dashboard():
    items = Item.query.all()
    dashboard_data = []
    for item in items:
        in_qty = sum(l.quantity for l in item.ledger if l.type == 'INWARD')
        out_qty = sum(l.quantity for l in item.ledger if l.type == 'OUTWARD')
        closing = in_qty - out_qty
        dashboard_data.append({
            'item': item,
            'in_qty': in_qty,
            'out_qty': out_qty,
            'closing': closing
        })
    return render_template('dashboard.html', dashboard_data=dashboard_data)

@app.route('/categories', methods=['GET', 'POST'])
def categories():
    form = CategoryForm()
    if form.validate_on_submit():
        db.session.add(Category(name=form.name.data))
        db.session.commit()
        flash('Category added!')
        return redirect(url_for('categories'))
    categories = Category.query.all()
    return render_template('category_master.html', form=form, categories=categories)

@app.route('/items', methods=['GET', 'POST'])
def items():
    form = ItemForm()
    form.category_id.choices = [(c.id, c.name) for c in Category.query.all()]
    if form.validate_on_submit():
        item = Item(
            name=form.name.data,
            size=form.size.data,
            description=form.description.data,
            category_id=form.category_id.data,
            unit=form.unit.data,
            min_level=form.min_level.data,
            rack_no=form.rack_no.data
        )
        db.session.add(item)
        db.session.commit()
        flash('Item added!')
        return redirect(url_for('items'))
    items = Item.query.all()
    return render_template('item_master.html', form=form, items=items)

@app.route('/stock-inward', methods=['GET', 'POST'])
def stock_inward():
    form = StockInwardForm()
    form.item_id.choices = [(i.id, i.name) for i in Item.query.all()]
    if form.validate_on_submit():
        ledger = StockLedger(
            item_id=form.item_id.data,
            date=form.date.data,
            type='INWARD',
            quantity=form.quantity.data,
            remarks=form.remarks.data
        )
        db.session.add(ledger)
        db.session.commit()
        flash('Stock Inward entry added!')
        return redirect(url_for('stock_inward'))
    entries = StockLedger.query.filter_by(type='INWARD').all()
    return render_template('stock_inward.html', form=form, entries=entries)

@app.route('/stock-outward', methods=['GET', 'POST'])
def stock_outward():
    form = StockOutwardForm()
    form.item_id.choices = [(i.id, i.name) for i in Item.query.all()]
    if form.validate_on_submit():
        ledger = StockLedger(
            item_id=form.item_id.data,
            date=form.date.data,
            type='OUTWARD',
            quantity=form.quantity.data,
            remarks=form.remarks.data
        )
        db.session.add(ledger)
        db.session.commit()
        flash('Stock Outward entry added!')
        return redirect(url_for('stock_outward'))
    entries = StockLedger.query.filter_by(type='OUTWARD').all()
    return render_template('stock_outward.html', form=form, entries=entries)

@app.route('/report')
def report():
    items = Item.query.all()
    report_data = []
    for item in items:
        in_qty = sum(l.quantity for l in item.ledger if l.type == 'INWARD')
        out_qty = sum(l.quantity for l in item.ledger if l.type == 'OUTWARD')
        closing = in_qty - out_qty
        report_data.append({
            'item': item,
            'in_qty': in_qty,
            'out_qty': out_qty,
            'closing': closing
        })
    return render_template('reports.html', report_data=report_data)

if __name__ == '__main__':
    app.run(debug=True) 