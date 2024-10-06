import { View } from "react-native"
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure you're importing the correct icon set
import AppCard from "./AppCard";
import { useNavigation } from '@react-navigation/native';
import AppText from "./AppText";
import AppPicklist from "./AppPicklist";

const AppHeader = ({text,showPicklist,districtValues,selectedValue,onChangeDistrict}) =>{
    const navigation = useNavigation()
    return (
        <AppCard style={{width:'100%',marginBottom:10,minHeight:50,backgroundColor:'white',flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{width:'50%',marginLeft:-10,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
            <Button style={{backgroundColor:'white'}} icon={() => <Icon name="menu" size={30} color="black" />} mode="contained" onPress={() => navigation.openDrawer()}/>
               <AppText style={{fontSize:20}}>{text}</AppText> 
          </View>

          {
            showPicklist ? 
            <View style={{width:'50%',marginLeft:-10,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                <AppPicklist selectedValue={selectedValue} picklistValues={districtValues} onChangeValue={(identifier,selectedValue) => onChangeDistrict(selectedValue)} identifier='District' />
            </View>
            :
            null
          }
        </AppCard>
    )
}

export default AppHeader;