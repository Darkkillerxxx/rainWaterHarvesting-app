import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import MasterLayout from '../components/MasterLayout'
// import AppCard from '../components/AppCard';
import { DataTable } from 'react-native-paper';
import AppCard from '../components/AppCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPicklistValues } from '../features/getPicklistValuesSlice';
import { callAPI } from '../common/api';
import AppText from '../components/AppText';
import AppTextBold from '../components/AppTextBold';
import AppInput from '../components/AppInput';
import AppPicklist from '../components/AppPicklist';
import AppButton from '../components/AppButton';
import AppInputOptions from '../components/AppInputOptions';
import Modal from "react-native-modal";
import AppModal from '../components/AppModal';

const ViewRecords = () => {
  const inputOptions = [{label:'Only Ground Work Records',value:1,isSelected:false},{label:'Only Completed Records',value:2,isSelected:false}]
  const { loading, data, error } = useSelector((state) => {
    return state.data
  });

  const { userDetails } = useSelector((state)=>{
    return state.userDetails;
  })

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [district,setDistrict] = useState('');
  const [taluka,setTaluka] = useState('');
  const [village,setVillage] = useState('')
  const [showModal,setShowModal] = useState(false);
  const [records,setRecords] = useState([]);
  const [searchText,setSearchText] = useState('');
  const [recordsToDisplay,setRecordsToDisplay] = useState([]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, recordsToDisplay.length);


  const fetchRecords =  async() =>{
    const apiResponse = await callAPI(`https://rainwaterharvesting-backend.onrender.com/fetchRecords?District=${district ? district : ''}&Taluka=${taluka ? taluka : ''}&Village=${village ? village : ''}&offSet=0`,
      'GET'
    )
    if(apiResponse.data.code != 200){
      return
    }
    const { data } = apiResponse.data.data
    setRecords([...data]);
    setRecordsToDisplay([...data])
  }
  
  useEffect(()=>{
    fetchRecords();
  },[])

  const applyFilters = (filters) =>{
    setShowModal(false);
    let filteredData = records.filter((record) => record.DISTRICT.toUpperCase().includes(filters.district) && record.TALUKA.toUpperCase().includes(filters.taluka) && record.VILLAGE.toUpperCase().includes(filters.village) );
    console.log(filters.selectOption);
    if(filters.selectedOption){
      if(filters.selectedOption === 1){
        filteredData = [...filteredData.filter((record) => record.Inauguration_DATE != null)]
      }

      if(filters.selectedOption === 2){
        filteredData = [...filteredData.filter((record) => record.COMPLETED_DATE != null)]
      }
    }
    setRecordsToDisplay([...filteredData]);
  }

  useEffect(()=>{
    //console.log(67,records)
    if(searchText.length > 0){
      const filteredTableData = records.filter((data)=> {
        return data.DISTRICT?.toLowerCase()?.includes(searchText.toLowerCase()) || 
        data.TALUKA?.toLowerCase()?.includes(searchText.toLowerCase()) || 
        data.VILLAGE?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        data.LOCATION?.toLowerCase()?.includes(searchText.toLowerCase())});

      setRecordsToDisplay([...filteredTableData]);
    }
  },[searchText])

   useEffect(() => {
     setPage(0);
   }, [itemsPerPage]);
 
   return (
    <MasterLayout style={styles.masterLayout}>
      <AppCard style={styles.appCardStyle}>
        <View style={styles.filterContainerStyle}>
          <AppTextBold>Filters</AppTextBold>
        </View>
          <View style={styles.searchAndFilterContainerStyle}>
            <View style={styles.searchStyle}>
              <AppText>Search</AppText>
              <AppInput style={{borderColor:'black'}} onTextChange={(e)=> setSearchText(e)} placeholderText='Search Records'/>
            </View>
            <AppButton onPressButton={()=>setShowModal(true)} icon='filter-outline' iconSize={22} iconColor='white' iconStyle={{marginLeft:15}} buttonStyle={{width:70,height:50,marginTop:25}}/>
          </View>
        
      <ScrollView horizontal style={{width:'100%',marginTop:25}}>
        <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{width:75}}>District</DataTable.Title>
              <DataTable.Title style={{width:75}}>Taluka</DataTable.Title>
              <DataTable.Title style={{width:75}}>Village</DataTable.Title>
              <DataTable.Title style={{width:100}}>Address</DataTable.Title>
              <DataTable.Title style={{width:100}}>Work Details</DataTable.Title>
              <DataTable.Title style={{width:100}}>Groundwork Date</DataTable.Title>
              <DataTable.Title style={{width:100}}>Completion Date</DataTable.Title>
            </DataTable.Header>
      
            {recordsToDisplay.slice(from, to).map((item,index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{width:75}}>{item.DISTRICT}</DataTable.Cell>
                <DataTable.Cell style={{width:75}}>{item.TALUKA}</DataTable.Cell>
                <DataTable.Cell style={{width:75}}>{item.VILLAGE}</DataTable.Cell>
                <DataTable.Cell style={{width:100}}>{item.LOCATION}</DataTable.Cell>
                <DataTable.Cell style={{width:125}}>{item.WORK_NAME}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  {item.Inauguration_DATE ? 
                    new Date(item.Inauguration_DATE).toLocaleDateString('en-GB') 
                    : "N/A"}
                </DataTable.Cell>

                {/* Properly check and format Completion Date */}
                <DataTable.Cell style={{ width: 100 }}>
                  {item.COMPLETED_DATE ? 
                    new Date(item.COMPLETED_DATE).toLocaleDateString('en-GB') 
                    : "N/A"}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
      
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(recordsToDisplay.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${recordsToDisplay.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
          </ScrollView>
      </AppCard>

      <Modal isVisible={showModal}>
         <AppModal userDetails={userDetails} applyFilters={applyFilters} inputOptions={inputOptions} picklistValues={data}/>
      </Modal>
    </MasterLayout>
   
   );
 };

const styles = StyleSheet.create({
  masterLayout: {
    padding:10,
    justifyContent:'flex-start'
  },
  appCardStyle:{
    width:'100%'
  },
  filterContainerStyle:{
    width:'100%'
  },
  searchAndFilterContainerStyle:{
    width:'100%',
    marginTop:15,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  searchStyle:{
    width:'80%'
  }
});


export default ViewRecords;