let queries = [];

document.addEventListener('DOMContentLoaded', function () {
    // Initialize a sample database and tables as shown in the example
    let db = new Database({ name: "test", dropDatabase: true, useDatabase: true });

    // Creating sample tables and columns
    let table1 = new Table("abo");
    table1.addColumn(new Column({ name: "ID", type: "INTEGER", autoIncrement: true, primaryKey: true }));
    table1.addColumn(new Column({ name: "name", type: "VARCHAR", length: 20 }));
    table1.addColumn(new Column({ name: "price", type: "INTEGER" }));

    let table2 = new Table("user_vehicle");
    table2.addColumn(new Column({ name: "userID", type: "INTEGER" }));
    table2.addColumn(new Column({ name: "vehicle", type: "VARCHAR", length: 50 }));

    let table3 = new Table("user");
    table3.addColumn(new Column({ name: "ID", type: "INTEGER", autoIncrement: true, primaryKey: true }));
    table3.addColumn(new Column({ name: "name", type: "VARCHAR", length: 20 }));

    // Adding foreign keys
    table2.addForeignKey(new ForeignKey("userID", "abo", "ID"));
    table2.addForeignKey(new ForeignKey("userID", "user", "ID"));

    db.addTable(table1);
    db.addTable(table2);
    db.addTable(table3);

    // Add the created database to queries list
    queries.push(db);

    loadQueries(queries);
});

function loadQueries(queries) {
    const queriesDropdown = document.getElementById("queries");
    queriesDropdown.innerHTML = "";

    // Populate the queries dropdown dynamically
    queries.forEach((query, index) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.innerText = query.getName();
        button.onclick = () => loadQuery(index);
        li.appendChild(button);
        queriesDropdown.appendChild(li);
    });
}

function loadQuery(index) {
    const main = document.querySelector('main');
    main.innerHTML = '';

    const selectedQuery = queries[index];

    const h1 = document.createElement('h1');
    h1.innerText = selectedQuery.getName();
    main.appendChild(h1);

    // Create form for new table
    const newTableForm = createNewTableForm();
    main.appendChild(newTableForm);

    // Attach event listeners after adding the buttons
    document.getElementById('addColumnButton').addEventListener('click', () => addColumn(index));
    document.getElementById('createTableButton').addEventListener('click', () => createTable(index));

    selectedQuery.getTables().forEach((table, tableIndex) => {
        const tableForm = createTableForm(table, tableIndex, index);
        main.appendChild(tableForm);
    });
}

function createNewTableForm() {
    const form = document.createElement('form');
    form.id = 'newTable';

    const h2 = document.createElement('h2');
    h2.innerText = 'New Table';
    form.appendChild(h2);

    const table = document.createElement('table');
    form.appendChild(table);

    // Add table headers
    const headerRow = document.createElement('tr');
    const headers = ['Column Name', 'Type', 'Length', 'Default', 'Collation', 'Attribute', 'Null', 'Auto Increment', 'Primary Key', 'Comment'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add input row for columns
    const inputRow = document.createElement('tr');
    inputRow.classList.add('column');
    const inputFields = [
        { type: 'text', name: 'name' },
        { type: 'select', name: 'type', options: ['int', 'varchar'] },
        { type: 'text', name: 'length' },
        { type: 'text', name: 'default' },
        { type: 'text', name: 'collation' },
        { type: 'text', name: 'attribute' },
        { type: 'checkbox', name: 'null' },
        { type: 'checkbox', name: 'autoIncrement' },
        { type: 'checkbox', name: 'primaryKey' },
        { type: 'text', name: 'comment' }
    ];

    inputFields.forEach(field => {
        const td = document.createElement('td');
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            field.options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.innerText = optionText.toUpperCase();
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
        }
        td.appendChild(input);
        inputRow.appendChild(td);
    });
    table.appendChild(inputRow);

    // Add buttons
    const addColumnButton = document.createElement('button');
    addColumnButton.id = 'addColumnButton';
    addColumnButton.type = 'button';
    addColumnButton.innerText = 'Add Column';
    form.appendChild(addColumnButton);

    const createTableButton = document.createElement('button');
    createTableButton.id = 'createTableButton';
    createTableButton.type = 'button';
    createTableButton.innerText = 'Create Table';
    form.appendChild(createTableButton);

    return form;
}

