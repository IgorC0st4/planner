import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    FAB, Card, Button, Divider, ActivityIndicator,
    Dialog, Portal, List, Text
} from 'react-native-paper';

import styles from './styles';

import PlanejamentoDAO from '../../services/planejamentoDAO';

const planejamentoDAO = new PlanejamentoDAO();

const extractAssunto = (assunto) => {
    return {
        id: assunto.id,
        nome: assunto.nome,
        selecionadoParaEstudo: assunto.selecionadoParaEstudo,
        estudado: assunto.estudado,
        idMateria: assunto.idMateria
    };
};

export default function Home() {
    const navigation = useNavigation();
    useEffect(() => {

    }, []);
    const [planejamento, setPlanejamento] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const gerarPlanejamento = async () => {
        setIsLoading(true);

        var data = [];

        try {
            data = await planejamentoDAO.list();
        } catch (error) {
            alert('Ocorreu um erro ao visualizar o planejamento');
            console.error(error);
        }

        let tempPlanejamento = [];

        let materia = {
            nome: '',
            assuntos: []
        }

        let assuntosMateria = [];

        materia.nome = data[0].materia;
        assuntosMateria.push(extractAssunto(data[0]));

        for (let i = 1; i < data.length; i++) {
            if (data[i].materia !== data[i - 1].materia) {
                materia.assuntos = assuntosMateria;
                tempPlanejamento.push(materia);
                materia.nome = data[i].materia;
                materia.assuntos = [];
            }
            assuntosMateria.push(extractAssunto(data[i]));
        }


        materia.assuntos = assuntosMateria;
        tempPlanejamento.push(materia);
        setPlanejamento(tempPlanejamento);
        setIsLoading(false);

    };
    const onRefresh = useCallback(() => {
        gerarPlanejamento();
    });

    const navigateToGerarPlanejamento = () =>{
        navigation.navigate("Gerar Planejamento");
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
                    data={planejamento}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Card>
                            <Card.Title title={item.materia} />

                            <Card.Content>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={item.assuntos}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <List.Icon icon="chevron-right" />
                                            <Text style={item.estudado ? { flexGrow: 8, fontSize: 18, color: 'green' } : { flexGrow: 8, fontSize: 18 }}>{item.nome}</Text>
                                            <Checkbox
                                                status={item.estudado ? 'checked' : 'unchecked'}
                                                onPress={() => console.log(item)}
                                            />
                                        </View>
                                    )}
                                />
                            </Card.Content>

                        </Card>
                    )}
                />
                <FAB style={styles.fab}
                    icon="plus"
                    onPress={() => navigateToGerarPlanejamento()}
                />
            </SafeAreaView>
        );
    }
}