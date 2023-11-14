import React, { useState } from 'react';

const NoteForm = ({ addNote, selectedNote, onCancel }) => {
  const [note, setNote] = useState(selectedNote || { title: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.title || !note.content) return;
    if (selectedNote) {
      // Llama a la función para editar la nota
      addNote({
        ...note,
        id: selectedNote.id,
      });
    } else {
      addNote(note);
    }
    // Reinicia el estado después de guardar
    setNote({ title: '', content: '' });
  };

  return (
    <form className='notes' onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Contenido de la nota"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
      <article className='notes-btns'>
        <button type="submit">Guardar</button>
        {onCancel && <button className='cancel-btn' type="button" onClick={onCancel}>Cancelar</button>}
      </article>
    </form>
  );
};

export default NoteForm;