function createTableForm(table, tableIndex, queryIndex) {
    const form = document.createElement('form');
    form.id = `table${tableIndex}`;

    const h2 = document.createElement('h2');
    h2.innerText = table.getName();
    form.appendChild(h2);

    const tableElement = document.createElement('table');
    form.appendChild(tableElement);

    // Add table headers
    const headerRow = document.createElement('tr');
    const headers = ['Column Name', 'Type', 'Length', 'Default', 'Collation', 'Attribute', 'Null', 'Auto Increment', 'Primary Key', 'Comment'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    tableElement.appendChild(headerRow);

    // Add column inputs for each existing column in the table
    table.getColumns().forEach((column, colIndex) => {
        const row = document.createElement('tr');
        row.classList.add('column');

        const fields = [
            { value: column.getName(), type: 'text', name: 'name' },
            { value: column.getType(), type: 'select', name: 'type', options: ['int', 'varchar'] },
            { value: column.getLength() || '', type: 'text', name: 'length' },
            { value: column.getDefault() || '', type: 'text', name: 'default' },
            { value: column.getCollation() || '', type: 'text', name: 'collation' },
            { value: column.getAttribute() || '', type: 'text', name: 'attribute' },
            { value: column.getNull(), type: 'checkbox', name: 'null' },
            { value: column.getAutoIncrement(), type: 'checkbox', name: 'autoIncrement' },
            { value: column.getPrimaryKey(), type: 'checkbox', name: 'primaryKey' },
            { value: column.getComment() || '', type: 'text', name: 'comment' }
        ];

        fields.forEach(field => {
            const td = document.createElement('td');
            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.name = field.name;
                field.options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.innerText = optionText.toUpperCase();
                    if (optionText === field.value.toLowerCase()) {
                        option.selected = true;
                    }
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.name = field.name;
                input.value = field.value;
                if (field.type === 'checkbox') {
                    input.checked = field.value;
                }
            }
            td.appendChild(input);
            row.appendChild(td);
        });

        tableElement.appendChild(row);
    });

    // Save Table Button
    const saveTableButton = document.createElement('button');
    saveTableButton.type = 'button';
    saveTableButton.classList.add('saveTableButton');
    saveTableButton.innerText = 'Save';
    saveTableButton.addEventListener('click', () => saveTable(tableIndex, queryIndex, form));
    form.appendChild(saveTableButton);

    // Foreign Key Section
    const foreignKeysSection = document.createElement('h2');
    foreignKeysSection.innerText = 'Foreign Keys';
    form.appendChild(foreignKeysSection);

    const foreignKeysTable = document.createElement('table');
    form.appendChild(foreignKeysTable);

    const fkHeaderRow = document.createElement('tr');
    ['Column', 'Referenced Table', 'Referenced Column', 'Actions'].forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        fkHeaderRow.appendChild(th);
    });
    foreignKeysTable.appendChild(fkHeaderRow);

    table.foreignKeys.forEach((fk, fkIndex) => {
        const fkRow = document.createElement('tr');

        const columnInput = createInput('text', fk.column);
        columnInput.addEventListener('change', (event) => updateForeignKey(tableIndex, fkIndex, 'column', event.target.value, queryIndex));
        fkRow.appendChild(createCell(columnInput));

        const referencedTableInput = createInput('text', fk.referencedTable);
        referencedTableInput.addEventListener('change', (event) => updateForeignKey(tableIndex, fkIndex, 'referencedTable', event.target.value, queryIndex));
        fkRow.appendChild(createCell(referencedTableInput));

        const referencedColumnInput = createInput('text', fk.referencedColumn);
        referencedColumnInput.addEventListener('change', (event) => updateForeignKey(tableIndex, fkIndex, 'referencedColumn', event.target.value, queryIndex));
        fkRow.appendChild(createCell(referencedColumnInput));

        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.innerText = 'Remove';
        removeButton.classList.add('removeForeignKeyButton');
        removeButton.addEventListener('click', () => removeForeignKey(tableIndex, fkIndex, queryIndex));
        actionCell.appendChild(removeButton);
        fkRow.appendChild(actionCell);

        foreignKeysTable.appendChild(fkRow);
    });

    const addForeignKeyButton = document.createElement('button');
    addForeignKeyButton.type = 'button';
    addForeignKeyButton.classList.add('addForeignKeyButton');
    addForeignKeyButton.innerText = 'Add Foreign Key';
    addForeignKeyButton.addEventListener('click', () => addForeignKey(tableIndex, queryIndex));
    form.appendChild(addForeignKeyButton);

    return form;
}

// Utility function to create input elements
function createInput(type, value = '') {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    if (type === 'checkbox') {
        input.checked = value;
    }
    return input;
}

// Utility function to create a table cell
function createCell(content) {
    const td = document.createElement('td');
    td.appendChild(content);
    return td;
}

