import React,{useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MasterLayout from '../components/MasterLayout';
import DashboardCards from '../components/DashboardCards';
import AppCard from '../components/AppCard';
import RNSpeedometer from 'react-native-speedometer'
import AppText from '../components/AppText';
import { ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPicklistValues } from '../features/getPicklistValuesSlice';
import MapView, {Marker} from 'react-native-maps';


const Dashboard = () => {

  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => {
    return state.data
  });


  useEffect(() => {
    dispatch(fetchPicklistValues());
  }, [dispatch]);

  const pieData = [
    {value: 54, color: '#177AD5', text: '54%'},
    {value: 40, color: '#79D2DE', text: '30%'},
    {value: 20, color: '#ED6665', text: '26%'},
  ];

  return (
    <MasterLayout>  
      <ScrollView>
        <DashboardCards />
        <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
          <AppCard style={{height:200}}>
            <AppText style={{marginBottom:10}}>Groundwork</AppText>
            <RNSpeedometer value={20} size={150}/>
          </AppCard> 
          <AppCard style={{height:200}}>
            <AppText style={{marginBottom:10}}>Completion</AppText>
            <RNSpeedometer value={20} size={150}/>
          </AppCard> 
        </View>

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
        </View>

        {/* <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
          <AppCard style={{height:500,width:'100%',justifyContent:'center',padding:20}}>
          
          </AppCard>
        </View> */}
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
});


export default Dashboard;