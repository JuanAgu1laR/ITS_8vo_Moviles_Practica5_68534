import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { RichToolbar, actions } from 'react-native-pell-rich-editor';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Text } from 'react-native-paper';

export default function CreateNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  
  const richText = useRef<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const { notes, saveNote, updateNote } = useNotes();

  useEffect(() => {
    if (id) {
      const noteId = Number(id);
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        setTitle(noteToEdit.titulo);
        setContent(noteToEdit.descripcion);
        setCompleted(noteToEdit.completada);
        if (noteToEdit.fechaRecordatorio) {
          setReminderDate(new Date(noteToEdit.fechaRecordatorio));
        }
        richText.current?.setContentHTML(noteToEdit.descripcion);
      }
    }
  }, [id, notes]);

  const scheduleNotification = async (date: Date, noteText: string) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permiso para notificaciones denegado');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recordatorio de Nota",
        body: noteText,
      },
      trigger: {
        date: date,
      },
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la nota');
      return;
    }

    try {
      const noteData = { 
        titulo: title.trim(), 
        descripcion: content,
        completada: completed,
        fechaRecordatorio: reminderDate?.toISOString()
      };

      if (id) {
        await updateNote(Number(id), noteData);
      } else {
        await saveNote(noteData);
      }

      if (reminderDate && reminderDate > new Date()) {
        await scheduleNotification(reminderDate, title);
      }

      router.back();
    } catch (error) {
      alert('Error al guardar la nota');
      console.error(error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const current = reminderDate || new Date();
      current.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setReminderDate(new Date(current));
      setShowTimePicker(true);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const current = reminderDate || new Date();
      current.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setReminderDate(new Date(current));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.titleInput}
          placeholder="Título de la nota"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.reminderContainer}>
          <TouchableOpacity 
            style={styles.reminderButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="notifications" size={20} color={reminderDate ? "#6200ee" : "#666"} />
            <Text style={[styles.reminderText, reminderDate && { color: "#6200ee" }]}>
              {reminderDate ? `Recordatorio: ${reminderDate.toLocaleString()}` : "Agregar recordatorio"}
            </Text>
          </TouchableOpacity>
          {reminderDate && (
            <TouchableOpacity onPress={() => setReminderDate(null)}>
              <MaterialIcons name="close" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={reminderDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={reminderDate || new Date()}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        <CustomRichEditor
          ref={richText}
          style={styles.editor}
          initialContentHTML={content}
          onChange={setContent}
          placeholder="Escribe el contenido de tu nota aquí..."
          useContainer={true}
        />

        <RichToolbar
          editor={richText}
          selectedIconTint="#873c1e"
          iconTint="#312921"
          scalesPageToFit={Platform.OS === 'android'}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setStrikethrough,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.undo,
            actions.redo,
          ]}
          style={styles.toolbar}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleSave()}
      >
        <MaterialIcons name="save" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    paddingHorizontal: 15,
    color: '#000',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  editor: {
    flex: 1,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  toolbar: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});