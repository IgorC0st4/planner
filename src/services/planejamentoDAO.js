import SQLite from 'react-native-sqlite-storage';
import Database from './database';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database = new Database();

export default class PlanejamentoDAO {

    insert(idAssunto) {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO Planejamento (idAssunto) VALUES (?)`,
                        [idAssunto]).then(([tx, result]) => {
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

    delete() {
        return new Promise((resolve) => {
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`DELETE FROM Planejamento`, []).then(([tx, result]) => {
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
            const assuntosSelecionados = [];
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`
                    SELECT P.id AS idPlanejamento, A.nome as nomeAssunto, A.estudado, A.idMateria, M.nome AS nomeMateria 
                    FROM Planejamento as P
                    INNER JOIN Assunto As A
                    ON P.idAssunto=A.id
                    INNER JOIN Materia AS M
                    ON M.id=A.idMateria
                    ORDER BY M.nome;`,
                        []).then(([tx, result]) => {
                            console.log('Query completed');
                            var len = result.rows.length;
                            for (let i = 0; i < len; i++) {
                                let row = result.rows.item(i);
                                assuntosSelecionados.push(row);
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

    getDataSummary() {
        return new Promise((resolve) => {
            const dataSummary = [];
            database.init().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`
                    SELECT M.nome AS nomeMateria, A.id AS idAssunto, A.nome As nomeAssunto, A.estudado as isAssuntoEstudado, A.idMateria
                    from Assunto AS A
                    INNER JOIN
                    Materia AS M
                    ON A.idMateria=M.id;`,
                        []).then(([tx, result]) => {
                            console.log('Query completed');
                            var len = result.rows.length;
                            for (let i = 0; i < len; i++) {
                                let row = result.rows.item(i);
                                dataSummary.push(row);
                            }
                            resolve(dataSummary);
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

