import SQLite from 'react-native-sqlite-storage';
import Database from './database';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database = new Database();

export default class MateriaDAO {
    insert(nome) {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO Materia (nome) 
                    VALUES (?)`,
                        [nome]).then(([tx, result]) => {
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

    update(materia) {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`UPDATE Materia SET nome=? WHERE id=?`,
                        [materia.nome, materia.id]).then(([tx, result]) => {
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
                    tx.executeSql(`DELETE FROM Materia WHERE id=?`, [id]).then(([tx, result]) => {
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

    list() {
        return new Promise((resolve) => {
            const materias = [];
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT * FROM Materia ORDER BY nome`, []).then(([tx, result]) => {
                        console.log('Query completed');
                        var len = result.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = result.rows.item(i);
                            materias.push(row);
                        }
                        resolve(materias);
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

