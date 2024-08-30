// those are the classes i have to use. I want to create an interface to create the MySQL code for me.
class Database {
    constructor(name) {
        this.name = name;
        this.tables = [];
        this.dropDatabase = false;
        this.useDatabase = false;
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

    toString() {
        let sql = ""

        if(this.dropDatabase) {
            sql += "DROP DATABASE IF EXISTS `" + this.name + "`;\n\n";
        }

        if(this.useDatabase) {
            sql += "USE `" + this.name + "`;\n\n";
        }

        sql = "CREATE DATABASE `" + this.name + "`;\n\n";
        
        for(let i = 0; i < this.tables.length; i++) {
            sql += this.tables[i].toString() + "\n\n";
        }
        
        return sql;
    }
}

class Table {
    constructor(name) {
        this.name = name;
        this.columns = [];
    }
    
    addColumn(column) {
        this.columns.push(column);
    }

    removeColumn(column) {
        this.columns = this.columns.filter(c => c != column);
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

    toString() {
        let sql = "CREATE TABLE `" + this.name + "` (\n";
        
        for(let i = 0; i < this.columns.length; i++) {
            sql += "    " + this.columns[i].toString();
            
            if(i != this.columns.length - 1) {
                sql += ",";
            }
            
            sql += "\n";
        }
        
        sql += ");";
        
        return sql;
    }
}

/*
    example output of toString() method:
    CREATE TABLE abo (
        `ID` INTEGER AUTO_INCREMENT, PRIMARY KEY (ID),
        `name` VARCHAR(20),
        `price` INTEGER
    );
*/
class Column {
    constructor(name, type, length=null, defaultValue=null, collation=null, attribute=null, nullValue=false, autoIncrement=false, primaryKey=false, comment=null) {
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

        if(this.length != null) {
            sql += "(" + this.length + ")";
        }
        
        if(this.default != null) {
            sql += " DEFAULT " + this.default;
        }
        
        if(this.collation != null) {
            sql += " COLLATE " + this.collation;
        }
        
        if(this.attribute != null) {
            sql += " " + this.attribute;
        }
        
        if(this.null) {
            sql += " NULL";
        } else {
            sql += " NOT NULL";
        }
        
        if(this.autoIncrement) {
            sql += " AUTO_INCREMENT";
        }
        
        if(this.primaryKey) {
            sql += " PRIMARY KEY";
        }
        
        if(this.comment != null) {
            sql += " COMMENT '" + this.comment + "'";
        }
        
        return sql;
    }
}

/*
Possible types:

INT, VARCHAR, TEXT, DATE, TINYINT, SMALLINT, MEDIUMINT, INT, BIGINT, DECIMAL, FLOAT, DOUBLE, REAL, BIT, BOOLEAN, SERIAL, DATE, DATETIME, TIMESTAMP, TIME, YEAR, CHAR, VARCHAR, TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT, BINARY, VARBINARY, TINYBLOB, BLOB, MEDIUMBLOB, LONGBLOB, ENUM, SET, INET6, GEOMETRY, POINT, LINESTRING, POLYGON, MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, GEOMETRYCOLLECTION, JSON
*/