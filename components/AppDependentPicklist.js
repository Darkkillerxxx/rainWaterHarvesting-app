import react,{ useEffect, useState } from "react";
import { View } from "react-native";
import AppPicklist from "./AppPicklist";
import { useSelector } from "react-redux";

const DependentPicklist = ({onSetDependentPicklistValue}) =>{
    const [district,setDistrict] = useState('');
    const [taluka,setTaluka] = useState('');
    const [village,setVillage] = useState('');
    const [districtValues,setDistrictValues] = useState([]);
    const [talukaValues,setTalukaValues] = useState([]);
    const [villageValues,setVillagValues] = useState([]);

    const { loading, data, error } = useSelector((state) => {
        return state.data
    });

    const { userDetails } = useSelector((state)=>{
        return state.userDetails;
    })

    const assignaVluesAndPicklist = (userType) =>{
        console.log(23,userDetails)
        switch(userType){
            case 1:
                assignDistrictValues();
                break;
            case 2:
                setDistrict(userDetails.district);
                assignTalukaPicklistValues(userDetails.district)
                break;
            case 3:
                setDistrict(userDetails.district);
                setTaluka(userDetails.taluka);
                assignVillagePicklistValue(userDetails.district,userDetails.taluka);
                break;
            default:
                assignDistrictValues();
                break;
        }
    }

    const assignDistrictValues = () => {
        const districtPicklistValuesSet = [...new Set(data.data.map((value) => value.DISTRICT?.trim()?.toUpperCase()))]
        setDistrictValues([...districtPicklistValuesSet]); 
    }

    const assignTalukaPicklistValues = (district) =>{
        if(district && district.length > 0){
            setDistrict(district);
            const filteredTalukaPicklistValues = data.data.filter((value) => value.DISTRICT?.trim()?.toUpperCase() === district?.trim().toUpperCase());
            const talukaPicklistvaluesSet =  [...new Set(filteredTalukaPicklistValues.map((value) => value.TALUKA?.trim()?.toUpperCase()))];
            setTalukaValues([...talukaPicklistvaluesSet]);
          }
    }

    const assignVillagePicklistValue = (district,taluka) => {
        const filteredVillagePicklistValues = data.data.filter((value) => value.DISTRICT?.trim()?.toUpperCase() === district && value.TALUKA?.trim()?.toUpperCase() === taluka?.trim().toUpperCase() );
        console.log(filteredVillagePicklistValues);
        const villagePicklistvaluesSet =  [...new Set(filteredVillagePicklistValues.map((value) => value.VILLAGE?.trim()?.toUpperCase()))];
        setVillagValues(villagePicklistvaluesSet);
    }

    const onPicklistValueChange = (identifier,selectedValue) =>{
        console.log(identifier,selectedValue)
        switch(identifier){
          case 'District':
            if(selectedValue && selectedValue.length > 0){
              setDistrict(selectedValue);
              assignTalukaPicklistValues(selectedValue);
              onSetDependentPicklistValue({
                district:selectedValue,
                taluka,
                village
              })
            }
            break;
          case 'Taluka':
            if(selectedValue && selectedValue.length > 0){
                setTaluka(selectedValue)
                assignVillagePicklistValue(district,selectedValue)
                onSetDependentPicklistValue({
                    district:district,
                    taluka:selectedValue,
                    village
                })
            }
            break;
          default:
            setVillage(selectedValue);
            onSetDependentPicklistValue({
                district:district,
                taluka:taluka,
                village:selectedValue
              })
            break;
        }
    }

    useEffect(()=>{
        if(userDetails){
            assignaVluesAndPicklist(userDetails.userType);
        }
        console.log(19,userDetails)
    },[userDetails])

    return (
        <>
            {
                userDetails?.userType === 1 || !userDetails ? 
                <View style={{width:'100%',marginTop:-5}}>
                    <AppPicklist style={{borderRadius:5}} label='Select District' onChangeValue={onPicklistValueChange} identifier={'District'} selectedValue={district} picklistValues={districtValues}/>
                </View>
                : 
                null
            }
           
           {
                userDetails?.userType === 1 || userDetails?.userType === 2 || !userDetails ? 
                <View style={{width:'100%',marginTop:-10}}>
                    <AppPicklist style={{borderRadius:5}} label='Select Taluka' onChangeValue={onPicklistValueChange} identifier={'Taluka'} selectedValue={taluka} picklistValues={talukaValues}/>
                </View>
                : 
                null
            }
           
            <View style={{width:'100%',marginTop:-10}}>
                <AppPicklist style={{borderRadius:5}} label='Select Village' onChangeValue={onPicklistValueChange} identifier={'Village'} selectedValue={village} picklistValues={villageValues}/>
            </View>
        </>
    )
}

export default DependentPicklist;