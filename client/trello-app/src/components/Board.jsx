import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import List from './List';
import { getBoardLists } from '../services/api';
import './Board.css';

const Board = ({ board }) => {
  const [lists, setLists] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (board) {
      loadLists();
    }
  }, [board]);

  const loadLists = async () => {
    try {
      setLoading(true);
      const data = await getBoardLists(board.id);
      setLists(data);
    } catch (error) {
      console.error('Error loading lists:', error);
      alert('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-board">Loading board...</div>;
  }

  return (
    <div className="board">
      <div className="board-header">
        <h2>{board.name}</h2>
      </div>
      
      <div className="lists-container">
        {lists.map(list => (
          <List key={list.id} list={list} socket={socket} />
        ))}
        
        {lists.length === 0 && (
          <div className="no-lists">
            <p>No lists found in this board.</p>
            <p>Create lists in your Trello board first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
