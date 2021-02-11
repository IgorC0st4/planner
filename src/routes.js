import * as React from 'react';
import {
    createDrawerNavigator
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { IconButton} from 'react-native-paper';

import Home from './pages/Home';
import Materias from './pages/Materias';
import Assuntos from './pages/Assuntos';
import GerarPlanejamento from './pages/GerarPlanejamento';

const DrawerNavigator = createDrawerNavigator();

const HomeStack = createStackNavigator();
function HomeStackScreen() {
    const navigation = useNavigation();
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={Home}
                options={{
                    headerLeft: () => (
                        <IconButton
                            icon="menu"
                            size={20}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
            <HomeStack.Screen name="Gerar Planejamento" component={GerarPlanejamento} />
        </HomeStack.Navigator>
    );
}

const MateriasStack = createStackNavigator();
function MateriasStackScreen() {
    const navigation = useNavigation();
    return (
        <MateriasStack.Navigator>
            <MateriasStack.Screen
                name="Materias"
                component={Materias}
                options={{
                    headerLeft: () => (
                        <IconButton
                            icon="menu"
                            size={20}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }} />
            <MateriasStack.Screen name="Assuntos" component={Assuntos} />
        </MateriasStack.Navigator>
    );
}

export default function Routes() {
    return (
        <NavigationContainer>
            <DrawerNavigator.Navigator initialRouteName="Home">
                <DrawerNavigator.Screen name="Home" component={HomeStackScreen} />
                <DrawerNavigator.Screen name="Materias" component={MateriasStackScreen} />
            </DrawerNavigator.Navigator>
        </NavigationContainer>
    );
}
