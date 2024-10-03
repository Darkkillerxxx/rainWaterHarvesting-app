import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Button,Platform,Image, ScrollView, PermissionsAndroid, ActivityIndicator, ToastAndroid } from 'react-native';
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
import { useFocusEffect } from '@react-navigation/native';
import DependentPicklist from '../components/AppDependentPicklist';
import Geolocation from '@react-native-community/geolocation';
import { callAPI } from '../common/api';
import AppMessage from '../components/AppMessage';
import { useSelector } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';

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
  const [isInaugurationImageLoading,setInaugurationIsImageLoading]= useState(false);
  const [isCompletedImageLoading,setCompletedIsImageLoading]= useState(false);
  const [recordId,setRecordId] = useState(null);
  const [isRecordAuthorized,setIsRecordAuthorized] = useState(false)
  const [implementationAuthority,setImplementationAuthority] = useState('')

  const [longitude,setLongitude] = useState(null);
  const [latitude,setLatitude] = useState(null);
  const [district,setDistrict] = useState('');
  const [taluka,setTaluka] = useState('');
  const [village,setVillage] = useState('');
  const [error,setError] = useState('');

  
  const { userDetails } = useSelector((state)=>{
    return state.userDetails;
  })

  useFocusEffect(
    React.useCallback(()=>{
      console.log(54,route?.params?.record)
      if(route?.params?.record){
        const {ID, DISTRICT, LONGITUDE, LATITUDE, TALUKA, VILLAGE, LOCATION, WORK_NAME, Inauguration_PHOTO1, COMPLETED_PHOTO1, COMPLETED_DATE, Inauguration_DATE, IS_AUTH, IMPLIMANTATION_AUTHORITY } = route?.params?.record;
        
        setIsEditMode(true);
        setDistrict(DISTRICT);
        setTaluka(TALUKA);
        setVillage(VILLAGE);
        setLocation(LOCATION);
        setWorkDetails(WORK_NAME);
        setLongitude(LONGITUDE);
        setLatitude(LATITUDE);
        setRecordId(ID);
        setCompletedDate(COMPLETED_DATE ? COMPLETED_DATE.split('T')[0]: '');
        setInaugurationDate(Inauguration_DATE ? Inauguration_DATE.split('T')[0]: '');
        setInaugurationPhoto(Inauguration_PHOTO1 ? Inauguration_PHOTO1.split('T')[0] : null);
        setIsRecordAuthorized(IS_AUTH ? true : false)
        setImplementationAuthority(IMPLIMANTATION_AUTHORITY);

        console.log(61,COMPLETED_PHOTO1,IS_AUTH);
        
        setCompletedPhoto(COMPLETED_PHOTO1 ? COMPLETED_PHOTO1 : null);
      }
      else{
        setIsEditMode(false);
        setDistrict(null);
        setTaluka(null);
        setVillage('');
        setLocation('');
        setWorkDetails('');
        setLongitude('');
        setLatitude('');
        setRecordId('');
        setCompletedDate('');
        setInaugurationDate('');
        setInaugurationPhoto(null); 
        setCompletedPhoto(null);
        setIsRecordAuthorized(false);
        setImplementationAuthority('');
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

  const pickImageFromCamera = (photoType) => {
    launchCamera({mediaType: 'photo', saveToPhotos: true}, async (response) => {
      if (response.assets && response.assets[0]) {
          let imageUri = response.assets[0].uri;
          addTextToImage(imageUri,photoType);
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
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      }
    );
  };

  const addTextToImage = async (imageUri,photoType) => {
    try {

      photoType === 'Inauguration' ? setInaugurationIsImageLoading(true) : setCompletedIsImageLoading(true);

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

      photoType === 'Inauguration' ? setInaugurationIsImageLoading(false) : setCompletedIsImageLoading(false)
      photoType === 'Inauguration' ? setInaugurationPhoto(markRes) : setCompletedPhoto(markRes)      
    } catch (error) {
      photoType === 'Inauguration' ? setInaugurationIsImageLoading(false) : setCompletedIsImageLoading(false);
      console.log('Error marking image:', error);
    }
  };

  const onEditClick = async () =>{
    try{
      setIsLoading(true);
      setError('');
      console.log(230,userDetails.userType,isRecordAuthorized)
      if(userDetails.userType != 1 && isRecordAuthorized){
        setError('This record is authorised by the Admin so cannot be eddited');
        return;
      }
      const payload = {
        ID:recordId,
        DISTRICT:district,
        TALUKA:taluka,
        VILLAGE:village,
        LOCATION:location,
        WORK_NAME:workDetails,
        LONGITUDE:longitude ? longitude : 0,
        LATITUDE:latitude ? latitude : 0,
        Inauguration_DATE:inaugurationDate ? inaugurationDate.includes('/') ? `${inaugurationDate.split('/')[2]}-${inaugurationDate.split('/')[1]}-${inaugurationDate.split('/')[0]}` : inaugurationDate : '',
        COMPLETED_DATE:completedDate ? `${completedDate.split('/')[2]}-${completedDate.split('/')[1]}-${completedDate.split('/')[0]}` : '',
        IS_AUTH:isRecordAuthorized ? 1 : 0,
        IMPLIMANTATION_AUTHORITY:implementationAuthority
      }

      console.log(payload);

      if(!inaugurationPhoto?.includes('http') && !inaugurationPhoto?.includes('https') && inaugurationPhoto?.length > 0){
        payload.inaugurationPhotoBase64 = inaugurationPhoto;
      }

      if(!completedDatePhoto?.includes('http') && !completedDatePhoto?.includes('https') && completedDatePhoto?.length > 0){
        payload.completionPhotoBase64 = completedDatePhoto;
      }

      const response = await  callAPI('https://rainwaterharvesting-backend.onrender.com/updateRecords','POST',payload);

      if(response && response.status != 200){
        console.log(response);
        setError('Something went wrong');
        setIsLoading(false);
        return;
      }

      setError('');
      setIsLoading(false);
      ToastAndroid.show('Record Edited Successfully',ToastAndroid.SHORT);
      console.log(229,response);
    }
    catch(error){
      setError(error.message);
      console.log(error);
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
      if(inaugurationDate.length > 0 && !inaugurationPhoto){
        setError('Inauguration Photo is needed');
      }
      
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

  const resetImage = async(recordType) =>{
    try{
      setError('');
      const response = await callAPI(`https://rainwaterharvesting-backend.onrender.com/resetImage`,'POST',{recordId:recordId,type:recordType});
      if(response?.data?.code != 200){
        setError('Something went wrong');
        return
      }
      ToastAndroid.show('Image Deleted Successfully',ToastAndroid.SHORT);
      recordType ? setInaugurationPhoto(null) : setCompletedPhoto(null);
    }catch(error){
      setError(error.message);
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
                {
                    isEditMode ? 
                      <AppTextBold>{location}</AppTextBold>
                      :
                      <AppInput  style={{borderColor:'black'}} onTextChange={(e)=>setLocation(e)} placeholderText='Enter Address' value={location} />
                }

            </View>

            <View style={{marginTop:15}}>
              <AppText>Work Details</AppText>
              {
                isEditMode ?
                  <AppTextBold>{workDetails}</AppTextBold>
                  :
                  <AppInput  style={{borderColor:'black'}} onTextChange={(e)=>setWorkDetails(e)} placeholderText='Enter Work Details' value={workDetails} />
              }
            </View>

            <View style={{marginTop:15}}>
              <AppText>Implementation Authority</AppText>
              {
                isEditMode ? 
                  <AppTextBold>{implementationAuthority}</AppTextBold>
                  :
                  <AppInput  style={{borderColor:'black'}} onTextChange={(e)=>setImplementationAuthority(e)} placeholderText='Enter Implementation Authority' value={implementationAuthority} />
              }
            </View>

            <View style={{width:'100%',justifyContent:'space-between'}}>
              <View style={{marginTop:15}}>
                <AppText>Start Work Date</AppText>
                {
                  userDetails ?
                    <AppInput style={{borderColor:'black'}} onTextChange={()=>{}} onSelect={()=>onInaugurationDateFocus(true)} placeholderText='Select Inauguration Date' onFocusEnd={()=>onInaugurationDateFocus(false)} value={inaugurationDate} />
                  :
                  <AppTextBold>{inaugurationDate}</AppTextBold>
                }
              </View>

              {
                userDetails ?
                  <View style={{width:'100%'}}>
                      <View style={{marginTop:15}}>
                        <AppText>Start Work Photo</AppText>
                        <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                          <AppButton buttonStyle={{width:'35%',height:30}} icon='camera' iconSize={20} iconColor='white' text='Take Image' onPressButton={()=>pickImageFromCamera('Inauguration')} />
                            {
                              userDetails.userType === 1 && isEditMode ?
                                <AppButton buttonStyle={{width:'35%',height:30,marginLeft:10}} icon='trash-bin' iconSize={18} iconColor='white' text='Delete Image' onPressButton={()=> resetImage(1)} />
                              : 
                              null
                            }
                        </View>
                      </View>
                  </View>  
                : 
                
                null
              }
              
              {
                  isInaugurationImageLoading ?
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
              <>
            <View style={{marginTop:15}}>
                <AppText>Completed Date</AppText>
                {
                  userDetails ? 
                  <AppInput style={{borderColor:'black'}} onTextChange={()=>{}} onSelect={()=>onCompletedDateFocus(true)} placeholderText='Select Completion Date' onFocusEnd={()=>onCompletedDateFocus(false)} value={completedDate} />
                  :
                  <AppTextBold>{completedDate}</AppTextBold>
                }
            </View>

            {
              userDetails ? 
              <View style={{width:'100%'}}>
                <View style={{marginTop:15}}>
                  <AppText>Completed Photo</AppText>
                  <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                    <AppButton buttonStyle={{width:'35%',height:30}} icon='camera' iconSize={20} iconColor='white' text='Take Image' onPressButton={()=> pickImageFromCamera('Completion')} />
                    {
                      userDetails.type === 1 && isEditMode ? 
                        <AppButton buttonStyle={{width:'35%',height:30,marginLeft:10}} icon='trash-bin' iconSize={18} iconColor='white' text='Delete Image' onPressButton={()=> resetImage(0)} />
                        :
                        null
                    }
                  </View>
                </View>
            </View>           
              :
              null
            }
   

                {
                isCompletedImageLoading ?
                  <ActivityIndicator size={24}/>
                :
                  completedDatePhoto && (
                  <View style={{width:'100%'}}>
                      <Image
                        source={{uri: completedDatePhoto}}
                        style={styles.image}
                      />
                    </View>
                  )
                }
                </>
                :
              null
            }
             
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

          {
            userDetails ?
              
              <View style={{width:'100%'}}>
              {
                !latLongLoader ? 
                <View style={{marginTop:15}}>
                  <AppText>Update Location</AppText>
                  <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                    <AppButton buttonStyle={{width:150,height:30}} icon='map' iconSize={20} iconColor='white' text='Capture Location' onPressButton={requestLocationPermission} />
                  </View>
                  {
                    <>
                    {console.log(latitude,longitude)}
                  { 
                  
                    latitude && longitude ?
                      <>
                        <AppText>Latitude : {`${latitude}`}</AppText>
                        <AppText>Longitude : {`${longitude}`}</AppText>
                      </>
                      
                    :
                    null}
                    </>
                  }

                </View>
                :
                <View style={{width:'100%',alignItems:'flex-start',marginTop:25}}> 
                    <ActivityIndicator size={24}/>
                </View>
              }
            </View> : null
          }

          {
            isEditMode && userDetails.userType === 1 ?
            
            <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:25}}>
              <CheckBox
                value={isRecordAuthorized}
                onValueChange={()=> setIsRecordAuthorized(!isRecordAuthorized)}
              />
              <AppText>Authorize this Record</AppText>
            </View> : null
          }
          
          
          {
           userDetails ? 
            <View style={{width:'100%',alignItems:'center',marginVertical:25}}>
              {
                isLoading ? 
                  <ActivityIndicator size={24}/>
                : 
                <AppButton buttonStyle={{width:'50%'}} onPressButton={()=> isEditMode ? onEditClick() : onCreateRecordClick()} text={`${isEditMode ? 'Submit' : 'Create Record'}`}/>
              }
          </View> 
           :
           null 
          }
          
          
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