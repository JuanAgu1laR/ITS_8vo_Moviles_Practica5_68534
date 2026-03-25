import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../services/api';
import { NeumorphicBox } from '../components/ui/NeumorphicBox';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !password || !nombre) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);
    try {
      await api.register(username, password, nombre);
      Alert.alert('Éxito', 'Cuenta creada con éxito', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>Crea una cuenta para empezar</Text>
        </View>

        <NeumorphicBox style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={nombre}
            onChangeText={setNombre}
          />
        </NeumorphicBox>

        <NeumorphicBox style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </NeumorphicBox>

        <NeumorphicBox style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </NeumorphicBox>

        <TouchableOpacity 
          onPress={handleRegister} 
          disabled={loading}
          style={styles.buttonContainer}
        >
          <NeumorphicBox style={styles.buttonBox}>
            <Text style={styles.buttonText}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Text>
          </NeumorphicBox>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')} style={styles.link}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E5EC',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#444',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  inputBox: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 5,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#444',
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonBox: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#E0E5EC',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  link: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  }
});
