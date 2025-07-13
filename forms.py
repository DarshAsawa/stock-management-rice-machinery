from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SelectField, DateField, SubmitField
from wtforms.validators import DataRequired

class CategoryForm(FlaskForm):
    name = StringField('Category Name', validators=[DataRequired()])
    submit = SubmitField('Save')

class ItemForm(FlaskForm):
    name = StringField('Item Name', validators=[DataRequired()])
    size = StringField('Size')
    description = StringField('Description')
    category_id = SelectField('Category', coerce=int, validators=[DataRequired()])
    unit = StringField('Unit')
    min_level = FloatField('Min Level')
    rack_no = StringField('Rack No')
    submit = SubmitField('Save')

class StockInwardForm(FlaskForm):
    item_id = SelectField('Item', coerce=int, validators=[DataRequired()])
    date = DateField('Date', validators=[DataRequired()])
    quantity = FloatField('Quantity', validators=[DataRequired()])
    remarks = StringField('Remarks')
    submit = SubmitField('Save')

class StockOutwardForm(FlaskForm):
    item_id = SelectField('Item', coerce=int, validators=[DataRequired()])
    date = DateField('Date', validators=[DataRequired()])
    quantity = FloatField('Quantity', validators=[DataRequired()])
    remarks = StringField('Remarks')
    submit = SubmitField('Save') 