const movementsDiv = document.getElementById('movements');
const movementsTable = document.getElementById('movements-table');
const movementsTableBody = document.getElementById('movements-table-body');


const cancel = (id) =>{
    const clickedCancel = document.getElementById(id);
    const clickedRow = clickedCancel.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    clickedRow.classList.remove('edit');
    const clickedSave = document.getElementById('save-'+clickedRowId);
    const clickedEdit = document.getElementById('edit-'+clickedRowId);
    if(id === 'cancel-new'){
        movementsTable.removeChild(clickedRow);
    };
};

const addMovements = () =>{
    let newRow = document.createElement('tr');
    newRow.setAttribute('id', 'new');
    newRow.classList.add('edit');
    newRow.innerHTML = `<td id="new-id"></td>
                        <td id="new-timestamp"></td>
                        <td><input id="new-from-location" type="text"/></td>
                        <td><input id="new-to-location" type="text"/></td>
                        <td><input id="new-product-id" type="text"/></td>
                        <td><input id="new-moved-quantity" type="text"/></td>
                        <td>
                        <button id="save-new" class="edit-on" onclick="saveMovement(this.id)"><i class="fa-solid fa-floppy-disk"></i></button>
                        <button id="cancel-new" class="edit-on" onclick="cancel(this.id)"><i class="fa-solid fa-xmark"></i></button>
                        </td>`;
    movementsTable.appendChild(newRow);
};

const saveMovement = async(id) =>{
    const clickedSave = document.getElementById(id);
    const clickedRow = clickedSave.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    const clickedEdit = document.getElementById('edit-'+clickedRowId);
    const clickedCancel = document.getElementById('cancel-'+clickedRowId);
    const clickedFromLocation = document.getElementById(clickedRowId+'-from-location');
    const clickedToLocation = document.getElementById(clickedRowId+'-to-location');
    const clickedProductId = document.getElementById(clickedRowId+'-product-id');
    const clickedMovedQuantity = document.getElementById(clickedRowId+'-moved-quantity');
    if(!clickedFromLocation.value || !clickedProductId.value ||!clickedToLocation.value || !clickedMovedQuantity.value){
        let message = document.createElement('h3');
        message.textContent = `Please enter values in all fields.`
        movementsDiv.appendChild(message);
        setTimeout(() =>{movementsDiv.removeChild(message)}, 3000);
        return null;
    };
    const data = {
        from_location: clickedFromLocation.value,
        to_location: clickedToLocation.value,
        product_id: clickedProductId.value,
        moved_quantity: clickedMovedQuantity.value
    };
    const saveResponse = await fetch('http://127.0.0.1:5000/movements', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(saveResponse.status === 200){
        const responseData = await saveResponse.json();
        movementsTable.removeChild(clickedRow);
        let newRow = document.createElement('tr');
        newRow.setAttribute('id', `${responseData.movement_id}`);
        newRow.classList.remove('edit');
        newRow.innerHTML = `<td id="${responseData.movement_id}-id">${responseData.movement_id}</td>
                            <td id="${responseData.movement_id}-timestamp">${responseData.timestamp}</td>
                            <td id="${responseData.movement_id}-from-location">${responseData.from_location}</td>
                            <td id="${responseData.movement_id}-to-location">${responseData.to_location}</td>
                            <td id="${responseData.movement_id}-product-id">${responseData.product_id}</td>
                            <td id="${responseData.movement_id}-moved-quantity">${responseData.moved_quantity}</td>
        <td>`;
        movementsTableBody.appendChild(newRow);
    }else if(saveResponse.status === 404){
        const responseData = await saveResponse.json();
        if(responseData.message === "Product not found"){
            let message = document.createElement('h3');
            message.textContent = `Please Enter a available product id`
            movementsDiv.appendChild(message);
            setTimeout(() =>{movementsDiv.removeChild(message)}, 3000);
        }else if(responseData.message === "From location not found"){
            let message = document.createElement('h3');
            message.textContent = `Please Enter a available location id for From location`
            movementsDiv.appendChild(message);
            setTimeout(() =>{movementsDiv.removeChild(message)}, 3000);
        }else if(responseData.message === "To location not found"){
            let message = document.createElement('h3');
            message.textContent = `Please Enter a available location id for To location`
            movementsDiv.appendChild(message);
            setTimeout(() =>{movementsDiv.removeChild(message)}, 3000);
        };
    }else if(saveResponse.status === 400){
        const responseData = await saveResponse.json();
        if(responseData.error === "Insufficient quantity at from location"){
            let message = document.createElement('h3');
            message.textContent = responseData.message
            movementsDiv.appendChild(message);
            setTimeout(() =>{movementsDiv.removeChild(message)}, 3000);
        }else if(responseData.error === "Product Unavailable"){
            let message = document.createElement('h3');
            message.textContent = responseData.message
            movementsDiv.appendChild(message);
            setTimeout(() =>{movementsDiv.removeChild(message)}, 3000);
        };
    };
};