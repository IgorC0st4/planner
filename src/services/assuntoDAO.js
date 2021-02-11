import SQLite from 'react-native-sqlite-storage';
import Database from './database';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database = new Database();

export default class AssuntoDAO {
    insert(nome, idMateria) {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO Assunto (nome, idMateria) 
                    VALUES (?, ?)`,
                        [nome, idMateria]).then(([tx, result]) => {
                            resolve(result);
                        });
                }).then((result) => {
                    database.close(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    update(assunto) {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`UPDATE Assunto SET nome=?, estudado=? WHERE id=?`,
                    [assunto.nome, assunto.estudado, assunto.id]).then(([tx, result]) => {
                            resolve(result);
                        });
                }).then((result) => {
                    database.close(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(id) {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`DELETE FROM Assunto WHERE id=?`, [id]).then(([tx, result]) => {
                        console.log(result);
                        resolve(result);
                    });
                }).then((result) => {
                    database.close(db);
                }).catch((error) => {
                    console.error(error);
                })
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    list(idMateria) {
        return new Promise((resolve) => {
            const assuntos = [];
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT * FROM Assunto WHERE idMateria=? ORDER BY nome`, [idMateria]).then(([tx, result]) => {
                        console.log('Query completed');
                        var len = result.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = result.rows.item(i);
                            assuntos.push(row);
                        }
                        resolve(assuntos);
                    });
                }).then((result) => {
                    database.close(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }
}

