import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null); // Tidak perlu token akses untuk MapLibre

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mahasiswaData: [],
      isFormVisible: false,
      newMarkerLocation: null,
      formData: {
        id: '',
        category: '',
        title: '',
        report: '',
        date: new Date().toISOString().split('T')[0],
        location: {
          latitude: null,
          longitude: null,
        },
      },
      isLoading: false, // Menambahkan state untuk loading indicator
    };
  }

  componentDidMount() {
    this.fetchMarkers();
  }

  // Fungsi untuk fetch data dari server
  fetchMarkers = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await fetch('http://192.168.235.236:3000/mahasiswa');
      if (!response.ok) throw new Error('Failed to fetch markers');
      const data = await response.json();
      console.log('Fetched Data:', data); // Debug log
      const cleanedData = data.map((item) => {
        const latitude = item.location?.latitude || item.latitude;
        const longitude = item.location?.longitude || item.longitude;

        return {
          ...item,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
      });
      this.setState({ mahasiswaData: cleanedData });
    } catch (error) {
      console.error('Error fetching markers:', error);
      Alert.alert('Error', 'Failed to load markers from API.');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // Fungsi untuk menangani klik pada peta
  onMapPress = (e) => {
    const coordinates = e.geometry ? e.geometry.coordinates : null;
    if (coordinates) {
      const [longitude, latitude] = coordinates;
      this.setState({
        newMarkerLocation: { latitude, longitude },
        isFormVisible: true,
        formData: {
          ...this.state.formData,
          location: { latitude, longitude },
        },
      });
    }
  };

  // Fungsi untuk menyimpan data baru ke server
  saveNewMarker = async () => {
    const { formData } = this.state;
    const { category, title, report, location } = formData;

    if (!category || !title || !report) {
      Alert.alert('Error', 'Semua field harus diisi.');
      return;
    }

    const newMarker = {
      id: Date.now().toString(), // Generate unique ID berdasarkan timestamp
      category,
      title,
      report,
      date: new Date().toISOString().split('T')[0],
      location,
    };

    try {
      const response = await fetch('http://192.168.235.236:3000/mahasiswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMarker),
      });

      if (!response.ok) throw new Error('Failed to save marker');
      this.fetchMarkers();
      this.setState({
        isFormVisible: false,
        newMarkerLocation: null,
        formData: {
          id: '',
          category: '',
          title: '',
          report: '',
          date: new Date().toISOString().split('T')[0],
          location: { latitude: null, longitude: null },
        },
      });
      Alert.alert('Success', 'Marker has been saved successfully!');
    } catch (error) {
      console.error('Error saving marker:', error);
      Alert.alert('Error', 'Failed to save marker.');
    }
  };

  // Fungsi untuk merender marker pada peta
  renderMarkers = () => {
    const { mahasiswaData } = this.state;
    return mahasiswaData.map((item) => {
      if (!item.latitude || !item.longitude) {
        console.log('Invalid Coordinates for Marker:', item); // Debug log
        return null;
      }

      return (
        <MapLibreGL.PointAnnotation
          key={item.id}
          id={item.id}
          coordinate={[item.longitude, item.latitude]}
        >
          <View style={styles.markerContainer}>
            <Text style={styles.markerText}>
              {item.category || item.first_name || 'No category'} {/* Default text */}
            </Text>
          </View>
        </MapLibreGL.PointAnnotation>
      );
    });
  };

  render() {
    const { isFormVisible, formData, isLoading } = this.state;

    return (
      <View style={styles.page}>
        {/* Peta */}
        <MapLibreGL.MapView
          style={styles.map}
          styleURL="https://api.maptiler.com/maps/streets-v2/style.json?key=bmI3rxOUNvmAUE83PXXF"
          onPress={this.onMapPress}
        >
          <MapLibreGL.Camera zoomLevel={10} centerCoordinate={[106.827153, -6.17511]} />
          {this.renderMarkers()}
        </MapLibreGL.MapView>

        {/* Loading Indicator */}
        {isLoading && (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        )}

        {/* Form Modal */}
        <Modal visible={isFormVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tambah Data Marker</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama"
              value={formData.first_name}
              onChangeText={(text) =>
                this.setState({ formData: { ...formData, category: text } })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Jadwal Buka/Tutup"
              value={formData.last_name}
              onChangeText={(text) =>
                this.setState({ formData: { ...formData, title: text } })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Alamat"
              value={formData.gender}
              onChangeText={(text) =>
                this.setState({ formData: { ...formData, report: text } })
              }
            />
            <TouchableOpacity style={styles.saveButton} onPress={this.saveNewMarker}>
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => this.setState({ isFormVisible: false })}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '80%',
  },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  saveButtonText: { color: '#fff', textAlign: 'center' },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 5, marginTop: 5 },
  cancelButtonText: { color: '#fff', textAlign: 'center' },
  markerContainer: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  markerText: { color: '#fff', fontWeight: 'bold' },
});
