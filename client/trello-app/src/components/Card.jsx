import React, { useState } from 'react';
import './Card.css';

const Card = ({ card, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(card.name);
  const [desc, setDesc] = useState(card.desc || '');

  const handleSave = async () => {
    if (name.trim()) {
      await onUpdate(card.id, { name, desc });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await onDelete(card.id);
    }
  };

  if (isEditing) {
    return (
      <div className="card editing">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Card title"
          autoFocus
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          rows="3"
        />
        <div className="card-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" onClick={() => setIsEditing(true)}>
      <div className="card-content">
        <h4>{card.name}</h4>
        {card.desc && <p className="card-desc">{card.desc}</p>}
      </div>
      <button 
        className="card-delete" 
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Card;
