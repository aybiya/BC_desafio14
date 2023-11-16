import React, { useState, useEffect } from 'react';
import "./App.css";
import NoteList from './NoteList';
import NoteForm from './NoteForm';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    //Promesa para tener las notas en la API de Firebase
    fetch('https://desafio14-notas-default-rtdb.firebaseio.com/notas.json')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Verificar si data es null o undefined
          const notesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setNotes(notesArray);
        }
      })
      .catch((error) => {
        console.error('Error al cargar la nota:', error);
      });
  }, []);
  
  const addNote = (note) => {
    // Lógica para agregar una nota a la base de datos en Firebase
    fetch('https://desafio14-notas-default-rtdb.firebaseio.com/notas.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    })
      .then((response) => response.json())
      .then((data) => {
        // Agregar la nota a la lista local
        setNotes([...notes, { id: data.name, ...note }]);
      })
      .catch((error) => {
        console.error('Error al agregar la nota:', error);
      });
  };

  const editNote = (editedNote) => {
    // Lógica para editar una nota en la base de datos en Firebase
    fetch(`https://desafio14-notas-default-rtdb.firebaseio.com/notas/${editedNote.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedNote),
    })
      .then((response) => response.json())
      .then(() => {
        // Actualizar la lista local con la nota editada
        const updatedNotes = notes.map((note) =>
          note.id === editedNote.id ? editedNote : note
        );
        setNotes(updatedNotes);
        setSelectedNote(null); // Deseleccionar la nota editada
      })
      .catch((error) => {
        console.error('Error al editar la nota:', error);
      });
  };

  const deleteNote = (id) => {
    // Lógica para eliminar una nota en la base de datos en Firebase
    fetch(`https://desafio14-notas-default-rtdb.firebaseio.com/notas/${id}.json`, {
      method: 'DELETE',
    })
      .then(() => {
        // Eliminar la nota de la lista local
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        setSelectedNote(null); // Deseleccionar la nota eliminada
      })
      .catch((error) => {
        console.error('Error al eliminar la nota:', error);
      });
  };

  const markAsFavorite = (id) => {
    // Lógica para marcar una nota como favorita en la base de datos en Firebase
    const noteToMark = notes.find((note) => note.id === id);
  const updatedNote = { ...noteToMark, favorite: !noteToMark.favorite };

  fetch(`https://desafio14-notas-default-rtdb.firebaseio.com/notas/${id}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedNote),
  })
    .then((response) => response.json())
    .then(() => {
      // Actualizar la lista local con la nota marcada como favorita
      const updatedNotes = notes.map((note) =>
        note.id === id ? updatedNote : note
      );
      setNotes(updatedNotes);
    })
    .catch((error) => {
      console.error('Error al marcar favorita la nota:', error);
    });
  };

  return (
    <div>
      <h1>Notas</h1>
      <NoteForm addNote={addNote} selectedNote={selectedNote} />
      <NoteList
        notes={notes}
        editNote={editNote}
        deleteNote={deleteNote}
        markAsFavorite={markAsFavorite}
        setSelectedNote={setSelectedNote}
        selectedNote={selectedNote}
      />
    </div>
  );
};

export default App;