from db import db

class LocationModel(db.Model):
    __tablename__ = "location"

    location_id = db.Column(db.String, primary_key=True)
    location_name= db.Column(db.String, nullable=False)
    product_id= db.Column(db.String, db.ForeignKey("product.product_id"), unique=False, nullable=False)
    available_quantity= db.Column(db.Integer, nullable=False)

    productmovement = db.relationship("ProductMovementModel", backref="location")