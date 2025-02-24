import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Adjust path

type NotFoundProps = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

function NotFound({ navigation }: NotFoundProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>404</Text>
      <Text style={styles.message}>Oops! Page not found</Text>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCode: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
    color: '#666',
    marginBottom: 24,
  },
  homeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});