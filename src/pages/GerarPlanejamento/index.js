import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, FlatList, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    FAB, Button, ActivityIndicator,
    Dialog, Portal, List, TextInput, Text, IconButton,
    Colors, Checkbox
} from 'react-native-paper';

import PlanejamentoDAO from '../../services/planejamentoDAO';

import styles from './styles';

const planejamentoDAO = new PlanejamentoDAO();

export default function GerarPlanejamento() {

    const [dataSummary, setDataSummary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [indexesAssuntosSelecionados, setIndexesAssuntosSelecionados] = useState([]);

    useEffect(() => {
        getDataSummary();
    }, []);

    const extractAssunto = (item) => {
        return {
            id: item.idAssunto,
            nome: item.nomeAssunto,
            estudado: item.isAssuntoEstudado,
            idMateria: item.idMateria
        };
    }

    const getDataSummary = async () => {
        setIsLoading(true);

        planejamentoDAO.getDataSummary().then((data) => {
            console.log(data);

            var tempDataSummary = [];

            var tempAssuntos = [];

            var materia = {
                nome: data[0].nomeMateria,
                assuntos: []
            }
            tempAssuntos.push(extractAssunto(data[0]));
            for (let i = 1; i < data.length; i++) {
                if (data[i].nomeMateria !== data[i - 1].nomeMateria) {
                    materia.assuntos = tempAssuntos;
                    tempDataSummary.push(materia);
                    materia = {
                        nome: data[i].nomeMateria,
                        assuntos: []
                    };
                    tempAssuntos = [];
                }
                tempAssuntos.push(extractAssunto(data[i]));
            }

            setDataSummary(tempDataSummary);
            setIsLoading(false);
        }).catch((error) => {
            alert('Erro ao listar dados');
            setIsLoading(false);
            console.error(error);
        });
    }
    const onRefresh = useCallback(() => {
        getDataSummary();
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingPage}>
                <ActivityIndicator animating={isLoading} />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.page}>
                <List.AccordionGroup>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
                        data={dataSummary}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <List.Accordion title={item.nome} id={item.assuntos[0].idMateria}
                                left={props => <List.Icon {...props} icon="folder" />}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={item.assuntos}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => (
                                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <List.Icon icon="chevron-right" />
                                            <Text style={item.estudado ? { flexGrow: 1, fontSize: 18, color: 'green' } : { flexGrow: 1, fontSize: 18 }}>{item.nome}</Text>
                                            <Checkbox
                                                status={item.estudado ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                    )}
                                />

                            </List.Accordion>
                        )}
                    />
                </List.AccordionGroup>

                <FAB style={styles.fab}
                    icon="content-save"
                    onPress={() => console.log('click')}
                />

            </SafeAreaView>
        );
    }
}