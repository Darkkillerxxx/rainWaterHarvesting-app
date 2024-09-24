import React,{useEffect, useState} from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppTextBold from '../components/AppTextBold';
import AppText from '../components/AppText';
import MasterLayout from '../components/MasterLayout'
import {Picker} from '@react-native-picker/picker';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { callAPI } from '../common/api';

const Login = () => {
  const [district,setDistrict] = useState('');
  const [districtPicklistValues,setDistrictPicklistValues] = useState([]);
  const [taluka,setTaluka] = useState('');
  const [talukaPicklistValues,setTalukaPicklistValues] = useState([]);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);

  const { loading, data } = useSelector((state) => {
    return state.data
  });

  useEffect(()=>{
    if(!loading && data.data.length > 0){
        const districtPicklistValuesSet = [...new Set(data.data.map((value) => value.DISTRICT.trim().toUpperCase()))]
        setDistrictPicklistValues(districtPicklistValuesSet);    
      }
  },[data])

  const onSelectDistrict = (selectedDistrict) =>{
    if(selectedDistrict && selectedDistrict.length > 0){
        setDistrict(selectedDistrict);
        const filteredTalukaPicklistValues = data.data.filter((value) => value.DISTRICT.trim().toUpperCase() === selectedDistrict);
        const talukaPicklistvaluesSet =  [...new Set(filteredTalukaPicklistValues.map((value) => value.TALUKA.trim().toUpperCase()))];
        setTalukaPicklistValues([...talukaPicklistvaluesSet]);
      }
  }

  const onLogInClick = async() =>{
    try{
        setError(null);
        const apiResponse = await callAPI('https://rainwaterharvesting-backend.onrender.com/login','POST',{
          username:username,
          password:password,
          taluka:taluka,
          district:district
        }
      )
      console.log(49,apiResponse.data);
      if(apiResponse.data.code != 200){
        setError(apiResponse.data.message);
        return
      }
    }catch(error){
      throw error
    }
  }

  return (
    <MasterLayout style={styles.container}>
        
          {
          error ? 
            <View style={{width:'100%',height:50,backgroundColor:'#ed4356',justifyContent:'center',padding:10,borderRadius:10}}>
              <AppText style={{color:'white'}}>{error}</AppText>
            </View>
          : 
          null
          }
        
        <ScrollView style={{padding:10}}>
        <Image style={{height:150,width:150,marginVertical:15}} source={require('../assets/Images/logo.jpeg')}/>
        <AppTextBold style={{fontSize:20}}>Login or Sign Up to Jal Shakti</AppTextBold>
        
        <AppText style={{marginTop:20}}>Select District</AppText>
        <View style={{width:'100%',borderWidth:1,height:50,borderRadius:10,marginTop:10}}>  
          <Picker
            selectedValue={district}
            style={{width:'100%',height:20}}
            onValueChange={(itemValue) =>
              onSelectDistrict(itemValue)
            }>
            <Picker.Item label="None" value='' />
            {districtPicklistValues.map((value,index)=>{
              return (
                <Picker.Item key={index} label={value} value={value} />
              )
            })}
          </Picker>
        </View>

        <AppText style={{marginTop:20}}>Select Taluka</AppText>
        <View style={{width:'100%',borderWidth:1,height:50,borderRadius:10,marginTop:10}}>  
          <Picker
            selectedValue={taluka}
            style={{width:'100%',height:20}}
            onValueChange={(itemValue) =>
              setTaluka(itemValue)
            }>
            <Picker.Item label="None" value="" />
            {talukaPicklistValues.map((value,index)=>{
              return (
                <Picker.Item key={index} label={value} value={value} />
              )
            })}
          </Picker>
        </View>
        
        <View style={{width:'100%',marginTop:20}}>
          <AppText>Enter Username</AppText>
          <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setUsername(e)} placeholderText={"Username"} />
        </View>

        <View style={{width:'100%',marginTop:20}}>
          <AppText>Enter Password</AppText>
          <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setPassword(e)} placeholderText={"Password"} isSecured={true} />
        </View>

        <AppButton text='Log In' onPressButton={()=> onLogInClick()} buttonStyle={{width:'100%',marginTop:25}}/>
        </ScrollView>
    </MasterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding:10
  },
});


export default Login;