import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'Proszę wpisz wartość');
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Wartość zmieniona');
    } else {
      showAlert(true, 'success', 'Dodano do listy');
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName('');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, 'danger', 'Wyczyszczono listę');
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, 'danger', 'Usunięto pozycję');
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);
  return (
    <>
    <h1 className='flying flying--1'>Kamil Langer's TODO app</h1>
    <p className='flying flying--2'>Po odświeżeniu strony pozycje zostają zapisane</p>
    <section className='todo-app'>
      <form className='form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>Do zrobienia</h3>
        <div className='form__control'>
          <input
            type='text'
            className='form__item'
            placeholder='np. Wyrzucić smieci'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'Edytuj' : 'Dodaj'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='form__items'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            Czyść
          </button>
        </div>
      )}
    </section>
    </>
  );
}

export default App;