// Function to add a new column to the form
function addColumn(queryIndex) {
    const table = document.querySelector('#newTable table');
    const newRow = document.createElement('tr');
    newRow.classList.add('column');

    const inputFields = [
        { type: 'text', name: 'name' },
        { type: 'select', name: 'type', options: ['int', 'varchar'] },
        { type: 'text', name: 'length' },
        { type: 'text', name: 'default' },
        { type: 'text', name: 'collation' },
        { type: 'text', name: 'attribute' },
        { type: 'checkbox', name: 'null' },
        { type: 'checkbox', name: 'autoIncrement' },
        { type: 'checkbox', name: 'primaryKey' },
        { type: 'text', name: 'comment' }
    ];

    inputFields.forEach(field => {
        const td = document.createElement('td');
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            field.options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.innerText = optionText.toUpperCase();
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
        }
        td.appendChild(input);
        newRow.appendChild(td);
    });
    table.appendChild(newRow);

    // Reload the query to reflect changes
    loadQuery(queryIndex);
}

// Function to create a new table based on the form input
function createTable(queryIndex) {
    const form = document.getElementById('newTable');
    const inputs = form.querySelectorAll('.column');
    const tableName = prompt("Enter the name of the new table:");

    if (!tableName) {
        alert("Table name is required!");
        return;
    }

    const newTable = new Table(tableName);

    inputs.forEach(inputRow => {
        const name = inputRow.querySelector('[name="name"]').value;
        const type = inputRow.querySelector('[name="type"]').value;
        const length = inputRow.querySelector('[name="length"]').value;
        const defaultValue = inputRow.querySelector('[name="default"]').value || null;
        const collation = inputRow.querySelector('[name="collation"]').value || null;
        const attribute = inputRow.querySelector('[name="attribute"]').value || null;
        const nullValue = inputRow.querySelector('[name="null"]').checked;
        const autoIncrement = inputRow.querySelector('[name="autoIncrement"]').checked;
        const primaryKey = inputRow.querySelector('[name="primaryKey"]').checked;
        const comment = inputRow.querySelector('[name="comment"]').value || null;

        const column = new Column({
            name,
            type,
            length: length ? parseInt(length) : null,
            defaultValue,
            collation,
            attribute,
            nullValue,
            autoIncrement,
            primaryKey,
            comment
        });

        newTable.addColumn(column);
    });

    queries[queryIndex].addTable(newTable);
    alert(`Table "${tableName}" created successfully!`);

    // Reload the query to reflect changes
    loadQuery(queryIndex);
}

// Function to save changes to an existing table
function saveTable(tableIndex, queryIndex, form) {
    const table = queries[queryIndex].getTables()[tableIndex];
    const rows = form.querySelectorAll('.column');

    rows.forEach((row, colIndex) => {
        const column = table.getColumns()[colIndex];
        column.setName(row.querySelector('[name="name"]').value);
        column.setType(row.querySelector('[name="type"]').value);
        column.setLength(row.querySelector('[name="length"]').value || null);
        column.setDefault(row.querySelector('[name="default"]').value || null);
        column.setCollation(row.querySelector('[name="collation"]').value || null);
        column.setAttribute(row.querySelector('[name="attribute"]').value || null);
        column.setNull(row.querySelector('[name="null"]').checked);
        column.setAutoIncrement(row.querySelector('[name="autoIncrement"]').checked);
        column.setPrimaryKey(row.querySelector('[name="primaryKey"]').checked);
        column.setComment(row.querySelector('[name="comment"]').value || null);
    });

    alert(`Table "${table.getName()}" saved successfully!`);

    // Reload the query to reflect changes
    loadQuery(queryIndex);
}

// Function to add a new foreign key to the specified table
function addForeignKey(tableIndex, queryIndex) {
    const table = queries[queryIndex].getTables()[tableIndex];
    const newForeignKey = new ForeignKey('', '', ''); // Create a new foreign key with empty fields
    table.addForeignKey(newForeignKey);

    // Reload the query to reflect changes
    loadQuery(queryIndex);
}

// Function to remove a foreign key from the specified table
function removeForeignKey(tableIndex, fkIndex, queryIndex) {
    const table = queries[queryIndex].getTables()[tableIndex];
    table.foreignKeys.splice(fkIndex, 1);

    // Reload the query to reflect changes
    loadQuery(queryIndex);
}

// Function to update a foreign key's properties when inputs are changed
function updateForeignKey(tableIndex, fkIndex, property, value, queryIndex) {
    const table = queries[queryIndex].getTables()[tableIndex];
    const foreignKey = table.foreignKeys[fkIndex];
    if (property === 'column') {
        foreignKey.column = value;
    } else if (property === 'referencedTable') {
        foreignKey.referencedTable = value;
    } else if (property === 'referencedColumn') {
        foreignKey.referencedColumn = value;
    }

    // Reload the query to reflect changes
    loadQuery(queryIndex);
}
