import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DataTable = () => {
  return (
    <View style={styles.container}>
        <Text>Data Table Screen</Text>
    </View>
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


export default DataTable;