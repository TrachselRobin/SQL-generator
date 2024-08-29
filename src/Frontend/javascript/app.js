// those are the classes i have to use. I want to create an interface to create the MySQL code for me.
class Database {
    constructor(name) {
        this.name = name;
        this.tables = [];
    }
    
    addTable()
}

class Table {
    constructor(name) {
        this.name = name;
        this.columns = [];

        
    }
    
    addColumn()
}

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
}

/*
Possible types:

INT, VARCHAR, TEXT, DATE, TINYINT, SMALLINT, MEDIUMINT, INT, BIGINT, DECIMAL, FLOAT, DOUBLE, REAL, BIT, BOOLEAN, SERIAL, DATE, DATETIME, TIMESTAMP, TIME, YEAR, CHAR, VARCHAR, TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT, BINARY, VARBINARY, TINYBLOB, BLOB, MEDIUMBLOB, LONGBLOB, ENUM, SET, INET6, GEOMETRY, POINT, LINESTRING, POLYGON, MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, GEOMETRYCOLLECTION, JSON
*/