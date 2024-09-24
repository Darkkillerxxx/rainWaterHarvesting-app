import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RoadIcon from 'react-native-vector-icons/FontAwesome'
import FeatherIcon from 'react-native-vector-icons/Feather'
import AppText from './AppText';
import AppTextBold from './AppTextBold';
import AppCard from './AppCard';


const DashboardCards = () =>{
    return(
        <>
            <View style={styles.cardColumnContainer}>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                              <MaterialIcon name='numbers' size={50}/> 
                        </View>
                        <View style={{width:'50%',height:'100%',justifyContent:'flex-start'}}>
                            <AppText style={{marginVertical:10,fontSize:16}}>State Target</AppText>
                            <AppTextBold style={{fontSize:24}}>400</AppTextBold>
                        </View>
                    </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                                <RoadIcon name='road' size={50}/> 
                            </View>
                            <View style={{width:'50%',height:'100%',justifyContent:'flex-start'}}>
                                <AppText style={{marginVertical:10,fontSize:16}}>Talukas</AppText>
                                <AppTextBold style={{fontSize:24}}>40</AppTextBold>
                            </View>
                        </View>
                </AppCard>
            </View>
            <View style={styles.cardColumnContainer}>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                              <MaterialIcon name='location-city' size={50}/> 
                        </View>
                        <View style={{width:'50%',height:'100%',justifyContent:'flex-start'}}>
                            <AppText style={{marginVertical:10,fontSize:16}}>Village</AppText>
                            <AppTextBold style={{fontSize:24}}>20</AppTextBold>
                        </View>
                    </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                                <FeatherIcon name='target' size={50}/> 
                            </View>
                            <View style={{width:'50%',height:'100%',justifyContent:'flex-start'}}>
                                <AppText style={{marginVertical:10,fontSize:16}}>Target</AppText>
                                <AppTextBold style={{fontSize:24}}>400</AppTextBold>
                            </View>
                        </View>
                </AppCard>
            </View>
            <View style={styles.cardColumnContainer}>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                              <MaterialIcon name='start' size={50}/> 
                        </View>
                        <View style={{width:'50%',height:'100%',justifyContent:'flex-start'}}>
                            <AppText style={{marginVertical:10,fontSize:16}}>Groundwork</AppText>
                            <AppTextBold style={{fontSize:24}}>400</AppTextBold>
                        </View>
                    </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                                <MaterialIcon name='done' size={50}/> 
                            </View>
                            <View style={{width:'50%',height:'100%',justifyContent:'flex-start'}}>
                                <AppText style={{marginVertical:10,fontSize:16}}>Completion</AppText>
                                <AppTextBold style={{fontSize:24}}>400</AppTextBold>
                            </View>
                        </View>
                </AppCard>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    cardColumnContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around',
        marginVertical:10
    },
    card:{
        width:'45%',
        height:100,
        backgroundColor:'#ffffff',
        elevation:2,
        borderRadius:5,
        padding: 10
    }
})

export default DashboardCards;