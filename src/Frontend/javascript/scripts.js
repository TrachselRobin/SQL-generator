// Define column type options
const columnTypeOptions = `
    <!-- Numeric Data Types -->
    <option value="INT">INT</option>
    <option value="TINYINT">TINYINT</option>
    <option value="SMALLINT">SMALLINT</option>
    <option value="MEDIUMINT">MEDIUMINT</option>
    <option value="BIGINT">BIGINT</option>
    <option value="FLOAT">FLOAT</option>
    <option value="DOUBLE">DOUBLE</option>
    <option value="DECIMAL">DECIMAL</option>
    <option value="BIT">BIT</option>
    <option value="BOOLEAN">BOOLEAN</option>

    <!-- Date and Time Data Types -->
    <option value="DATE">DATE</option>
    <option value="DATETIME">DATETIME</option>
    <option value="TIMESTAMP">TIMESTAMP</option>
    <option value="TIME">TIME</option>
    <option value="YEAR">YEAR</option>

    <!-- String Data Types -->
    <option value="CHAR">CHAR</option>
    <option value="VARCHAR">VARCHAR</option>
    <option value="BINARY">BINARY</option>
    <option value="VARBINARY">VARBINARY</option>
    <option value="TINYBLOB">TINYBLOB</option>
    <option value="BLOB">BLOB</option>
    <option value="MEDIUMBLOB">MEDIUMBLOB</option>
    <option value="LONGBLOB">LONGBLOB</option>
    <option value="TINYTEXT">TINYTEXT</option>
    <option value="TEXT">TEXT</option>
    <option value="MEDIUMTEXT">MEDIUMTEXT</option>
    <option value="LONGTEXT">LONGTEXT</option>
    <option value="ENUM">ENUM</option>
    <option value="SET">SET</option>

    <!-- JSON Data Types -->
    <option value="JSON">JSON</option>

    <!-- Spatial Data Types -->
    <option value="GEOMETRY">GEOMETRY</option>
    <option value="POINT">POINT</option>
    <option value="LINESTRING">LINESTRING</option>
    <option value="POLYGON">POLYGON</option>
    <option value="MULTIPOINT">MULTIPOINT</option>
    <option value="MULTILINESTRING">MULTILINESTRING</option>
    <option value="MULTIPOLYGON">MULTIPOLYGON</option>
    <option value="GEOMETRYCOLLECTION">GEOMETRYCOLLECTION</option>
`;

// Example Queries Array
let queries = [
    new Query({ name: 'TestDB', dropDatabase: true, useDatabase: true })
];
let selectedQueryIndex = null;

document.getElementById('addQueryBtn').addEventListener('click', () => {
    const newQuery = new Query({ name: 'NewQuery' });
    queries.push(newQuery);
    renderQueryList();
});

document.getElementById('saveQueryBtn').addEventListener('click', () => {
    if (selectedQueryIndex !== null) {
        const query = queries[selectedQueryIndex];
        alert(query.toString());
    }
});

function renderQueryList() {
    const queryList = document.getElementById('queryList');
    queryList.innerHTML = '';
    queries.forEach((query, index) => {
        const queryItem = document.createElement('div');
        queryItem.className = 'query-item';
        queryItem.textContent = query.getName();
        queryItem.onclick = () => {
            selectedQueryIndex = index;
            renderQueryDetails(query);
        };
        queryList.appendChild(queryItem);
    });
}

function renderQueryDetails(query) {
    const queryDetails = document.getElementById('queryDetails');
    queryDetails.innerHTML = `
        <label>Query Name: <input type="text" value="${query.getName()}" onchange="queries[selectedQueryIndex].setName(this.value)" /></label>
        <label>Drop Database: <input type="checkbox" ${query.dropDatabase ? 'checked' : ''} onchange="queries[selectedQueryIndex].toggleDropDatabase()" /></label>
        <label>Use Database: <input type="checkbox" ${query.useDatabase ? 'checked' : ''} onchange="queries[selectedQueryIndex].toggleUseDatabase()" /></label>
        <button onclick="addTable()" class="primary-btn">Add Table</button>
        <div id="tablesContainer"></div>
    `;
    renderTables(query);
}

