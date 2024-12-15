import React, { useState, useEffect } from 'react'; 
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet, Alert, Button, RefreshControl } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const Createdata = () => {
  const jsonUrl = 'http://192.168.235.236:3000/mahasiswa'; // API URL

  // State for storing data and form input
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(jsonUrl);
      const result = await response.json();
      setData(result); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // Function to delete data
  const deleteData = async (id) => {
    try {
      const response = await fetch(`${jsonUrl}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Filter out the deleted item from state
        setData((prevData) => prevData.filter((item) => item.id !== id));
        Alert.alert('Sukses', 'Data berhasil dihapus');
      } else {
        Alert.alert('Gagal', 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus data');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('google.navigation:q=' + item.location.latitude + ',' + item.location.longitude)
              }
            >
              <View style={styles.iconAndCategory}>
                <FontAwesomeIcon icon={faUtensils} size={16} style={styles.icon} />
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.title}>Jadwal Buka Tutup: {item.title}</Text>
              <Text style={styles.report}>Lokasi: {item.report}</Text>
              <Text style={styles.date}>Ditambahkan Pada: {item.date}</Text>
            </TouchableOpacity>
            <Button
              title="Hapus"
              onPress={() =>
                Alert.alert('Konfirmasi Hapus', 'Yakin akan menghapus data ini?', [
                  { text: 'Tidak', style: 'cancel' },
                  { text: 'Ya', onPress: () => deleteData(item.id) },
                ])
              }
              color="red"
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // Assuming each item has a unique 'id'
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
        }
      />
    </View>
  );
};

export default Createdata;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 7,
  },
  iconAndCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
    color: '#000',
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
});
