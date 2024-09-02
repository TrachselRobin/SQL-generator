let queries = [];

document.addEventListener('DOMContentLoaded', function () {
    let db = new Database({ name: "test", dropDatabase: true, useDatabase: true });

    let table1 = new Table("abo");
    let column1 = new Column({ name: "ID", type: "INTEGER", autoIncrement: true, primaryKey: true });
    let column2 = new Column({ name: "name", type: "VARCHAR", length: 20 });
    let column3 = new Column({ name: "price", type: "INTEGER" });
    table1.addColumn(column1);
    table1.addColumn(column2);
    table1.addColumn(column3);

    let table2 = new Table("user_vehicle");
    let column4 = new Column({ name: "userID", type: "INTEGER" });
    let column5 = new Column({ name: "vehicle", type: "VARCHAR", length: 50 });
    table2.addColumn(column4);
    table2.addColumn(column5);

    let table3 = new Table("user");
    let column6 = new Column({ name: "ID", type: "INTEGER", autoIncrement: true, primaryKey: true });
    let column7 = new Column({ name: "name", type: "VARCHAR", length: 20 });
    table3.addColumn(column6);
    table3.addColumn(column7);

    // Adding a foreign key to user_vehicle using ALTER TABLE syntax
    let foreignKey1 = new ForeignKey("userID", "abo", "ID");
    table2.addForeignKey(foreignKey1);

    let foreignKey2 = new ForeignKey("userID", "user", "ID");
    table2.addForeignKey(foreignKey2);

    db.addTable(table2);
    db.addTable(table1);

    queries.push(db);

    loadQueries(queries);
});

function loadQueries(queries) {
    const queriesDropdown = document.getElementById("queries");
    queriesDropdown.innerHTML = "";

    /*
    <ul id="queries" class="dropdown-menu">
        <li><button onclick="loadQuery(0)">Query 1</button></li>
        <li><button onclick="loadQuery(1)">Query 2</button></li>
        <li><button onclick="loadQuery(2)">Query 3</button></li>
        <li><button onclick="loadQuery(3)">Query 4</button></li>
    </ul>
    */
    queries.forEach((query, index) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.innerText = query.name;
        button.onclick = () => loadQuery(index);
        li.appendChild(button);
        queriesDropdown.appendChild(li);
    });
}

