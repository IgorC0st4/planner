import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const databaseName = 'PlannerDB.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'SQLite Planner Database';
const databaseSize = 200000;

export default class Database {
    init() {
        let db;
        return new Promise((resolve) => {
            console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    console.log("Integrity check passed ...");
                    console.log("Opening database ...");
                    SQLite.openDatabase(
                        databaseName,
                        databaseVersion,
                        databaseDisplayname,
                        databaseSize
                    )
                        .then(DB => {
                            db = DB;
                            console.log("Database OPEN");
                            db.executeSql('SELECT 1 FROM Materia LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                db.transaction((tx) => {
                                    tx.executeSql(`CREATE TABLE IF NOT EXISTS Materia (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                                        nome TEXT NOT NULL);`);
                                }).then(() => {
                                    console.log("Table Materia created successfully");
                                    db.transaction((tx) => {
                                        tx.executeSql(`CREATE TABLE IF NOT EXISTS Assunto (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                                            nome TEXT NOT NULL, estudado INTEGER DEFAULT 0, idMateria INTEGER NOT NULL, 
                                            FOREIGN KEY (idMateria) REFERENCES Materia(id));`);
                                    }).then(() => {
                                        console.log("Table Assunto created successfully");
                                        db.transaction((tx)=>{
                                            tx.executeSql(`CREATE TABLE IF NOT EXISTS Planejamento
                                            (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                              idAssunto INTEGER NOT NULL,
                                            FOREIGN KEY (idAssunto) REFERENCES Assunto(id));`);
                                        }).then(()=>{
                                            console.log('Table Planejamento created succeddfully');
                                        }).catch((error)=>{
                                            console.error(error);
                                        });
                                    }).catch((error) => {
                                        console.error(error);
                                    });
                                }).catch(error => {
                                    console.error(error);
                                });
                            });
                            resolve(db);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error("echoTest failed - plugin not functional");
                });
        });
    };

    close(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {
            console.log("Database was not OPENED");
        }
    };
}
