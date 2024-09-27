import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button,Platform,Image, ScrollView, PermissionsAndroid, ActivityIndicator, ToastAndroid } from 'react-native';
import MasterLayout from '../components/MasterLayout';
import AppCard from '../components/AppCard';
import AppText from '../components/AppText';
import AppTextBold from '../components/AppTextBold';
import AppPicklist from '../components/AppPicklist';
import AppInput from '../components/AppInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButton from '../components/AppButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Marker, { Position, ImageFormat,TextBackgroundType} from 'react-native-image-marker';
import RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';
import DependentPicklist from '../components/AppDependentPicklist';
import Geolocation from '@react-native-community/geolocation';
import { callAPI } from '../common/api';
import AppMessage from '../components/AppMessage';

const CreateEditRecords = ({route,navigation}) => {
  
  const [isEditMode,setIsEditMode] = useState(false);
  const [location,setLocation] = useState('');
  const [workDetails,setWorkDetails] = useState('');
  const [inaugurationDate,setInaugurationDate] = useState('');
  const [completedDate,setCompletedDate] = useState('');
  const [inaugurationPhoto,setInaugurationPhoto] = useState('');
  const [completedDatePhoto,setCompletedPhoto] = useState('');
  const [showInaugurationDatePicker,setShowInaugurationDatePicker] = useState(false);
  const [showCompletedDatePicker,setShowCompletedDatePicker] = useState(false);
  const [latLongLoader,setLatLongLoader] = useState(false); 
  const [isLoading,setIsLoading] = useState(false);
  const [isImageLoading,setIsImageLoading]= useState(false);
  const [longitude,setLongitude] = useState(null);
  const [latitude,setLatitude] = useState(null);
  const [district,setDistrict] = useState('');
  const [taluka,setTaluka] = useState('');
  const [village,setVillage] = useState('');
  const [error,setError] = useState('')

  useFocusEffect(
    React.useCallback(()=>{
      console.log(route?.params?.record)
      if(route?.params?.record){
        const { DISTRICT, LONGITUDE, LATITUDE, TALUKA, VILLAGE, LOCATION, WORK_NAME, Inauguration_PHOTO1, COMPLETED_PHOTO1, COMPLETED_DATE, Inauguration_DATE } = route?.params?.record
        setIsEditMode(true);
        setDistrict(DISTRICT);
        setTaluka(TALUKA);
        setVillage(VILLAGE);
        setLocation(LOCATION);
        setWorkDetails(WORK_NAME);
        setLongitude(LONGITUDE);
        setLatitude(LATITUDE);
        setCompletedDate(COMPLETED_DATE ? COMPLETED_DATE: '');
        setInaugurationDate(Inauguration_DATE ? Inauguration_DATE.split('T')[0]: '');
        setInaugurationPhoto(Inauguration_PHOTO1 ? Inauguration_PHOTO1.split('T')[0] : null);
        setCompletedPhoto(COMPLETED_PHOTO1 ? COMPLETED_PHOTO1 : null)
      }
    },[route])  
  )



  const onInaugurationDateFocus = (isShow) => {
    setShowInaugurationDatePicker(isShow)
  }

  const onCompletedDateFocus = (isShow) => {
    setShowCompletedDatePicker(isShow)
  }

  const onInaugurationDateSelect = (date) => {
      const selectedInaugurationDate = new Date(date.nativeEvent.timestamp).toLocaleDateString('en-GB');
      setShowInaugurationDatePicker(false)
      setInaugurationDate(selectedInaugurationDate);
  }

  const onCompletedDateSelect = (date) => {
    const selectedCompletedDate = new Date(date.nativeEvent.timestamp).toLocaleDateString('en-GB');
    setShowCompletedDatePicker(false)
    setCompletedDate(selectedCompletedDate);
  }

  const pickImageFromCamera = () => {
    launchCamera({mediaType: 'photo', saveToPhotos: true}, async (response) => {
      if (response.assets && response.assets[0]) {
          let imageUri = response.assets[0].uri;
          addTextToImage(imageUri);
        }
      }
    );
  }

  const requestLocationPermission = async () => {
    try {
      setLatLongLoader(true);
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
          getCurrentLocation();
        } else {
          console.log("Location permission denied");
        }
      } else {
        // For iOS, permission is requested automatically when you access Geolocation
        getCurrentLocation();
      }
    } catch (err) {
      setLatLongLoader(false);
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        ToastAndroid.show('Latitude & Longitude Captured',ToastAndroid.SHORT);
        setLatLongLoader(false);
      },
      (error) => {
        setLatLongLoader(false);
        // Handle error in getting location
        //Alert.alert('Error', 'Unable to fetch location. Please try again.');
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      }
    );
  };

  const addTextToImage = async (imageUri) => {
    try {
      setIsImageLoading(true);
      const markRes = await Marker.markText({
        backgroundImage: {
          src: imageUri,
          scale: 1,
        },
        watermarkTexts: [
          {
            text: `Address : ${location.length > 0 ? location : 'No Location Given'} \n Work Details : ${workDetails.length > 0 ? workDetails : 'Work Details Not Given'} \n Lat : ${latitude ? latitude : 0} \n Long : ${longitude ? longitude : 0}`,
            position: {
              position: Position.bottomLeft,
            },
            style: {
              color: '#ffffff',
              fontSize: 80,
              shadowStyle: {
                dx: 1,
                dy: 1,
                radius: 10,
                color: '#000000',
              },
              textBackgroundStyle: {
                padding: 10, // Adjust padding as necessary
                type: TextBackgroundType.stretchX, // Use solid for a background
                color: '#28323e', // Black background with opacity
              }
            },
          },
        ],
        scale: 1,
        quality: 100,
        saveFormat: ImageFormat.base64,
      });
      setIsImageLoading(false);
      setInaugurationPhoto(markRes); // Update the marked image URI
    } catch (error) {
      setIsImageLoading(false);
      console.log('Error marking image:', error);
    }
  };

  const onEditClick = () =>{
    try{

    }
    catch(error){

    }
  }

  const onCreateRecordClick = async () =>{
    try{
      setIsLoading(true);
      const payload = {
        DISTRICT:district,
        TALUKA:taluka,
        VILLAGE:village,
        LOCATION:location,
        WORK_NAME:workDetails,
        LONGITUDE:longitude ? longitude : 0,
        LATITUDE:latitude ? latitude : 0,
        Inauguration_DATE:inaugurationDate ? `${inaugurationDate.split('/')[2]}-${inaugurationDate.split('/')[1]}-${inaugurationDate.split('/')[0]}` : '',
      }

      payload.Inauguration_PHOTO1 = inaugurationPhoto;
      if(!inaugurationPhoto){
        setError('Inauguration Photo is needed');
      }
      
      // if(!inaugurationPhoto.includes('https') && inaugurationPhoto.length > 0){
      //   payload.Inauguration_PHOTO1 = inaugurationPhoto
      // }

      // if(!completedDatePhoto.includes('https') && completedDatePhoto.length > 0){
      //   payload.COMPLETED_PHOTO1 = completedDatePhoto;
      // }

      const response = await callAPI('https://rainwaterharvesting-backend.onrender.com/createRecords','POST',payload);
      setError('');
      setIsLoading(false);
      ToastAndroid.show('Record Created Successfully',ToastAndroid.SHORT);
      console.log(response);
    }
    catch(error){
      setIsLoading(false);
      setError(error.message)
      console.log(error.message);
    }
  }

  const onSetDependentPicklistValue = (selectedPicklistValues) =>{
    console.log(selectedPicklistValues);
    setDistrict(selectedPicklistValues.district);
    setTaluka(selectedPicklistValues.taluka);
    setVillage(selectedPicklistValues.village);
  }

  return (
    <MasterLayout style={styles.masterLayout}>
      {error ? 
        <AppMessage message={error}/>
        : 
        null  
      }
      <ScrollView>
        <AppCard style={styles.cardStyle}>
          <AppTextBold>{isEditMode ? 'Edit Record' : 'Create Record'}</AppTextBold>
          {
            isEditMode ? 
              <>
                <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                      <View style={{width:'50%'}}>
                        <AppText>District</AppText>
                        <AppTextBold>{route?.params?.record.DISTRICT}</AppTextBold>
                      </View>

                      <View style={{width:'50%'}}>
                        <AppText>Taluka</AppText>
                        <AppTextBold>{route?.params?.record.TALUKA}</AppTextBold>
                      </View>
                    </View>
                    <View style={{width:'100%',marginTop:10}}>
                        <AppText>Village</AppText>
                        <AppTextBold>{route?.params?.record.VILLAGE}</AppTextBold>
                    </View>
                </>
                :
                <DependentPicklist onSetDependentPicklistValue={onSetDependentPicklistValue}/>
            }
            <View style={{marginTop:15}}>
              <AppText>Address</AppText>
              <AppInput  style={{borderColor:'black'}} onTextChange={(e)=>setLocation(e)} placeholderText='Enter Address' value={location} />
            </View>

            <View style={{marginTop:15}}>
              <AppText>Work Details</AppText>
              <AppInput  style={{borderColor:'black'}} onTextChange={(e)=>setWorkDetails(e)} placeholderText='Enter Work Details' value={workDetails} />
            </View>

            <View style={{width:'100%',justifyContent:'space-between'}}>
              <View style={{marginTop:15}}>
                <AppText>Inauguration Date</AppText>
                <AppInput style={{borderColor:'black'}} onTextChange={()=>{}} onSelect={()=>onInaugurationDateFocus(true)} placeholderText='Select Inauguration Date' onFocusEnd={()=>onInaugurationDateFocus(false)} value={inaugurationDate} />
              </View>

              <View style={{marginTop:15}}>
                <AppText>Completed Date</AppText>
                <AppInput style={{borderColor:'black'}} onTextChange={()=>{}} onSelect={()=>onCompletedDateFocus(true)} placeholderText='Select Completion Date' onFocusEnd={()=>onCompletedDateFocus(false)} value={completedDate} />
              </View>
            
            {
              showInaugurationDatePicker ?
              <DateTimePicker onChange={onInaugurationDateSelect} value={new Date()}/> 
              : 
              null
            }
            {
              showCompletedDatePicker ?
              <DateTimePicker onChange={onCompletedDateSelect} value={new Date()}/> 
              : 
              null
            }
          </View>
          
          <View style={{width:'100%'}}>
              {
                !latLongLoader ? 
                <View style={{marginTop:15}}>
                  <AppText>Update Location</AppText>
                  <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                    <AppButton buttonStyle={{width:150,height:30}} icon='map' iconSize={20} iconColor='white' text='Capture Location' onPressButton={requestLocationPermission} />
                  </View>
                </View>
                :
                <View style={{width:'100%',alignItems:'flex-start',marginTop:25}}> 
                    <ActivityIndicator size={24}/>
                </View>
              }
              
          </View>
              
          <View style={{width:'100%'}}>
              <View style={{marginTop:15}}>
                <AppText>Inauguration Photo</AppText>
                <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                  <AppButton buttonStyle={{width:'35%',height:30}} icon='camera' iconSize={20} iconColor='white' text='Take Image' onPressButton={pickImageFromCamera} />
                </View>
              </View>
          </View>

          {
          isImageLoading ?
            <ActivityIndicator size={24}/>
          :
          inaugurationPhoto && (
            <View style={{width:'100%'}}>
                <Image
                  source={{uri: inaugurationPhoto}}
                  style={styles.image}
                />
              </View>
            )
          }

          {
            isEditMode ? 
            
            <View style={{width:'100%'}}>
                  <View style={{marginTop:15}}>
                    <AppText>Completed Photo</AppText>
                    <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                      <AppButton buttonStyle={{width:'35%',height:30}} icon='camera' iconSize={20} iconColor='white' text='Take Image' onPressButton={pickImageFromCamera} />
                      {/* <AppButton buttonStyle={{width:'35%',marginLeft:10,height:30}} icon='file-tray' iconSize={20} iconColor='white' text='Choose Image' onPressButton={pickImageFromLibrary} /> */}
                      {
                        completedDatePhoto ? 
                        <AppButton buttonStyle={{width:'20%',marginLeft:10,height:30}} iconStyle={{marginLeft:15}} icon='eye' iconSize={20} iconColor='white' onPressButton={pickImageFromCamera} />
                          :
                          null
                      }
                    </View>
                  </View>
              </View>
            : null
          }

          <View style={{width:'100%',alignItems:'center',marginVertical:25}}>
            {
              isLoading ? 
                <ActivityIndicator size={24}/>
              : 
              <AppButton buttonStyle={{width:'50%'}} onPressButton={()=> isEditMode ? onEditClick() : onCreateRecordClick()} text={`${isEditMode ? 'Edit Record' : 'Create Record'}`}/>
            }
          </View>  
          
        </AppCard>
      </ScrollView>
      
    </MasterLayout>
  );
}

const styles = StyleSheet.create({
  masterLayout:{
    justifyContent:'flex-start',
    padding:10
  },
  cardStyle:{
    width:'100%'
  },

  image: {
    width: '100%',
    height: 450,
    marginTop: 20,
    objectFit:'fill'
  },
});


export default CreateEditRecords;