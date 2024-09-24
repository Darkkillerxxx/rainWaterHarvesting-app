import { View,StyleSheet } from "react-native"
import AppText from "./AppText"
import { Picker } from "@react-native-picker/picker"

const AppPicklist = ({picklistValues,onChangeValue,identifier,label,selectedValue}) =>{
    return (
        <>
            <AppText style={styles.appTextStyle}>{label}</AppText>
            <View style={styles.picklistContainer}>  
            <Picker
                selectedValue={selectedValue}
                style={{width:'100%',height:20}}
                onValueChange={(itemValue) =>
                    onChangeValue(identifier,itemValue)
                }>
                <Picker.Item label="None" value='' />
                {picklistValues.map((value,index)=>{
                return (
                    <Picker.Item key={index} label={value} value={value} />
                )
                })}
            </Picker>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    appTextStyle:{
        marginTop:20
    },
    picklistContainer:{
        width:'100%',
        borderWidth:1,
        height:50,
        borderRadius:10,
        marginTop:10
    }
})

export default AppPicklist