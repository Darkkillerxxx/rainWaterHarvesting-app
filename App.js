import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './screens/dashboard';
import DataTable from './screens/dataTable';
import CreateEditRecords from './screens/createEditRecord';
import Login from './screens/login';
import Register from './screens/register';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import AppDrawer from './components/AppDrawer';
import { menuContents } from './common/menu';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Dashboard" 
          drawerContent={(props) => <AppDrawer {...props}/>}>
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="DataTable" component={DataTable} />
            <Drawer.Screen name="CreateEditRecords" component={CreateEditRecords} />
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Register" component={Register} />
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