function renderTables(query) {
    const tablesContainer = document.getElementById('tablesContainer');
    tablesContainer.innerHTML = '';
    query.getTables().forEach((table, tableIndex) => {
        const tableItem = document.createElement('div');
        tableItem.className = 'table-item';
        tableItem.innerHTML = `
            <div class="table-name-container">
                <label>Table Name: 
                    <input type="text" class="table-name-input" value="${table.getName()}" 
                        placeholder="Enter table name" 
                        onchange="queries[selectedQueryIndex].tables[${tableIndex}].setName(this.value)" />
                </label>
            </div>
            <button onclick="addColumn(${tableIndex})" class="primary-btn">Add Column</button>
            <div id="columnsContainer${tableIndex}"></div>
        `;
        tablesContainer.appendChild(tableItem);
        renderColumns(table, tableIndex);
    });
}

function renderColumns(table, tableIndex) {
    const columnsContainer = document.getElementById(`columnsContainer${tableIndex}`);
    columnsContainer.innerHTML = '';
    const primaryKeys = getAllPrimaryKeys();

    table.getColumns().forEach((column, columnIndex) => {
        const columnItem = document.createElement('div');
        columnItem.className = 'column-item';
        columnItem.innerHTML = `
            <input type="text" value="${column.getName()}" onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setName(this.value)" placeholder="Column Name" />
            <select onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setType(this.value)">
                ${columnTypeOptions}
            </select>
            <input type="number" value="${column.getLength() || ''}" placeholder="Length" onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setLength(parseInt(this.value))" />
            <input type="checkbox" ${column.getPrimaryKey() ? 'checked' : ''} onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setPrimaryKey(this.checked)" /> Primary Key
            <input type="checkbox" ${column.getAutoIncrement() ? 'checked' : ''} onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setAutoIncrement(this.checked)" /> Auto Increment
            <input type="text" value="${column.getDefault() || ''}" placeholder="Default Value" onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setDefault(this.value)" />
            <input type="text" value="${column.getComment() || ''}" placeholder="Comment" onchange="queries[selectedQueryIndex].tables[${tableIndex}].columns[${columnIndex}].setComment(this.value)" />
            <select onchange="handleForeignKeyChange(${tableIndex}, ${columnIndex}, this.value)">
                <option value="">Select Foreign Key</option>
                ${primaryKeys.map(pk => `<option value="${pk.table}.${pk.column}">${pk.table}.${pk.column}</option>`).join('')}
            </select>
        `;
        columnsContainer.appendChild(columnItem);

        // Set selected type in the dropdown
        columnItem.querySelector('select').value = column.getType();
    });
}

function handleForeignKeyChange(tableIndex, columnIndex, foreignKeyValue) {
    if (foreignKeyValue) {
        const [referencedTable, referencedColumn] = foreignKeyValue.split('.');
        const foreignKey = new ForeignKey(
            queries[selectedQueryIndex].tables[tableIndex].columns[columnIndex].getName(),
            referencedTable,
            referencedColumn
        );
        queries[selectedQueryIndex].tables[tableIndex].addForeignKey(foreignKey);
    }
}

function addTable() {
    const newTable = new Table('NewTable');
    queries[selectedQueryIndex].addTable(newTable);
    renderTables(queries[selectedQueryIndex]);
}

function addColumn(tableIndex) {
    const newColumn = new Column({ name: 'NewColumn', type: 'varchar', length: 255 });
    queries[selectedQueryIndex].tables[tableIndex].addColumn(newColumn);
    renderColumns(queries[selectedQueryIndex].tables[tableIndex], tableIndex);
}

// Function to get all primary keys from the current query
function getAllPrimaryKeys() {
    const primaryKeys = [];
    if (selectedQueryIndex !== null) {
        queries[selectedQueryIndex].getTables().forEach(table => {
            table.getColumns().forEach(column => {
                if (column.getPrimaryKey()) {
                    primaryKeys.push({ table: table.getName(), column: column.getName() });
                }
            });
        });
    }
    return primaryKeys;
}

// Initial render
renderQueryList();