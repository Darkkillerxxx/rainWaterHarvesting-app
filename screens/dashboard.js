import React,{ useEffect,useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import MasterLayout from '../components/MasterLayout';
import DashboardCards from '../components/DashboardCards';
import AppCard from '../components/AppCard';
import RNSpeedometer from 'react-native-speedometer'
import AppText from '../components/AppText';
import { ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPicklistValues } from '../features/getPicklistValuesSlice';
import Carousel from 'react-native-reanimated-carousel';
import {callAPI} from '../common/api';
import AppHeader from '../components/AppHeader';


const Dashboard = () => {

  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => {
    return state.data
  });

  const { userDetails } = useSelector((state)=>{
    return state.userDetails;
  })
  const [sliderImages,setSliderImages] = useState([]);
  const [districtValues,setDistrictValues] = useState([]);
  const [district,setDistrict] = useState('');
  const [dashboardValues,setDashboardValues] = useState(null);
  const [pieChartValues,setPieChartValues] = useState([])
  const width = Dimensions.get('window').width;

  const getSiderImages = async() =>{
    try{
      const response = await callAPI('https://rainwaterharvesting-backend.onrender.com/getSliderImages','GET',null);
      console.log(36,response.data);
      const filteredSliderImages = response.data.data.filter((files) => files.name.includes('.png') || files.name.includes('.jpg'));
      const sliderImages = filteredSliderImages?.map((image,index)=> {
        return {
          id:index,
          uri:`https://jalshakti.co.in/Sliders/${image.name}`
        }
      })
      setSliderImages([...sliderImages]);
    }
    catch(error){
      console.log(error)
    }
  }

  const onPicklistValuesChange = (selectedValue) =>{
    setDistrict(selectedValue);
  }

  const assignDistrictValues = () => {
    const districtPicklistValuesSet = [...new Set(data?.data?.map((value) => value.DISTRICT.trim().toUpperCase()))];
    setDistrictValues([...districtPicklistValuesSet]); 
  }

  const setDefaultDistrict = () =>{
      userDetails && (userDetails.userType === 2 || userDetails.userType === 3) ? setDistrict(userDetails.district) : setDistrict('')
  }

  const fetchData = async() =>{
    try{
      console.log(63,`https://rainwaterharvesting-backend.onrender.com/getDashboardValues?DISTRICT=${district}`)
      const response = await callAPI(`https://rainwaterharvesting-backend.onrender.com/getDashboardValues?DISTRICT=${district}`,'GET',null);
      if(response.data){
        console.log(response.data);
        setDashboardValues({...response.data});
        
        const pieData = response?.data?.pieChart?.map((res)=>{
          return (
            {value: res.count, color: getRandomColor(), text:res.count,pieText:res.TALUKA}
          )
        })

        setPieChartValues([...pieData])
      }
    }
    catch(eror){
      console.log(error)
    }    
  }

  useEffect(()=>{ 
      fetchData();
  },[district])


  useEffect(() => {
    dispatch(fetchPicklistValues());
    getSiderImages();
    assignDistrictValues();
    setDefaultDistrict();
  }, [dispatch]);

  const getRandomColor=()=> {
    // Generate random values for red, green, and blue within a limited range
    const r = Math.floor(Math.random() * 200); // Avoids values close to 255 (white)
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
  
    // Convert RGB to hexadecimal
    const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  
    // Check if the color is too close to black or white and regenerate if necessary
    if (color === '#000000' || color === '#FFFFFF') {
      return getRandomColor(); // Re-run if the generated color is black or white
    }
  
    return color;
  }

  return (
    <MasterLayout>  
      <AppHeader text='Dashboard' selectedValue={district} onChangeDistrict={onPicklistValuesChange} showPicklist={userDetails || userDetails?.userType === 1 ? false : true} districtValues={districtValues}/>
      <ScrollView>
        <View style={{width:'100%'}}>
            <Carousel
                loop
                width={width}
                height={width/2}
                autoPlay={true}
                data={sliderImages}
                scrollAnimationDuration={5000}
                onSnapToItem={(index) => {}}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                      {console.log(sliderImages[index].uri)}
                       <Image src={sliderImages[index].uri} style={{width:'100%',height:'100%',objectFit:'fill'}} />
                    </View>
                )}
            />
        </View>
        <ScrollView horizontal>
          <DashboardCards dashboardValues={dashboardValues}/>
        </ScrollView>
  
       <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
          <AppCard style={{height:200}}>
            <AppText style={{marginBottom:10}}>Start Work</AppText>
            <RNSpeedometer value={dashboardValues ? (dashboardValues.inaugrationCount / dashboardValues.totalTargetCount) * 100 : 0} size={150}/>
          </AppCard> 
          <AppCard style={{height:200}}>
            <AppText style={{marginBottom:10}}>Completion</AppText>
            <RNSpeedometer value={dashboardValues ? (dashboardValues.completionCount / dashboardValues.totalTargetCount) * 100 : 0} size={150}/>
          </AppCard> 
        </View>

        <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
          <AppCard style={{height:250,width:'100%',justifyContent:'space-around',flexDirection:'row',padding:20}}>
            <PieChart
              donut
              showText
              textColor="white"
              radius={100}
              textSize={10}
              textBackgroundRadius={15}
              data={pieChartValues}
            />

            <View style={styles.legendContainer}>
              <ScrollView>
                {pieChartValues?.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.pieText}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </AppCard>
        </View>
      </ScrollView>
    </MasterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flexDirection: 'row', // Aligns Pie Chart and Legend side by side
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieContainer: {
    paddingRight: 20, // Space between Pie Chart and Legend
  },
  legendContainer: {
    height:'100%',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between legend items
  },
  colorBox: {
    width: 15,
    height: 15,
    marginRight: 10, // Space between color box and text
  },
  legendText: {
    fontSize: 14,
  },
});


export default Dashboard;


{/* <DashboardCards />
<View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
  <AppCard style={{height:200,width:'100%',justifyContent:'center',padding:20}}>
    <PieChart
      donut
      showText
      textColor="black"
      radius={75}
      textSize={10}
      showTextBackground
      textBackgroundRadius={15}
      data={pieData}
    />
  </AppCard>
</View> */}
