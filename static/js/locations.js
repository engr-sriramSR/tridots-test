const locationsDiv = document.getElementById('locations');
const locationsTable = document.getElementById('locations-table');
const locationsTableBody = document.getElementById('locations-table-body');

const editToggle = (element) =>{
    if(element.classList.contains('edit-on')){
        element.classList.remove('edit-on');
        element.classList.add('edit-off');
    }else{
        element.classList.remove('edit-off');
        element.classList.add('edit-on');
    };
};

const cancel = (id) =>{
    const clickedCancel = document.getElementById(id);
    const clickedRow = clickedCancel.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    clickedRow.classList.remove('edit');
    const clickedSave = document.getElementById('save-'+clickedRowId);
    const clickedEdit = document.getElementById('edit-'+clickedRowId);
    if(id === 'cancel-new'){
        locationsTable.removeChild(clickedRow);
    }else{
        editToggle(clickedEdit);
        editToggle(clickedSave);
        editToggle(clickedCancel);
    };
};

const addLocations = () =>{
    let newRow = document.createElement('tr');
    newRow.setAttribute('id', 'new');
    newRow.classList.add('edit');
    newRow.innerHTML = `<td id="new-id"></td>
                        <td><input id="new-name" type="text"/></td>
                        <td><input id="new-product-id" type="text"/></td>
                        <td><input id="new-available-quantity" type="text"/></td>
                        <td>
                        <button id="edit-new" class="edit-off" onclick="editLocation(this.id)"><i class="fa-solid fa-pencil"></i></button>
                        <button id="save-new" class="edit-on" onclick="saveLocation(this.id)"><i class="fa-solid fa-floppy-disk"></i></button>
                        <button id="cancel-new" class="edit-on" onclick="cancel(this.id)"><i class="fa-solid fa-xmark"></i></button>
                        </td>`;
    locationsTable.appendChild(newRow);
};

const saveLocation = async(id) =>{
    const clickedSave = document.getElementById(id);
    const clickedRow = clickedSave.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    const clickedEdit = document.getElementById('edit-'+clickedRowId);
    const clickedCancel = document.getElementById('cancel-'+clickedRowId);
    const clickedLocationName = document.getElementById(clickedRowId+'-name');
    const clickedProductId = document.getElementById(clickedRowId+'-product-id');
    const clickedAvailableQuantity = document.getElementById(clickedRowId+'-available-quantity');
    if(id === "save-new"){
        if(!clickedLocationName.value || !clickedProductId.value ||!clickedAvailableQuantity.value){
            let message = document.createElement('h3');
            message.textContent = `Please enter values in all fields.`
            locationsDiv.appendChild(message);
            setTimeout(() =>{locationsDiv.removeChild(message)}, 3000);
            return null;
        };
        const data = {
            location_name: clickedLocationName.value,
            product_id: clickedProductId.value,
            available_quantity: clickedAvailableQuantity.value
        };
        const saveResponse = await fetch('http://127.0.0.1:5000/locations', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(saveResponse.status === 200){
            const responseData = await saveResponse.json();
            locationsTable.removeChild(clickedRow);
            let newRow = document.createElement('tr');
            newRow.setAttribute('id', `${responseData.location_id}`);
            newRow.classList.remove('edit');
            newRow.innerHTML = `<td id="${responseData.location_id}-id">${responseData.location_id}</td>
                                <td><input id="${responseData.location_id}-name" type="text" value="${responseData.location_name}"/></td>
                                <td id="${responseData.location_id}-product-id">${responseData.product_id}</td>
                                <td><input id="${responseData.location_id}-available-quantity" type="text" value="${responseData.available_quantity}"/></td>
                                <td>
                                    <button id="edit-${responseData.location_id}" class="edit-on" onclick="editLocation(this.id)"><i class="fa-solid fa-pencil"></i></button>
                                    <button id="save-${responseData.location_id}" class="edit-off" onclick="saveLocation(this.id)"><i class="fa-solid fa-floppy-disk"></i></button>
                                    <button id="cancel-${responseData.location_id}" class="edit-off" onclick="cancel(this.id)"><i class="fa-solid fa-xmark"></i></button>
                                </td>`;
            locationsTableBody.appendChild(newRow);
        }else if(saveResponse.status === 404){
            const responseData = await saveResponse.json();
            if(responseData.message === "Product not found"){
                let message = document.createElement('h3');
                message.textContent = `Please Enter a available product id`
                locationsDiv.appendChild(message);
                setTimeout(() =>{locationsDiv.removeChild(message)}, 3000);
            };
        };
    }else{
        const data = {
            location_id: clickedRowId,
            location_name: clickedLocationName.value,
            product_id: clickedProductId.value,
            available_quantity: clickedAvailableQuantity.value
        };
        const saveResponse = await fetch('http://127.0.0.1:5000/locations', {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(saveResponse.status === 200){
            const responseData = await saveResponse.json();
            clickedLocationName.value = responseData.location_name;
            clickedRow.classList.remove('edit');
            editToggle(clickedEdit);
            editToggle(clickedSave);
            editToggle(clickedCancel);
        };
    };
};

const editLocation = (id) =>{
    const clickedEdit = document.getElementById(id);
    const clickedRow = clickedEdit.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    const clickedSave = document.getElementById('save-'+clickedRowId);
    const clickedCancel = document.getElementById('cancel-'+clickedRowId);
    const clickedLocationName = document.getElementById(clickedRowId+'-name');
    clickedRow.classList.add('edit');
    editToggle(clickedEdit);
    editToggle(clickedSave);
    editToggle(clickedCancel);
};