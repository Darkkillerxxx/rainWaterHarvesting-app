import React,{useEffect, useState} from 'react';
import { Image, ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ToastAndroid } from 'react-native';
import AppTextBold from '../components/AppTextBold';
import AppText from '../components/AppText';
import MasterLayout from '../components/MasterLayout'
import {Picker} from '@react-native-picker/picker';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { callAPI } from '../common/api';
import { useDispatch } from 'react-redux';
import { storeUserDetails } from '../features/userDetails';
import AppPicklist  from '../components/AppPicklist';
import AppMessage from '../components/AppMessage';
import AppInputOptions from '../components/AppInputOptions';
import { registerOptionValues } from '../common/registerOptionValues';

const Register = ({navigation}) => {
  const dispatch = useDispatch();

  const [district,setDistrict] = useState('');
  const [districtPicklistValues,setDistrictPicklistValues] = useState([]);
  const [taluka,setTaluka] = useState('');
  const [talukaPicklistValues,setTalukaPicklistValues] = useState([]);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [reEnteredPassword,setReEnteredPassword] = useState('');
  const [userType,setUserType] = useState(1);
  const [email,setEmail] = useState('');
  const [error,setError] = useState(null);
  const [isLoading,setIsLoading] = useState(false);

  const { loading, data } = useSelector((state) => {
    return state.data
  });

  useEffect(()=>{
    if(!loading && data.data.length > 0){
        const districtPicklistValuesSet = [...new Set(data.data.map((value) => value.DISTRICT.trim().toUpperCase()))]
        setDistrictPicklistValues(districtPicklistValuesSet);    
      }
  },[data])

  const onRegisterClick = async() =>{

    if((userType === 2 || userType === 3) && district.length === 0){
      setError('District Needs to be Provided');
      return
    }

    if(userType === 3 && taluka.length === 0){
      setError('Taluka Needs to be Provided');
      return
    }

    if(username.length === 0){
      setError('Username is Needed');
      return
    }

    if(password != reEnteredPassword){
      setError('Passwords Do Not Match');
      return
    }
    if(password.length === 0){
      setError('Password Need to be set');
      return
    }
 
    if(email.length === 0){
      setError('Email is Needed');
      return
    }

    

    setIsLoading(true);

    try{
        setError(null);
        const apiResponse = await callAPI('https://rainwaterharvesting-backend.onrender.com/register','POST',{
          username,
          password,
          taluka:taluka.length > 0 ? taluka : null,
          district:district.length > 0 ? district : null,
          userType,
          isActive:true,
          isAdmin: userType === 1 ? true : false,
          email
        }
      )
      if(apiResponse.data.code != 200){
        setError(apiResponse.data.message);
        setIsLoading(false);
        return
      }
      ToastAndroid.show('User Sucessfully Created !!!',ToastAndroid.SHORT);
      setIsLoading(false);
    }catch(error){
      setIsLoading(false);
      throw error
    }
  }

  const onPicklistValueChange = (identifier,selectedValue) =>{
    console.log(identifier,selectedValue)
    switch(identifier){
      case 'District':
        if(selectedValue && selectedValue.length > 0){
          setDistrict(selectedValue);
          const filteredTalukaPicklistValues = data.data.filter((value) => value.DISTRICT.trim().toUpperCase() === selectedValue);
          const talukaPicklistvaluesSet =  [...new Set(filteredTalukaPicklistValues.map((value) => value.TALUKA.trim().toUpperCase()))];
          setTalukaPicklistValues([...talukaPicklistvaluesSet]);
        }
        break;
      case 'Taluka':
        setTaluka(selectedValue)
        break
      default:
        break
    }
  }

  const onSelectUserType = (value) =>{
    setUserType(value);
  }

  return (
    <MasterLayout style={styles.container}>
        
          {
          error ? 
            <AppMessage message={error}/>
          : 
          null
          }
        
        <ScrollView style={{padding:10}}>
        <AppTextBold style={{fontSize:20,marginBottom:20}}>Add Users for Jal Shakti Abhiyaan</AppTextBold>
        
        <AppInputOptions text="Select User Type" inputOptions={registerOptionValues} onButtonSelect={onSelectUserType} />

        {
          userType === 2 || userType === 3 ? 
            <AppPicklist selectedValue={district} identifier="District" label='Select District' picklistValues={districtPicklistValues} onChangeValue={onPicklistValueChange}/>
          :
          null
        }

        {
            userType === 3 ?
            <AppPicklist selectedValue={taluka} identifier="Taluka" label='Select Taluka' picklistValues={talukaPicklistValues} onChangeValue={onPicklistValueChange}/>
            :
            null
        }

        
        <View style={{width:'100%',marginTop:20}}>
          <AppText>Enter Username</AppText>
          <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setUsername(e)} placeholderText={"Username"} />
        </View>

        <View style={{width:'100%',marginTop:20}}>
          <AppText>Enter Password</AppText>
          <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setPassword(e)} placeholderText={"Password"} isSecured={true} />
        </View>

        <View style={{width:'100%',marginTop:20}}>
          <AppText>Re-Enter Password</AppText>
          <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setReEnteredPassword(e)} placeholderText={"Re-Password"} isSecured={true} />
        </View>

        <View style={{width:'100%',marginTop:20}}>
          <AppText>Enter Email</AppText>
          <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setEmail(e)} placeholderText={"Email"} isSecured={true} />
        </View>

        {
          isLoading ? 
          <ActivityIndicator style={{marginTop:25}} size="large" color="#1890ff" />
          :
          <AppButton text='Add User' onPressButton={()=> onRegisterClick()} buttonStyle={{width:'100%',marginTop:25}}/>
        }

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


export default Register;