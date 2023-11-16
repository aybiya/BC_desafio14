import React, { useState } from 'react';
import NoteForm from './NoteForm'; // Importar NoteForm para el diseño en edición de las notas


const NoteList = ({ notes, editNote, deleteNote, markAsFavorite, selectedNote, setSelectedNote }) => {
  const [editing, setEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: '', content: '' });

  const handleEdit = (note) => {
    setEditedNote(note);
    setEditing(true);
    setSelectedNote(note);
  };

  
  const handleSave = (editedNote) => {
    editNote({
      ...editedNote,
      id: selectedNote.id,
    });
    setEditing(false);
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedNote(null);
  };

  return (
    <ul className='notes-list'>
      {notes.map((note) => (
        <li key={note.id}>
          {editing && selectedNote && note.id === selectedNote.id ? (
            // Renderiza el formulario de edición utilizando NoteForm
            <NoteForm addNote={handleSave} selectedNote={selectedNote} onCancel={handleCancel} />
          ) : (
            <section>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <article className='list-btns'>
                <button className='fav-btn' onClick={() => markAsFavorite(note.id)}>
                  {note.favorite ? 'Sacar de favorito' : 'Favorito'}
                </button>
                <button onClick={() => handleEdit(note)}>Editar</button>
                <button className='delete-btn' onClick={() => deleteNote(note.id)}>Eliminar</button>
              </article>
            </section>
          )}
        </li>
      ))}
    </ul>
  );
};

  export default NoteList;