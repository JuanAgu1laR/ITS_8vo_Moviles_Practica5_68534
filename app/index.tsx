import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();
  const [user, setUser] = useState<any>(null);

  const checkAuth = useCallback(async () => {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      router.replace('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
      loadNotes();
    }, [loadNotes, checkAuth])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hola, {user?.nombre || 'Usuario'}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>No hay notas creadas</Text>
        ) : (
          notes.map(note => (
            <Card key={note.id} style={styles.card}>
              <Card.Title
                title={note.titulo}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                <Text 
                  numberOfLines={2} 
                  ellipsizeMode="tail"
                  style={styles.cardContent}
                >
                  {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 150)}
                </Text>
                {note.fechaRecordatorio && (
                  <View style={styles.reminderBadge}>
                    <MaterialIcons name="notifications-active" size={14} color="#6200ee" />
                    <Text style={styles.reminderDateText}>
                      {new Date(note.fechaRecordatorio).toLocaleString()}
                    </Text>
                  </View>
                )}
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEditNote(note.id)}
                  style={styles.actionButton}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleDeleteNote(note.id)}
                  style={styles.actionButton}
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-note')}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    color: '#666',
    marginTop: 4,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f0eaff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  reminderDateText: {
    fontSize: 12,
    color: '#6200ee',
    marginLeft: 5,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  actionButton: {
    margin: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});