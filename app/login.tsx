import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NeumorphicBox } from '../components/ui/NeumorphicBox';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(username, password);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
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
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

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
          onPress={handleLogin} 
          disabled={loading}
          style={styles.buttonContainer}
        >
          <NeumorphicBox style={styles.buttonBox}>
            <Text style={styles.buttonText}>
              {loading ? 'Cargando...' : 'Entrar'}
            </Text>
          </NeumorphicBox>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
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
    marginBottom: 50,
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
    marginBottom: 25,
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
