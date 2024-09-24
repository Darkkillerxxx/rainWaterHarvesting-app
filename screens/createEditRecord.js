import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CreateEditRecords = () => {
  return (
    <View style={styles.container}>
        <Text>Create Records Screen</Text>
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


export default CreateEditRecords;