import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, FlatList, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    FAB, Button, ActivityIndicator,
    Dialog, Portal, List, TextInput, Text, IconButton,
    Colors
} from 'react-native-paper';

import MateriaDAO from '../../services/materiaDAO';

import styles from './styles';

const materiaDAO = new MateriaDAO();

export default function Materias() {
    const navigation = useNavigation();

    const [materias, setMaterias] = useState([]);
    const [nome, setNome] = useState('');
    const [idMateria, setIdMateria] = useState(0);
    const [novoNome, setNovoNome] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNovaMateriaDialog, setShowNovaMateriaDialog] = useState(false);
    const [showEditarMateriaDialog, setShowEditarMateriaDialog] = useState(false);
    const [showExcluirMateriaDialog, setShowExcluirMateriaDialog] = useState(false);

    useEffect(() => {
        listMaterias();
    }, []);

    const listMaterias = () => {
        setIsLoading(true);
        materiaDAO.list().then((result) => {
            setMaterias(result);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            alert('Ocorreu um erro ao listar as matérias');
            console.error(error);
        })
    };

    const toggleNovaMateriaDialog = () => {
        setShowNovaMateriaDialog(!showNovaMateriaDialog);
    }

    const toggleEditarMateriaDialog = () => {
        setShowEditarMateriaDialog(!showEditarMateriaDialog);
    }

    const toggleExcluirMateriaDialog = () => {
        setShowExcluirMateriaDialog(!showExcluirMateriaDialog);
    }

    const saveMateria = () => {
        if (!nome.trim()) {
            alert('Insira um nome válido');
            return;
        }
        materiaDAO.insert(nome).then((result) => {
            setNome('');
            toggleNovaMateriaDialog();
            listMaterias();
        }).catch((error) => {
            setIsLoading(false);
            alert('Ocorreu um erro ao salvar a matéria');
            console.error(error);
        });
    };

    const atualizarMateria = () => {
        if (!novoNome.trim()) {
            alert('Insira um nome válido');
            return;
        }

        let materia = {
            id: idMateria,
            nome: novoNome
        };

        materiaDAO.update(materia).then((result) => {
            setNovoNome('');
            toggleEditarMateriaDialog();
            listMaterias();
        }).catch((error) => {
            alert('Ocorreu um erro ao atualizar a matéria');
            console.error(error);
        });
    }

    const excluirMateria = () => {
        materiaDAO.delete(idMateria).then((result) => {
            setNome('');
            toggleExcluirMateriaDialog();
            listMaterias();
        }).catch((error) => {
            alert('Ocorreu um erro ao excluir a matéria');
            console.error(error);
        })
    }

    const enableAtualizarMateria = (materia) => {
        setNovoNome(materia.nome);
        setIdMateria(materia.id);
        toggleEditarMateriaDialog();
    }

    const onRefresh = useCallback(() => {
        listMaterias();
    });

    const enableExcluirConfirmationDialog = (materia) => {
        setIdMateria(materia.id);
        setNome(materia.nome);
        toggleExcluirMateriaDialog()
    };

    const navigateToAssuntos = (materia) =>{
        navigation.navigate('Assuntos', {materia});
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingPage}>
                <ActivityIndicator animating={isLoading} />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.page}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
                    data={materias}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', flexWrap:'wrap' }}>
                            <List.Icon icon="chevron-right" />
                            <Text style={{ flexGrow: 8, fontSize: 18 }}
                                onPress={() => navigateToAssuntos(item)}>{item.nome}</Text>
                            <IconButton
                                icon="pencil"
                                onPress={() => enableAtualizarMateria(item)}
                                color={Colors.blue500}

                            />
                            <IconButton
                                icon="delete"
                                onPress={() => enableExcluirConfirmationDialog(item)}
                                color={Colors.red500}
                            />
                        </View>
                    )}
                />

                <FAB style={styles.fab}
                    icon="plus"
                    onPress={() => toggleNovaMateriaDialog()}
                />

                <Portal>
                    <Dialog
                        visible={showNovaMateriaDialog}
                        onDismiss={toggleNovaMateriaDialog}>
                        <Dialog.Title>Nova Matéria</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Nome"
                                value={nome}
                                placeholder="Língua Portuguesa"
                                onChangeText={text => setNome(text)}
                                mode="outlined"
                            />
                            <Dialog.Actions>
                                <Button onPress={saveMateria}>Salvar</Button>
                                <Button onPress={toggleNovaMateriaDialog}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog
                        visible={showEditarMateriaDialog}
                        onDismiss={toggleEditarMateriaDialog}>
                        <Dialog.Title>Editar Matéria</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Nome"
                                value={novoNome}
                                placeholder="Língua Portuguesa"
                                onChangeText={text => setNovoNome(text)}
                                mode="outlined"
                            />
                            <Dialog.Actions>
                                <Button onPress={atualizarMateria}>Salvar</Button>
                                <Button onPress={toggleEditarMateriaDialog}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>



                <Portal>
                    <Dialog
                        visible={showExcluirMateriaDialog}
                        onDismiss={toggleExcluirMateriaDialog}>
                        <Dialog.Title>Deseja excluir {nome}?</Dialog.Title>
                        <Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={excluirMateria}>Excluir</Button>
                                <Button onPress={toggleExcluirMateriaDialog}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        );
    }
}