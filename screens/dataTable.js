import React,{useState,useEffect} from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import MasterLayout from '../components/MasterLayout';
import { DataTable } from 'react-native-paper';
import AppCard from '../components/AppCard';
import {  useSelector } from 'react-redux';
import { callAPI } from '../common/api';
import AppText from '../components/AppText';
import AppTextBold from '../components/AppTextBold';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import Modal from 'react-native-modal';
import AppModal from '../components/AppModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const ViewRecords = ({ navigation }) => {
  const inputOptions = [{ label: 'Only Ground Work Records', value: 1, isSelected: false }, { label: 'Only Completed Records', value: 2, isSelected: false }];
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSelector((state) => state.data);
  const { userDetails } = useSelector((state) => state.userDetails);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, recordsToDisplay.length);

  const fetchRecords = async (district, taluka, village, searchText, showInaugurated, showCompleted) => {
    setIsLoading(true);

    const apiResponse = await callAPI(
      `https://rainwaterharvesting-backend.onrender.com/fetchRecords?District=${district ? district : 'SURAT'}&Taluka=${taluka ? taluka : ''}&Village=${village ? village : ''}&SearchText=${searchText}&ShowInaugurated=${showInaugurated ? true : ''}&ShowCompleted=${showCompleted ? true : ''}`,
      'GET'
    );
    console.log(`https://rainwaterharvesting-backend.onrender.com/fetchRecords?District=${district ? district : 'SURAT'}&Taluka=${taluka ? taluka : ''}&Village=${village ? village : ''}&SearchText=${searchText}&ShowInaugurated=${showInaugurated ? true : ''}&ShowCompleted=${showCompleted ? true : ''}`)
    //console.log(apiResponse);
    
    if (apiResponse.data.code != 200) {
      return;
    }
    const { data } = apiResponse.data.data;
    setRecords([...data]);
    setRecordsToDisplay([...data]);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log(54,userDetails);
      if (userDetails) {
        console.log(56);
        fetchRecords(userDetails.district, userDetails.taluka, null, null, null, null);
        return;
      }
      fetchRecords(null, null, null, null, null, null);
    }, [userDetails])
  );

  const applyFilters = (filters) => {
    setShowModal(false);
    fetchRecords(filters?.district?.toUpperCase(), filters?.taluka?.toUpperCase(), filters?.village?.toUpperCase(), searchText, filters?.selectedOption === 1 ? true : '' , filters?.selectedOption === 2 ? true : '');
  };

  useEffect(() => {
   
  }, [searchText]);

  const onRecordClick = (record) => {
    navigation.navigate('CreateEditRecords', { record });
  };

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <MasterLayout style={styles.masterLayout}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <AppCard style={styles.appCardStyle}>
        <View style={styles.filterContainerStyle}>
          <AppTextBold>Filters</AppTextBold>
        </View>
        <View style={styles.searchAndFilterContainerStyle}>
          <View style={styles.searchStyle}>
            <AppText>Search</AppText>
            <AppInput style={{ borderColor: 'black' }} onTextChange={(e) => setSearchText(e)} placeholderText="Search Records" />
          </View>
          <AppButton onPressButton={() => applyFilters()} icon="search" iconSize={22} iconColor="white" iconStyle={{ marginLeft: 15 }} buttonStyle={{ width: 70, height: 50, marginTop: 25 }} />
          <AppButton onPressButton={() => setShowModal(true)} icon="filter-outline" iconSize={22} iconColor="white" iconStyle={{ marginLeft: 15 }} buttonStyle={{ width: 70, height: 50, marginTop: 25 }} />
        </View>

        <ScrollView horizontal style={{ width: '100%', marginTop: 25 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ width: 75 }}></DataTable.Title>
              <DataTable.Title style={{ width: 75 }}>District</DataTable.Title>
              <DataTable.Title style={{ width: 75 }}>Taluka</DataTable.Title>
              <DataTable.Title style={{ width: 75 }}>Village</DataTable.Title>
              <DataTable.Title style={{ width: 100 }}>Address</DataTable.Title>
              <DataTable.Title style={{ width: 100 }}>Work Details</DataTable.Title>
              <DataTable.Title style={{ width: 100 }}>Start Work Date</DataTable.Title>
              <DataTable.Title style={{ width: 100 }}>Completion Date</DataTable.Title>
            </DataTable.Header>

            {recordsToDisplay.slice(from, to).map((item, index) => (
              <DataTable.Row onPress={() => onRecordClick(item)} key={index}>
                <DataTable.Cell style={{ width: 75 }}>
                  <Icon name={item.IS_AUTH ? 'lock-closed-sharp' : 'lock-open-sharp'} size={20} />
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 75 }}>{item.DISTRICT}</DataTable.Cell>
                <DataTable.Cell style={{ width: 75 }}>{item.TALUKA}</DataTable.Cell>
                <DataTable.Cell style={{ width: 75 }}>{item.VILLAGE}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>{item.LOCATION}</DataTable.Cell>
                <DataTable.Cell style={{ width: 125 }}>{item.WORK_NAME}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  {item.Inauguration_DATE ? new Date(item.Inauguration_DATE).toLocaleDateString('en-GB') : 'N/A'}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  {item.COMPLETED_DATE ? new Date(item.COMPLETED_DATE).toLocaleDateString('en-GB') : 'N/A'}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

          <View style={{alignItems:'flex-start'}}>
            <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(recordsToDisplay.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${recordsToDisplay.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                showFastPaginationControls
                selectPageDropdownLabel="Rows per page"
              />
          </View>
           
          </DataTable>
        </ScrollView>
      </AppCard>

      <Modal isVisible={showModal}>
        <AppModal userDetails={userDetails} applyFilters={applyFilters} inputOptions={inputOptions} picklistValues={data} />
      </Modal>
    </MasterLayout>
  );
};

const styles = StyleSheet.create({
  masterLayout: {
    padding: 10,
    justifyContent: 'flex-start',
  },
  appCardStyle: {
    width: '100%',
  },
  filterContainerStyle: {
    width: '100%',
  },
  searchAndFilterContainerStyle: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchStyle: {
    width: '60%',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default ViewRecords;
