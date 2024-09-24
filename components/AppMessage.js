import { View, StyleSheet } from "react-native";
import AppText from "./AppText";

const AppMessage = ({textColor,style,message}) =>{
    return(
        <View style={{...styles.messageContainer,...style}}>
            <AppText style={{color:textColor ? textColor : 'white'}}>{message}</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    messageContainer:{
        width:'100%',
        height:50,
        backgroundColor:'#ed4356',
        justifyContent:'center',
        padding:10,
        borderRadius:10
    }
})

export default AppMessage;