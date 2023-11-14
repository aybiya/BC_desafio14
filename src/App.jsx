import React, { useState, useEffect } from 'react';
import "./App.css";
import NoteList from './NoteList';
import NoteForm from './NoteForm';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    // API de Firebase para obtener las notas
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
      });
    // Después de agregarla, puedes actualizar el estado local con setNotes([...notes, newNote])
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
      });
    // Después de editarla, puedes actualizar el estado local con setNotes(newNotesArray)
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
      });
    // Después de eliminarla, puedes actualizar el estado local con setNotes(newNotesArray)
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
    });
    // Después de marcarla, puedes actualizar el estado local con setNotes(newNotesArray)
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
        selectedNote={selectedNote} // Pasa selectedNote como prop
      />
    </div>
  );
};

export default App;