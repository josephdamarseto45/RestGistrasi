import React from 'react';
import { View, Text, Image, StyleSheet, Linking } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      {/* City Illustration */}
      <Image
        source={require('./assets/Resto.png')} // Replace with your image
        style={styles.image}
        resizeMode="contain"
      />
      
      {/* Title Text */}
      <Text style={styles.title}>
        RESTGISTRASI
      </Text>
      
      <Text style={styles.title}>
        Daftarkan Restomu!
      </Text>
      
      {/* Contact Information
      <View style={styles.contactInfo}>
        <Text style={styles.contact} onPress={() => Linking.openURL('tel:119')}>
          Layanan Gawat Darurat Kesehatan: 119
        </Text>
        <Text style={styles.contact} onPress={() => Linking.openURL('tel:02188957805')}>
          Layanan Pemadam Kebakaran: (021) 8895 7805
        </Text>
        <Text style={styles.contact} onPress={() => Linking.openURL('tel:+6281283957877')}>
          Layanan Badan Penanggulangan Bencana Daerah (BPBD): +62 812 8395 7877
        </Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0faff', // Light blue background
  },
  image: {
    width: 300, // Adjust based on your image size
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  contactInfo: {
    marginTop: 20,
  },
  contact: {
    fontSize: 14,
    color: '#007BFF', // Link color
    textAlign: 'center',
    marginVertical: 1,
  },
});
