import React,{useEffect, useState} from 'react';
import { Image, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
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

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [district,setDistrict] = useState('');
  const [districtPicklistValues,setDistrictPicklistValues] = useState([]);
  const [taluka,setTaluka] = useState('');
  const [talukaPicklistValues,setTalukaPicklistValues] = useState([]);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
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

  const onLogInClick = async() =>{
    setIsLoading(true);
    try{
        setError(null);
        const apiResponse = await callAPI('https://rainwaterharvesting-backend.onrender.com/login','POST',{
          username:username,
          password:password
        }
      )
      if(apiResponse.data.code != 200){
        setError(apiResponse.data.message);
        setIsLoading(false);
        return
      }

      console.log(56,apiResponse.data);
      
      const userDetails = {
        username,
        district:apiResponse.data.userData.DISTRICT,
        taluka:apiResponse.data.userData.TALUKA,
        userType : apiResponse.data.userData.DISTRICT && apiResponse.data.userData.DISTRICT.length > 0 ? apiResponse.data.userData.TALUKA && apiResponse.data.userData.TALUKA.length > 0 ? 3 : 2 : 1
      }
      // Navigate to Dashboard logic and store user info in Redux Logic
      dispatch(storeUserDetails(userDetails));
      navigation.navigate('Dashboard');
      
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

  return (
    <MasterLayout style={styles.container}>
        
          {
          error ? 
            <AppMessage message={error}/>
          : 
          null
          }
        
        <View style={{padding:10,width:'100%',alignItems:'center'}}>
          <Image style={{height:150,width:150,marginVertical:15}} source={require('../assets/Images/logo.jpeg')}/>
          <AppTextBold style={{fontSize:20}}>Login or Sign Up to Jal Shakti</AppTextBold>
          
          <View style={{width:'100%',marginTop:20}}>
            <AppText>Enter Username</AppText>
            <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setUsername(e)} placeholderText={"Username"} />
          </View>

          <View style={{width:'100%',marginTop:20}}>
            <AppText>Enter Password</AppText>
            <AppInput style={{borderColor:'black',borderRadius:10}} onTextChange={(e) => setPassword(e)} placeholderText={"Password"} isSecured={true} />
          </View>

        {
          isLoading ? 
          <ActivityIndicator style={{marginTop:25}} size="large" color="#1890ff" />
          :
          <AppButton text='Log In' onPressButton={()=> onLogInClick()} buttonStyle={{width:'100%',marginTop:25}}/>
        }

        </View>
    </MasterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding:10
  },
});


export default Login;