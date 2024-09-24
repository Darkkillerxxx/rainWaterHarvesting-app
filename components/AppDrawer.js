import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import Icon from 'react-native-vector-icons/Ionicons';  // For icons (optional)
import { menuContents } from "../common/menu";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { storeUserDetails } from '../features/userDetails';


const AppDrawer = (props) =>{
    const dispatch = useDispatch();
    const [userData,setUserData] = useState(null);

    const { userDetails } = useSelector((state)=>{
        // console.log(state.userDetails)
        return state.userDetails;
    })

    useEffect(()=>{
        console.log(userData);
        if(userDetails){
            setUserData({...userDetails})
        }
    },[userDetails])

    const logOut=()=>{
        setUserData(null);
        dispatch(storeUserDetails(null))
    }

    return (
        <View style={{flex:1,width:'100%'}}>
            <View style={styles.drawerHeader}>
                <Image
                source={{ uri: 'https://via.placeholder.com/100' }}  // Replace with your avatar or logo
                style={styles.profileImage}
                />
                <AppText style={styles.profileName}>{userData ? userData?.username : 'Guest User' }</AppText>
                {
                    userDetails ?
                     <AppText style={styles.profileEmail}>{userData?.userType === 1 ? 'Admin' : userData?.userType === 2 ? 'District User' : 'Taluka User'}</AppText>
                    :
                    null
                }
            </View>
            
            <View style={styles.customActions}>
                {   
                    menuContents.map((menuContent)=>
                        {
                            return(
                                 menuContent.visbleTo.includes(userData?.userType) ?
                                    <TouchableOpacity
                                        key={menuContent.value}
                                        style={styles.actionItem}
                                        onPress={() => {menuContent.screenName === 'Log Out' ? logOut() : props.navigation.navigate(menuContent.screenName)}}>
                                        <Icon name={menuContent.icon} size={24} color="#000" />
                                        <AppText style={{...styles.actionText,...{marginLeft:20}}}>{menuContent.label}</AppText> 
                                    </TouchableOpacity>
                                    :
                                    menuContent.visibleToGuest ?
                                    <TouchableOpacity
                                        key={menuContent.value}
                                        style={styles.actionItem}
                                        onPress={() => {menuContent.screenName === 'Log Out' ? logOut() : props.navigation.navigate(menuContent.screenName)}}>
                                        <Icon name={menuContent.icon} size={24} color="#000" />
                                        <AppText style={{...styles.actionText,...{marginLeft:20}}}>{menuContent.label}</AppText> 
                                    </TouchableOpacity> : null
                            )
                        }
                       
                    )
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    drawerHeader: {
      padding: 20,
      backgroundColor: '#f4f4f4',
      alignItems: 'center',
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    profileEmail: {
      fontSize: 14,
      color: 'gray',
    },
    customActions: {
      marginTop: 20,
      paddingHorizontal: 10,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
    },
    actionText: {
      marginLeft: 10,
      fontSize: 16,
    },
  });


export default AppDrawer;