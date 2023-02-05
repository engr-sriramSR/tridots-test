from db import db

class ProductMovementModel(db.Model):
    __tablename__ = "productmovement"

    movement_id = db.Column(db.String, primary_key=True)
    timestamp= db.Column(db.String, nullable=False)
    from_location = db.Column(db.String, db.ForeignKey("location.location_id"), unique=False, nullable=False)
    to_location = db.Column(db.String, unique=False, nullable=False)
    product_id = db.Column(db.String, db.ForeignKey("product.product_id"), unique=False, nullable=False)
    moved_quantity = db.Column(db.Integer, nullable=False)