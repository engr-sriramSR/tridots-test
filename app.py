from flask import Flask, render_template, request
from dotenv import load_dotenv
from models import ProductModel, LocationModel, ProductMovementModel
from db import db
import datetime


app = Flask(__name__)
load_dotenv()
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db.init_app(app)
with app.app_context():
    db.create_all()

def primary_key_gen(model, string):
    length = len(model.query.all())
    return string + str(length)

@app.route("/home", methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        pass
    else:
        warehouse_details = []
        records = LocationModel.query.all()
        for record in records:
            product = ProductModel.query.get(record.product_id)
            new_dict = {
                "product_name": product.product_name,
                "warehouse": record.location_name,
                "quantity": record.available_quantity
            }
            warehouse_details.append(new_dict)
        return render_template('productwarehouse.html', warehouse_details=warehouse_details)

@app.route("/products", methods=['GET', 'POST', 'PUT'])
def products():
    if request.method == 'POST':
        data = request.get_json()
        product_id = primary_key_gen(ProductModel, "prodid")
        newProduct = ProductModel(
            product_id = product_id,
            product_name = data["product_name"]
        )
        db.session.add(newProduct)
        db.session.commit()
        added_product = ProductModel.query.get_or_404(product_id)
        return {"product_id": added_product.product_id, "product_name": added_product.product_name}
    elif request.method == 'PUT':
        data = request.get_json()
        product = ProductModel.query.get_or_404(data["product_id"])
        product.product_name = data["product_name"]
        db.session.add(product)
        db.session.commit()
        return {"product_id": product.product_id, "product_name": product.product_name}
    else:
        products_details = ProductModel.query.all()
        return render_template('products.html', products_details = products_details)

@app.route("/locations", methods=['GET', 'POST', 'PUT'])
def locations():
    if request.method == 'POST':
        data = request.get_json()
        product = ProductModel.query.get(data["product_id"])
        if product is None:
            return {"message": "Product not found"}, 404
        location_id = primary_key_gen(LocationModel, "locid")
        newLocation = LocationModel(
            location_id = location_id,
            location_name = data["location_name"],
            product_id = data["product_id"],
            available_quantity = data["available_quantity"]
        )
        db.session.add(newLocation)
        db.session.commit()
        added_location = LocationModel.query.get_or_404(location_id)
        return {"location_id": added_location.location_id, "location_name": added_location.location_name, "product_id": added_location.product_id, "available_quantity": added_location.available_quantity}
    elif request.method == 'PUT':
        data = request.get_json()
        location = LocationModel.query.get_or_404(data["location_id"])
        location.location_name = data["location_name"]
        location.available_quantity = data["available_quantity"]
        db.session.add(location)
        db.session.commit()
        return {"location_id": location.location_id, "location_name": location.location_name, "product_id": location.product_id, "available_quantity": location.available_quantity}
    else:
        locations_details = LocationModel.query.all()
        return render_template('locations.html', locations_details = locations_details)

@app.route("/movements", methods=['GET', 'POST'])
def movements():
    if request.method == 'POST':
        data = request.get_json()
        product = ProductModel.query.get(data["product_id"])
        from_location = LocationModel.query.get(data["from_location"])
        to_location = LocationModel.query.get(data["to_location"])
        if from_location is None:
            return {"message": "From location not found"}, 404
        if to_location is None:
            return {"message": "To location not found"}, 404
        if product is None:
            return {"message": "Product not found"}, 404
        if from_location.product_id != data["product_id"]:
            return {"error": "Product Unavailable","message": "Prouct unavailable at this location"}, 400
        if int(from_location.available_quantity) < int(data["moved_quantity"]):
            return {"error": "Insufficient quantity at from location","message": f"We have only {from_location.available_quantity} at {data['from_location']}"}, 400
        movement_id = primary_key_gen(ProductMovementModel, "moveid")
        newMovement = ProductMovementModel(
            movement_id = movement_id,
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            from_location = data["from_location"],
            to_location = data["to_location"],
            product_id = data["product_id"],
            moved_quantity = data["moved_quantity"]
        )
        db.session.add(newMovement)
        from_location.available_quantity -= int(data["moved_quantity"])
        to_location.available_quantity += int((data['moved_quantity']))
        db.session.add(to_location)
        db.session.add(from_location)
        db.session.commit()
        added_movement = ProductMovementModel.query.get_or_404(movement_id)
        return {"movement_id": added_movement.movement_id, "timestamp": added_movement.timestamp, "from_location": added_movement.from_location, "to_location": added_movement.to_location, "product_id": added_movement.product_id, "moved_quantity": added_movement.moved_quantity}
    else:
        movements_details = ProductMovementModel.query.all()
        return render_template('movements.html', movements_details = movements_details)