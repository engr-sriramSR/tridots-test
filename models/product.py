from db import db

class ProductModel(db.Model):
    __tablename__ = "product"

    product_id = db.Column(db.String, primary_key=True)
    product_name= db.Column(db.String, nullable=False)

    locations = db.relationship("LocationModel", backref="product")
    productmovements = db.relationship("ProductMovementModel", backref="product")