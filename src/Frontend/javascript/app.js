class ForeignKey {
    constructor(column, referencedTable, referencedColumn) {
        this.column = column;
        this.referencedTable = referencedTable;
        this.referencedColumn = referencedColumn;
    }

    toString(tableName) {
        return `ALTER TABLE \`${tableName}\` ADD FOREIGN KEY (\`${this.column}\`) REFERENCES \`${this.referencedTable}\` (\`${this.referencedColumn}\`);`;
    }
}

class Database {
    constructor({ name, tables = [], dropDatabase = false, useDatabase = false }) {
        this.name = name;
        this.tables = tables;
        this.dropDatabase = dropDatabase;
        this.useDatabase = useDatabase;
    }

    addTable(table) {
        this.tables.push(table);
    }

    removeTable(table) {
        this.tables = this.tables.filter(t => t != table);
    }

    getTables() {
        return this.tables;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    toggleDropDatabase() {
        this.dropDatabase = !this.dropDatabase;
    }

    toggleUseDatabase() {
        this.useDatabase = !this.useDatabase;
    }

    toString() {
        let sql = "";

        if (this.dropDatabase) {
            sql += "DROP DATABASE IF EXISTS `" + this.name + "`;\n";
        }
        
        sql += "CREATE DATABASE `" + this.name + "`;\n\n";

        if (this.useDatabase) {
            sql += "USE `" + this.name + "`;\n\n";
        }

        // Generate table creation statements
        let tableCreationSQL = "";
        let foreignKeySQL = "";

        for (let i = 0; i < this.tables.length; i++) {
            tableCreationSQL += this.tables[i].toString() + "\n\n";
            foreignKeySQL += this.tables[i].getForeignKeysSQL();
        }

        sql += tableCreationSQL + foreignKeySQL;

        return sql;
    }
}

class Table {
    constructor(name) {
        this.name = name;
        this.columns = [];
        this.foreignKeys = []; // List to store foreign keys
    }

    addColumn(column) {
        this.columns.push(column);
    }

    removeColumn(column) {
        this.columns = this.columns.filter(c => c != column);
    }

    addForeignKey(foreignKey) {
        this.foreignKeys.push(foreignKey);
    }

    removeForeignKey(foreignKey) {
        this.foreignKeys = this.foreignKeys.filter(fk => fk != foreignKey);
    }

    getColumns() {
        return this.columns;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getForeignKeysSQL() {
        let sql = "";
        for (let fk of this.foreignKeys) {
            sql += fk.toString(this.name) + "\n";
        }
        return sql;
    }

    toString() {
        let sql = "CREATE TABLE `" + this.name + "` (\n";

        for (let i = 0; i < this.columns.length; i++) {
            sql += "    " + this.columns[i].toString();

            if (i != this.columns.length - 1) {
                sql += ",";
            }

            sql += "\n";
        }

        sql += ");";

        return sql;
    }
}

class Column {
    constructor({ name, type, length = null, defaultValue = null, collation = null, attribute = null, nullValue = false, autoIncrement = false, primaryKey = false, comment = null }) {
        this.name = name;
        this.type = type;
        this.length = length;
        this.default = defaultValue;
        this.collation = collation;
        this.attribute = attribute;
        this.null = nullValue;
        this.autoIncrement = autoIncrement;
        this.primaryKey = primaryKey;
        this.comment = comment;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getLength() {
        return this.length;
    }

    getDefault() {
        return this.default;
    }

    getCollation() {
        return this.collation;
    }

    getAttribute() {
        return this.attribute;
    }

    getNull() {
        return this.null;
    }

    getAutoIncrement() {
        return this.autoIncrement;
    }

    getPrimaryKey() {
        return this.primaryKey;
    }

    getComment() {
        return this.comment;
    }

    setName(name) {
        this.name = name;
    }

    setType(type) {
        this.type = type;
    }

    setLength(length) {
        this.length = length;
    }

    setDefault(defaultValue) {
        this.default = defaultValue;
    }

    setCollation(collation) {
        this.collation = collation;
    }

    setAttribute(attribute) {
        this.attribute = attribute;
    }

    setNull(nullValue) {
        this.null = nullValue;
    }

    setAutoIncrement(autoIncrement) {
        this.autoIncrement = autoIncrement;
    }

    setPrimaryKey(primaryKey) {
        this.primaryKey = primaryKey;
    }

    setComment(comment) {
        this.comment = comment;
    }

    toString() {
        let sql = "`" + this.name + "` " + this.type;

        if (this.length != null) {
            sql += "(" + this.length + ")";
        }

        if (this.default !== null && typeof this.default !== "boolean") {
            sql += " DEFAULT " + this.default;
        }

        if (this.collation != null) {
            sql += " COLLATE " + this.collation;
        }

        if (this.attribute != null) {
            sql += " " + this.attribute;
        }

        if (this.null) {
            sql += " NULL";
        } else {
            sql += " NOT NULL";
        }

        if (this.autoIncrement) {
            sql += " AUTO_INCREMENT";
        }

        if (this.primaryKey) {
            sql += " PRIMARY KEY";
        }

        if (this.comment != null) {
            sql += " COMMENT '" + this.comment + "'";
        }

        return sql;
    }
}

// Testing the addition of foreign keys with ALTER TABLE syntax
let db = new Database({ name:"test", dropDatabase: true, useDatabase: true });

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

console.log(db.toString());
