const productsDiv = document.getElementById('products');
const productsTable = document.getElementById('products-table');
const productsTableBody = document.getElementById('products-table-body');

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
        productsTable.removeChild(clickedRow);
    }else{
        editToggle(clickedEdit);
        editToggle(clickedSave);
        editToggle(clickedCancel);
    };
};

const addProducts = () =>{
    let newRow = document.createElement('tr');
    newRow.setAttribute('id', 'new');
    newRow.classList.add('edit');
    newRow.innerHTML = `<td id="new-id"></td>
                        <td><input id="new-name" type="text"/></td>
                        <td>
                        <button id="edit-new" class="edit-off" onclick="editProduct(this.id)"><i class="fa-solid fa-pencil"></i></button>
                        <button id="save-new" class="edit-on" onclick="saveProduct(this.id)"><i class="fa-solid fa-floppy-disk"></i></button>
                        <button id="cancel-new" class="edit-on" onclick="cancel(this.id)"><i class="fa-solid fa-xmark"></i></button>
                        </td>`;
    productsTable.appendChild(newRow);
};

const saveProduct = async(id) =>{
    const clickedSave = document.getElementById(id);
    const clickedRow = clickedSave.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    const clickedEdit = document.getElementById('edit-'+clickedRowId);
    const clickedCancel = document.getElementById('cancel-'+clickedRowId);
    const clickedProductName = document.getElementById(clickedRowId+'-name');
    if(!clickedProductName.value){
        let message = document.createElement('h3');
        message.textContent = `Please enter all required fields.`
        productsDiv.appendChild(message);
        setTimeout(() =>{productsDiv.removeChild(message)}, 3000);
        return null;
    }
    if(id === "save-new"){
        const data = {
            product_name: clickedProductName.value
        };
        const saveResponse = await fetch('http://127.0.0.1:5000/products', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(saveResponse.status === 200){
            const responseData = await saveResponse.json();
            productsTable.removeChild(clickedRow);
            let newRow = document.createElement('tr');
            newRow.setAttribute('id', `${responseData.product_id}`);
            newRow.classList.remove('edit');
            newRow.innerHTML = `<td id="${responseData.product_id}-id">${responseData.product_id}</td>
                                <td><input id="${responseData.product_id}-name" type="text" value="${responseData.product_name}"/></td>
                                <td>
                                    <button id="edit-${responseData.product_id}" class="edit-on" onclick="editProduct(this.id)"><i class="fa-solid fa-pencil"></i></button>
                                    <button id="save-${responseData.product_id}" class="edit-off" onclick="saveProduct(this.id)"><i class="fa-solid fa-floppy-disk"></i></button>
                                    <button id="cancel-${responseData.product_id}" class="edit-off" onclick="cancel(this.id)"><i class="fa-solid fa-xmark"></i></button>
                                </td>`;
            productsTableBody.appendChild(newRow);
        };
    }else{
        const data = {
            product_id: clickedRowId,
            product_name: clickedProductName.value
        };
        const saveResponse = await fetch('http://127.0.0.1:5000/products', {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(saveResponse.status === 200){
            const responseData = await saveResponse.json();
            clickedProductName.value = responseData.product_name;
            clickedRow.classList.remove('edit');
            editToggle(clickedEdit);
            editToggle(clickedSave);
            editToggle(clickedCancel);
        };
    };
};

const editProduct = (id) =>{
    const clickedEdit = document.getElementById(id);
    const clickedRow = clickedEdit.parentNode.parentNode;
    const clickedRowId = clickedRow.id;
    const clickedSave = document.getElementById('save-'+clickedRowId);
    const clickedCancel = document.getElementById('cancel-'+clickedRowId);
    const clickedProductName = document.getElementById(clickedRowId+'-name');
    clickedRow.classList.add('edit');
    editToggle(clickedEdit);
    editToggle(clickedSave);
    editToggle(clickedCancel);
};