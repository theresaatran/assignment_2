class Medicine {
    constructor(name, id, manufacturer, expirationDate, quantity) {
        this.name = name;
        this.id = id;
        this.manufacturer = manufacturer;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
    }
}

class PharmacyInventory {
    constructor() {
        this.medicines = JSON.parse(localStorage.getItem('medicines')) || [];
    }

    addMedicine(medicine) {
        this.medicines.push(medicine);
        this.saveData();
    }

    deleteMedicine(id) {
        this.medicines = this.medicines.filter(med => med.id !== id);
        this.saveData();
    }

    saveData() {
        localStorage.setItem('medicines', JSON.stringify(this.medicines));
    }
}

class UI {
    static displayMedicines() {
        const medicines = new PharmacyInventory().medicines;

        medicines.forEach(medicine => UI.addMedicineToList(medicine));
    }

    static addMedicineToList(medicine) {
        const list = document.querySelector('#medicine-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${medicine.name}</td>
            <td>${medicine.id}</td>
            <td>${medicine.manufacturer}</td>
            <td>${medicine.expirationDate}</td>
            <td>${medicine.quantity}</td>
            <td><button class="btn-delete" data-id="${medicine.id}">Delete</button></td>
        `;

        list.appendChild(row);
    }

    static deleteMedicine(target) {
        if (target.classList.contains('btn-delete')) {
            const id = target.dataset.id;
            target.closest('tr').remove();
            new PharmacyInventory().deleteMedicine(id);
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        container.insertBefore(div, document.querySelector('#medicine-form'));

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#medicine-form').reset();
    }
}

document.addEventListener('DOMContentLoaded', UI.displayMedicines);

document.querySelector('#medicine-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#product-name').value;
    const id = document.querySelector('#product-id').value;
    const manufacturer = document.querySelector('#manufacturer').value;
    const expirationDate = document.querySelector('#expiration-date').value;
    const quantity = document.querySelector('#quantity').value;

    if (!name || !id || !manufacturer || !expirationDate || !quantity) {
        UI.showAlert('Please fill in all fields', 'error');
        return;
    }

    const medicines = new PharmacyInventory().medicines;

    if (medicines.find(medicine => medicine.id === id)) {
        UI.showAlert('Product ID already exists', 'error');
        return;
    }

    const medicine = new Medicine(name, id, manufacturer, expirationDate, quantity);

    UI.addMedicineToList(medicine);
    new PharmacyInventory().addMedicine(medicine);
    UI.showAlert('Medicine added', 'success');
    UI.clearFields();
});

document.querySelector('#medicine-list').addEventListener('click', (e) => {
    UI.deleteMedicine(e.target);
});
