import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import AppText from "./AppText"
import { useEffect, useState } from "react"

const AppInputOptions = ({inputOptions,text,onButtonSelect}) =>{
    const [inputValues,setInputValues] = useState([]);

    useEffect(()=>{
        if(inputOptions){
            setInputValues([...inputOptions])
        }
    },[inputOptions])

    const onSelectButton = (value) =>{
        const allOptionValues = inputValues.map((inputValue)=>{
            inputValue.value === value ? inputValue.isSelected = true : inputValue.isSelected = false;
            return inputValue
        })
        setInputValues([...allOptionValues]);
    }
    
    return(
        <>
            <AppText>{text}</AppText>
                <ScrollView horizontal={true} style={styles.scrollViewStyle}>
                    {
                        inputValues.map((inputValue)=>{
                            return(
                                <TouchableOpacity key={inputValue.value} onPress={()=>{
                                    onSelectButton(inputValue.value);
                                    onButtonSelect(inputValue.value);
                                }}>
                                    <View style={inputValue.isSelected ? styles.buttonSelectedStyle : styles.buttonUnselectedStyle}>
                                        <AppText style={{color:inputValue.isSelected ? 'white' :'#1890ff'}}>{inputValue.label}</AppText>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                   
                </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollViewStyle:{
        width:'100%',
        height:50,
        marginLeft:-10
    },
    buttonUnselectedStyle:{
        height:35,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:5,
        minWidth:100,
        margin:10,
        padding:5,
        borderColor:'#1890ff'
    },
    buttonSelectedStyle:{
        height:35,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:5,
        minWidth:100,
        margin:10,
        borderColor:'#1890ff',
        backgroundColor:'#1890ff'
    }
})

export default AppInputOptions;