function loadQuery(index) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear existing content

    const h1 = document.createElement('h1');
    h1.innerText = queries[index].name;
    main.appendChild(h1);

    // Retrieve the selected query from the list
    const selectedQuery = queries[index];

    // Create the "New Table" form (first form)
    const newTableForm = document.createElement('form');
    newTableForm.id = 'newTable';
    newTableForm.innerHTML = `
        <h2>New Table</h2>
        <table>
            <tr>
                <th>Column Name</th>
                <th>Type</th>
                <th>Length</th>
                <th>Default</th>
                <th>Collation</th>
                <th>Attribute</th>
                <th>Null</th>
                <th>Auto Increment</th>
                <th>Primary Key</th>
                <th>Comment</th>
            </tr>
            <tr class="column">
                <td><input type="text" name="name" id="name"></td>
                <td>
                    <select name="type" id="type">
                        <!-- Add all data type options here -->
                        <option value="int">INT</option>
                        <option value="varchar">VARCHAR</option>
                        <!-- Add other types as needed -->
                    </select>
                </td>
                <td><input type="text" name="length" id="length"></td>
                <td><input type="text" name="default" id="default"></td>
                <td><input type="text" name="collation" id="collation"></td>
                <td><input type="text" name="attribute" id="attribute"></td>
                <td><input type="checkbox" name="null" id="null"></td>
                <td><input type="checkbox" name="autoIncrement" id="autoIncrement"></td>
                <td><input type="checkbox" name="primaryKey" id="primaryKey"></td>
                <td><input type="text" name="comment" id="comment"></td>
            </tr>
        </table>
        <button id="addColumn" type="button" onclick="addColumn()">Add Column</button>
        <button id="createTable" type="button" onclick="createTable()">Create Table</button>
    `;
    main.appendChild(newTableForm);

    // Create forms for each table in the selected query
    selectedQuery.getTables().forEach((table, tableIndex) => {
        const tableForm = document.createElement('form');
        tableForm.id = `table${tableIndex}`;
        tableForm.innerHTML = `
            <h2>${table.getName()}</h2>
            <table>
                <tr>
                    <th>Column Name</th>
                    <th>Type</th>
                    <th>Length</th>
                    <th>Default</th>
                    <th>Collation</th>
                    <th>Attribute</th>
                    <th>Null</th>
                    <th>Auto Increment</th>
                    <th>Primary Key</th>
                    <th>Comment</th>
                </tr>
                ${table.getColumns().map(column => `
                    <tr class="column">
                        <td><input value="${column.getName()}" type="text" name="name" id="name"></td>
                        <td>
                            <select name="type" id="type">
                                <option value="${column.getType().toLowerCase()}" selected>${column.getType().toUpperCase()}</option>
                                <!-- Add other types if needed -->
                            </select>
                        </td>
                        <td><input value="${column.getLength() || ''}" type="text" name="length" id="length"></td>
                        <td><input value="${column.getDefault() || ''}" type="text" name="default" id="default"></td>
                        <td><input value="${column.getCollation() || ''}" type="text" name="collation" id="collation"></td>
                        <td><input value="${column.getAttribute() || ''}" type="text" name="attribute" id="attribute"></td>
                        <td><input type="checkbox" name="null" id="null" ${column.getNull() ? 'checked' : ''}></td>
                        <td><input type="checkbox" name="autoIncrement" id="autoIncrement" ${column.getAutoIncrement() ? 'checked' : ''}></td>
                        <td><input type="checkbox" name="primaryKey" id="primaryKey" ${column.getPrimaryKey() ? 'checked' : ''}></td>
                        <td><input value="${column.getComment() || ''}" type="text" name="comment" id="comment"></td>
                    </tr>
                `).join('')}
            </table>
            <button id="addColumn" type="button" onclick="addColumn(${tableIndex})">Add Column</button>
            <button id="saveTable" type="button" onclick="saveTable(${tableIndex})">Save</button>

            <!-- Editable Foreign Keys Section -->
            <h2>Foreign Keys</h2>
            <table>
                <tr>
                    <th>Column</th>
                    <th>Referenced Table</th>
                    <th>Referenced Column</th>
                    <th>Actions</th>
                </tr>
                ${table.foreignKeys.map((fk, fkIndex) => `
                    <tr>
                        <td><input type="text" value="${fk.column}" onchange="updateForeignKey(${tableIndex}, ${fkIndex}, 'column', this.value)"></td>
                        <td><input type="text" value="${fk.referencedTable}" onchange="updateForeignKey(${tableIndex}, ${fkIndex}, 'referencedTable', this.value)"></td>
                        <td><input type="text" value="${fk.referencedColumn}" onchange="updateForeignKey(${tableIndex}, ${fkIndex}, 'referencedColumn', this.value)"></td>
                        <td>
                            <button type="button" onclick="removeForeignKey(${tableIndex}, ${fkIndex})">Remove</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
            <button type="button" onclick="addForeignKey(${tableIndex})">Add Foreign Key</button>
        `;
        main.appendChild(tableForm);
    });
}

// Functions to handle updates, removal, and addition of foreign keys
function updateForeignKey(tableIndex, fkIndex, property, value) {
    const table = queries[0].getTables()[tableIndex]; // Adjust as needed to match selected query
    const foreignKey = table.foreignKeys[fkIndex];
    if (property === 'column') {
        foreignKey.column = value;
    } else if (property === 'referencedTable') {
        foreignKey.referencedTable = value;
    } else if (property === 'referencedColumn') {
        foreignKey.referencedColumn = value;
    }
}

function removeForeignKey(tableIndex, fkIndex) {
    const table = queries[0].getTables()[tableIndex]; // Adjust as needed to match selected query
    table.foreignKeys.splice(fkIndex, 1);
    loadQuery(0); // Reload the form to reflect changes; adjust index as necessary
}

function addForeignKey(tableIndex) {
    const table = queries[0].getTables()[tableIndex]; // Adjust as needed to match selected query
    const newForeignKey = new ForeignKey('', '', ''); // Create a new foreign key with empty fields
    table.addForeignKey(newForeignKey);
    loadQuery(0); // Reload the form to reflect changes; adjust index as necessary
}

function addDatabase() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggleDropdownPlus(toggle);
    });

    console.log("addDatabase");
}

function addQuery() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggleDropdownPlus(toggle);
    });

    console.log("addQuerry");
}