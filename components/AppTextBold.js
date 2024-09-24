import React,{ReactNode} from 'react';
import {StyleSheet,Text } from 'react-native';

const AppTextBold = ({children,style}) =>{
    return (
        <Text style={{...styles.AppText,...style}}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    AppText:{
       color:'black',
       fontSize:16,
       fontWeight:"bold",
       fontFamily:'Montserrat-Bold'
    }
})

export default AppTextBold;