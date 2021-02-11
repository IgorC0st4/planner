import React, { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView, FlatList, RefreshControl, View } from 'react-native';
import {
    FAB, Button, ActivityIndicator,
    Dialog, Portal, List, TextInput, Text, IconButton,
    Colors, Checkbox
} from 'react-native-paper';

import AssuntoDAO from '../../services/assuntoDAO';

import styles from './styles';

const assuntoDAO = new AssuntoDAO();

export default function Home() {
    const route = useRoute();
    const { materia } = route.params;

    const [assuntos, setAssuntos] = useState([]);
    const [nome, setNome] = useState('');
    const [idAssunto, setIdAssunto] = useState(0);
    const [novoNome, setNovoNome] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNovoAssuntoDialog, setShowNovoAssuntoDialog] = useState(false);
    const [showEditarAssuntoDialog, setShowEditarAssuntoDialog] = useState(false);
    const [showExcluirAssuntoDialog, setShowExcluirAssuntoDialog] = useState(false);

    useEffect(() => {
        listAssuntos();
    }, []);

    const listAssuntos = () => {
        setIsLoading(true);
        assuntoDAO.list(materia.id).then((result) => {
            setAssuntos(result);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            alert('Ocorreu um erro ao listar os assuntos');
            console.error(error);
        })
    };

    const toggleNovoAssuntoDialog = () => {
        setShowNovoAssuntoDialog(!showNovoAssuntoDialog);
    }

    const toggleEditarAssuntoDialog = () => {
        setShowEditarAssuntoDialog(!showEditarAssuntoDialog);
    }

    const toggleExcluirAssuntoDialog = () => {
        setShowExcluirAssuntoDialog(!showExcluirAssuntoDialog);
    }

    const saveAssunto = () => {
        if (!nome.trim()) {
            alert('Insira um nome válido');
            return;
        }
        assuntoDAO.insert(nome, materia.id).then((result) => {
            setNome('');
            toggleNovoAssuntoDialog();
            listAssuntos();
        }).catch((error) => {
            setIsLoading(false);
            alert('Ocorreu um erro ao salvar o assunto');
            console.error(error);
        });
    };

    const atualizarAssunto = () => {
        if (!novoNome.trim()) {
            alert('Insira um nome válido');
            return;
        }

        let assunto = {
            id: idAssunto,
            nome: novoNome
        };

        assuntoDAO.update(assunto).then((result) => {
            setNovoNome('');
            toggleEditarAssuntoDialog();
            listAssuntos();
        }).catch((error) => {
            alert('Ocorreu um erro ao atualizar o assunto');
            console.error(error);
        });
    }

    const excluirAssunto = () => {
        assuntoDAO.delete(idAssunto).then((result) => {
            setNome('');
            toggleExcluirAssuntoDialog();
            listAssuntos();
        }).catch((error) => {
            alert('Ocorreu um erro ao excluir o assunto');
            console.error(error);
        })
    }

    const enableAtualizarAssunto = (assunto) => {
        setNovoNome(assunto.nome);
        setIdAssunto(assunto.id);
        toggleEditarAssuntoDialog();
    }

    const onRefresh = useCallback(() => {
        listAssuntos();
    });

    const enableExcluirConfirmationDialog = (assunto) => {
        setIdAssunto(assunto.id);
        setNome(assunto.nome);
        toggleExcluirAssuntoDialog()
    };

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
                    data={assuntos}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                            <List.Icon icon="chevron-right" />
                            <Text style={item.estudado ? { flexGrow: 8, fontSize: 18, color: 'green' } : { flexGrow: 8, fontSize: 18 }}>{item.nome}</Text>
                            <IconButton
                                icon="pencil"
                                onPress={() => enableAtualizarAssunto(item)}
                                color={Colors.blue500}
                            />
                            <IconButton
                                icon="delete"
                                onPress={() => enableExcluirConfirmationDialog(item)}
                                color={Colors.red500}
                            />
                            <Checkbox
                                status={item.estudado ? 'checked' : 'unchecked'}
                            />
                        </View>
                    )}
                />

                <FAB style={styles.fab}
                    icon="plus"
                    onPress={() => toggleNovoAssuntoDialog()}
                />

                <Portal>
                    <Dialog
                        visible={showNovoAssuntoDialog}
                        onDismiss={toggleNovoAssuntoDialog}>
                        <Dialog.Title>Novo Assunto</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Nome"
                                value={nome}
                                placeholder="Oração subordinada"
                                onChangeText={text => setNome(text)}
                                mode="outlined"
                            />
                            <Dialog.Actions>
                                <Button onPress={saveAssunto}>Salvar</Button>
                                <Button onPress={toggleNovoAssuntoDialog}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog
                        visible={showEditarAssuntoDialog}
                        onDismiss={toggleEditarAssuntoDialog}>
                        <Dialog.Title>Editar Assunto</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Nome"
                                value={novoNome}
                                placeholder="Oração subordinada"
                                onChangeText={text => setNovoNome(text)}
                                mode="outlined"
                            />
                            <Dialog.Actions>
                                <Button onPress={atualizarAssunto}>Salvar</Button>
                                <Button onPress={toggleEditarAssuntoDialog}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog
                        visible={showExcluirAssuntoDialog}
                        onDismiss={toggleExcluirAssuntoDialog}>
                        <Dialog.Title>Deseja excluir {nome}?</Dialog.Title>
                        <Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={excluirAssunto}>Excluir</Button>
                                <Button onPress={toggleExcluirAssuntoDialog}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        );
    }
}