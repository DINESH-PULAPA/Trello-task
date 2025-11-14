import React, { useState, useEffect } from 'react';
import Card from './Card';
import { getTasksForList, createTask, updateTask, deleteTask } from '../services/api';
import './List.css';

const List = ({ list, socket }) => {
  const [cards, setCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, [list.id]);

  useEffect(() => {
    if (socket) {
      socket.on('taskCreated', (task) => {
        if (task.idList === list.id) {
          setCards(prev => [...prev, task]);
        }
      });

      socket.on('taskUpdated', (task) => {
        setCards(prev => prev.map(c => c.id === task.id ? task : c));
      });

      socket.on('taskDeleted', ({ cardId }) => {
        setCards(prev => prev.filter(c => c.id !== cardId));
      });

      return () => {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
      };
    }
  }, [socket, list.id]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await getTasksForList(list.id);
      setCards(data);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (newCardName.trim()) {
      try {
        await createTask(list.id, newCardName);
        setNewCardName('');
        setIsAddingCard(false);
      } catch (error) {
        console.error('Error creating card:', error);
        alert('Failed to create card');
      }
    }
  };

  const handleUpdateCard = async (cardId, updates) => {
    try {
      await updateTask(cardId, updates);
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Failed to update card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteTask(cardId);
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.name}</h3>
        <span className="card-count">{cards.length}</span>
      </div>

      <div className="cards-container">
        {loading ? (
          <div className="loading">Loading cards...</div>
        ) : (
          cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onUpdate={handleUpdateCard}
              onDelete={handleDeleteCard}
            />
          ))
        )}
      </div>

      {isAddingCard ? (
        <div className="add-card-form">
          <textarea
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            placeholder="Enter card title..."
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              }
            }}
          />
          <div className="add-card-actions">
            <button onClick={handleAddCard} className="btn-add">Add Card</button>
            <button onClick={() => {
              setIsAddingCard(false);
              setNewCardName('');
            }} className="btn-cancel">×</button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setIsAddingCard(true)}>
          + Add a card
        </button>
      )}
    </div>
  );
};

export default List;
