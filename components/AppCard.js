import React from 'react';
import { View,StyleSheet,Text } from 'react-native';

const AppCard = ({children,style}) =>{
    return (
        <View style={{...styles.AppCard,...style}}>
            {children}
        </View>
    )
}


const styles = StyleSheet.create({
    AppCard:{
        width:'45%',
        height:100,
        backgroundColor:'#ffffff',
        elevation:2,
        borderRadius:5,
        padding: 10
    }
})

export default AppCard;