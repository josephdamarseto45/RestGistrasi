import React, { useState, useEffect } from 'react'; 
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const Createdata = () => {
  const jsonUrl = 'http://192.168.235.236:3000/mahasiswa'; // API URL
  
  // State for storing data and form input
  const [data, setData] = useState([]);
  
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(jsonUrl);
        const result = await response.json();
        setData(result); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('google.navigation:q=' + item.location.latitude + ',' + item.location.longitude)
            }
          >
            <View style={styles.card}>
              <Text style={styles.category}>Nama Resto: {item.category}</Text>
              <Text style={styles.title}>Jadwal Buka/Tutup: {item.title}</Text>
              <Text style={styles.report}>Lokasi: {item.report}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()} // Assuming each item has a unique 'id'
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
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 7,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
