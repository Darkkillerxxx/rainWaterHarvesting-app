import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './screens/dashboard';
import DataTable from './screens/dataTable';
import CreateEditRecords from './screens/createEditRecord';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/login';
import Register from './screens/register';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import AppDrawer from './components/AppDrawer';
import { menuContents } from './common/menu';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const StackNavScreens = () =>{
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DataTable" component={DataTable} />
        <Stack.Screen name="CreateEditRecords" component={CreateEditRecords} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
     </Stack.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Dashboard" 
          drawerContent={(props) => <AppDrawer {...props}/>} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name='Stack' component={StackNavScreens}/>
          </Drawer.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
