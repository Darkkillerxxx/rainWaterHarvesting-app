import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RoadIcon from 'react-native-vector-icons/FontAwesome'
import FeatherIcon from 'react-native-vector-icons/Feather'
import AppText from './AppText';
import AppTextBold from './AppTextBold';
import AppCard from './AppCard';


const DashboardCards = ({dashboardValues}) =>{
    return(
        <>
            <View style={styles.cardColumnContainer}>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                            <Image source={require('../assets/Images/house.png')} style={{width:50,height:50,objectFit:'fill'}}/>
                        </View>
                        <View style={{width:'50%',height:'100%',justifyContent:'center'}}>
                            <AppText style={{fontSize:16}}>State Target</AppText>
                            <AppTextBold style={{fontSize:20}}>{dashboardValues ? dashboardValues.totalRecordCount : 0}</AppTextBold>
                        </View>
                    </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                                <Image source={require('../assets/Images/road.png')} style={{width:50,height:50,objectFit:'fill'}}/>
                            </View>
                            <View style={{width:'50%',height:'100%',justifyContent:'center'}}>
                                <AppText style={{fontSize:16}}>Talukas</AppText>
                                <AppTextBold style={{fontSize:20}}>{dashboardValues ? dashboardValues.talukasCount : 0}</AppTextBold>
                            </View>
                        </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                            <Image source={require('../assets/Images/village.png')} style={{width:50,height:50,objectFit:'fill'}}/>
                        </View>
                        <View style={{width:'50%',height:'100%',justifyContent:'center'}}>
                            <AppText style={{fontSize:16}}>Village</AppText>
                            <AppTextBold style={{fontSize:20}}>{dashboardValues ? dashboardValues.villageCount : 0}</AppTextBold>
                        </View>
                    </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                                <Image source={require('../assets/Images/target.png')} style={{width:50,height:50,objectFit:'fill'}}/>
                            </View>
                            <View style={{width:'50%',height:'100%',justifyContent:'center'}}>
                                <AppText style={{fontSize:16}}>Target</AppText>
                                <AppTextBold style={{fontSize:20}}>{dashboardValues ? dashboardValues.totalTargetCount : 0}</AppTextBold>
                            </View>
                        </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                            <Image source={require('../assets/Images/cut.png')} style={{width:50,height:50,objectFit:'fill'}}/>
                        </View>
                        <View style={{width:'50%',height:'100%',justifyContent:'center'}}>
                            <AppText style={{fontSize:16}}>Groundwork</AppText>
                            <AppTextBold style={{fontSize:20}}>{dashboardValues ? dashboardValues.inaugrationCount : 0}</AppTextBold>
                        </View>
                    </View>
                </AppCard>
                <AppCard style={styles.card}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'flex-start'}}>
                                <Image source={require('../assets/Images/checked.png')} style={{width:50,height:50,objectFit:'fill'}}/>
                            </View>
                            <View style={{width:'50%',height:'100%',justifyContent:'center'}}>
                                <AppText style={{fontSize:16}}>Completion</AppText>
                                <AppTextBold style={{fontSize:20}}>{dashboardValues ? dashboardValues.completionCount : 0}</AppTextBold>
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
        width:200,
        backgroundColor:'#ffffff',
        elevation:2,
        borderRadius:5,
        padding: 10,
        marginLeft:10
    }
})

export default DashboardCards;