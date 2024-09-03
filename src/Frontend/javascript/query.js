let queryList = [];

addTestValues();

document.addEventListener('DOMContentLoaded', function() {
    
});

/* 
<h1>Query 1</h1>
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Columns</th>
            <th>Size</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a href="#">Table 1</a></td>
            <td>5</td>
            <td>1000</td>
        </tr>
        <tr>
            <td><a href="#">Table 2</a></td>
            <td>3</td>
            <td>500</td>
        </tr>
        <tr>
            <td><a href="#">Table 3</a></td>
            <td>7</td>
            <td>2000</td>
        </tr>
    </tbody>
</table>
*/

function loadQueries() {
    const queries = document.getElementById("queries");
    queries.innerHTML = "";

    

    clearOutput();
}

function updateOutput() {
    // code
}

function clearOutput() {
    const output = document.querySelector("#output textarea");
    output.value = " ";
}

function addTestValues() {
    const newQuery = new Query({ name: "Test", dropDatabase: true, useDatabase: true });
    queryList.push(newQuery);

    const table1 = new Table("abo");
    table1.addColumn(new Column({ name: "id", type: "INT", primaryKey: true }));
    table1.addColumn(new Column({ name: "name", type: "VARCHAR", length: 20 }));
    table1.addColumn(new Column({ name: "price", type: "INT" }));
    newQuery.addTable(table1);

    const table2 = new Table("user_vehicle");
    table2.addColumn(new Column({ name: "id", type: "INT", primaryKey: true }));
    table2.addColumn(new Column({ name: "user_id", type: "INT" }));
    table2.addColumn(new Column({ name: "vehicle_id", type: "INT" }));
    newQuery.addTable(table2);
}