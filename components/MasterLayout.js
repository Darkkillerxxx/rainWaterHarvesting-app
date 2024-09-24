import React from 'react';
import { StyleSheet,View } from 'react-native';

const MasterLayout = ({children,style}) =>{
    return(
        <View style={{...styles.container,...style}}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center'
    },
  });

export default MasterLayout;