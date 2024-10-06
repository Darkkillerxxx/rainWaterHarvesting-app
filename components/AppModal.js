import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppTextBold from "./AppTextBold";
import AppInputOptions from "./AppInputOptions";
import AppPicklist from "./AppPicklist";
import AppButton from "./AppButton";

const AppModal = ({userDetails,inputOptions,applyFilters,picklistValues}) =>{
    const [district,setDistrict] = useState('');
    const [taluka,setTaluka] = useState('');
    const [village,setVillage] = useState('')
    const [districtValues,setDistrictValues] = useState([]);
    const [talukaValues,setTalukaValues] = useState([]);
    const [villageValues,setVillageValues] = useState([]);
    const [selectedOption,setSelectedOption] = useState(null);

    useEffect(()=>{
        if(userDetails){
            if(userDetails?.userType === 2 || userDetails?.userType === 3){
                onPicklistSelect('District',userDetails.district);
            }
        }
        else{
            setDistrict('SURAT')
            onPicklistSelect('District','SURAT');
        }
        if(picklistValues && picklistValues.data.length > 0){
            setDistrictPicklistValues()
        }
    },[])

    useEffect(()=>{
        if(userDetails && district.length > 0 && userDetails?.userType === 3){
            console.log(34,userDetails?.taluka);
            onPicklistSelect('Taluka',userDetails?.taluka);
        }
    },[district])

    const setDistrictPicklistValues = () => {
        const districtPicklistValuesSet = [...new Set(picklistValues.data.map((value) => value?.DISTRICT?.trim().toUpperCase()))]
        setDistrictValues(districtPicklistValuesSet); 
    }

    const onPicklistSelect = (identifier,selectedValue) => {
        switch(identifier){
            
            case 'District':
                setDistrict(selectedValue);
                const filteredTalukaPicklistValues = picklistValues.data.filter((value) => value?.DISTRICT?.trim().toUpperCase() === selectedValue.trim()?.toUpperCase());
                const talukaPicklistvaluesSet =  [...new Set(filteredTalukaPicklistValues.map((value) => value?.TALUKA?.trim().toUpperCase()))];
                setTalukaValues(talukaPicklistvaluesSet); 
                break

            case 'Taluka':
                setTaluka(selectedValue);
                const filteredVillagePicklistValues = picklistValues.data.filter((value) => value?.DISTRICT?.trim().toUpperCase() === district?.trim().toUpperCase() && value?.TALUKA?.trim().toUpperCase() === selectedValue?.trim()?.toUpperCase());
                console.log(57,filteredVillagePicklistValues)
                const villagePicklistvaluesSet =  [...new Set(filteredVillagePicklistValues.map((value) => value?.VILLAGE?.trim().toUpperCase()))];
                setVillageValues(villagePicklistvaluesSet);
                break

            default:
                setVillage(selectedValue);
                break
        }
      
    }

    const onApplyFilter = () => {
        applyFilters({
            district,
            taluka,
            village,
            selectedOption
        })
    }

    const onSelectOptions = (options) =>{
        console.log(options)
        setSelectedOption(options)
    }

    return(
        <View style={{width:'100%',backgroundColor:'white',padding:15,borderRadius:10}}>
            <AppTextBold>Advance Filters</AppTextBold>

            <View style={{width:'100%'}}>
                <AppInputOptions onButtonSelect={onSelectOptions} inputOptions={inputOptions}/>
            </View>

            <View style={{width:'100%'}}>
                {
                    userDetails?.userType === 1 || !userDetails ?
                    <AppPicklist identifier='District' selectedValue={district} style={{borderRadius:5}} label='Select District' picklistValues={districtValues} onChangeValue={onPicklistSelect} />: null
                }

                {
                    userDetails?.userType === 1 || userDetails?.userType === 2 || !userDetails ?
                    <AppPicklist identifier='Taluka'  selectedValue={taluka} style={{borderRadius:5}} label='Select Taluka' picklistValues={talukaValues} onChangeValue={onPicklistSelect} />: null
                }

                <AppPicklist style={{borderRadius:5}}  identifier='Village'  selectedValue={village} label='Select Village' picklistValues={villageValues} onChangeValue={onPicklistSelect} />
            </View>

            <View style={{width:'100%',alignItems:'flex-end'}}>
                <AppButton text='Apply Filters' onPressButton={onApplyFilter} buttonStyle={{marginVertical:15,width:100}}/>
            </View>
        </View>
    )
}

export default AppModal;