import { useState, useEffect } from 'react';
import Board from './components/Board';
import { getAllBoards, createBoard, deleteBoard } from './services/api';
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isManaging, setIsManaging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBoardIds, setSelectedBoardIds] = useState([]);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await getAllBoards();
      setBoards(data);
      if (data.length > 0) {
        setSelectedBoard(data[0]);
      }
    } catch (error) {
      console.error('Error loading boards:', error);
      alert('Failed to load boards. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (newBoardName.trim()) {
      // Check if board with same name already exists
      const boardExists = boards.some(
        board => board.name.toLowerCase() === newBoardName.trim().toLowerCase()
      );
      
      if (boardExists) {
        setErrorMessage('Board already exists! Please choose a different name.');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }

      try {
        const newBoard = await createBoard(newBoardName);
        setBoards([...boards, newBoard]);
        setSelectedBoard(newBoard);
        setNewBoardName('');
        setIsCreatingBoard(false);
      } catch (error) {
        console.error('Error creating board:', error);
        setErrorMessage('Failed to create board. Please try again.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        await deleteBoard(boardId);
        const updatedBoards = boards.filter(b => b.id !== boardId);
        setBoards(updatedBoards);
        
        if (selectedBoard?.id === boardId) {
          setSelectedBoard(updatedBoards.length > 0 ? updatedBoards[0] : null);
        }
      } catch (error) {
        console.error('Error deleting board:', error);
        alert('Failed to delete board');
      }
    }
  };

  const handleToggleBoardSelection = (boardId) => {
    setSelectedBoardIds(prev => 
      prev.includes(boardId) 
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleSelectAllBoards = () => {
    if (selectedBoardIds.length === boards.length) {
      setSelectedBoardIds([]);
    } else {
      setSelectedBoardIds(boards.map(b => b.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBoardIds.length === 0) {
      setErrorMessage('Please select at least one board to delete.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (selectedBoardIds.length === boards.length) {
      setErrorMessage('Cannot delete all boards. At least one board must remain.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedBoardIds.length} board(s)? This action cannot be undone.`)) {
      try {
        await Promise.all(selectedBoardIds.map(id => deleteBoard(id)));
        const updatedBoards = boards.filter(b => !selectedBoardIds.includes(b.id));
        setBoards(updatedBoards);
        
        if (selectedBoardIds.includes(selectedBoard?.id)) {
          setSelectedBoard(updatedBoards.length > 0 ? updatedBoards[0] : null);
        }
        
        setSelectedBoardIds([]);
      } catch (error) {
        console.error('Error deleting boards:', error);
        setErrorMessage('Failed to delete some boards. Please try again.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleDeleteAllBoards = async () => {
    if (confirm('Are you sure you want to delete ALL boards? This action cannot be undone and will remove all your boards!')) {
      if (confirm('This is your final warning! All boards will be permanently deleted. Continue?')) {
        try {
          // Delete all except one (Trello requires at least one board)
          const boardsToDelete = boards.slice(0, -1);
          await Promise.all(boardsToDelete.map(b => deleteBoard(b.id)));
          
          const remainingBoard = boards[boards.length - 1];
          setBoards([remainingBoard]);
          setSelectedBoard(remainingBoard);
          setSelectedBoardIds([]);
          setIsManaging(false);
          
          setErrorMessage('All boards deleted except one (at least one board is required).');
          setTimeout(() => setErrorMessage(''), 4000);
        } catch (error) {
          console.error('Error deleting all boards:', error);
          setErrorMessage('Failed to delete all boards. Please try again.');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading your boards...</p>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="app-empty">
        <h1>No Boards Found</h1>
        <p>Create a board in Trello or use the backend API to create one.</p>
      </div>
    );
  }

  return (
    <div className="app">
      {errorMessage && (
        <div className="error-popup">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{errorMessage}</span>
        </div>
      )}
      
      <nav className="app-nav">
        <h1>🚀 Trello Clone</h1>
        <div className="board-selector">
          <select 
            value={selectedBoard?.id || ''} 
            onChange={(e) => {
              const board = boards.find(b => b.id === e.target.value);
              setSelectedBoard(board);
            }}
          >
            {boards.map(board => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="board-actions">
          {isCreatingBoard ? (
            <div className="create-board-form">
              <input
                type="text"
                placeholder="Enter board name..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()}
                autoFocus
              />
              <button className="btn-create-board" onClick={handleCreateBoard}>
                Create
              </button>
              <button className="btn-cancel-board" onClick={() => {
                setIsCreatingBoard(false);
                setNewBoardName('');
              }}>
                ✕
              </button>
            </div>
          ) : (
            <>
              <button className="btn-new-board" onClick={() => setIsCreatingBoard(true)}>
                + New Board
              </button>
              <button className="btn-manage-boards" onClick={() => setIsManaging(!isManaging)}>
                {isManaging ? '✓ Done' : '⚙️ Manage Boards'}
              </button>
            </>
          )}
        </div>
      </nav>

      {isManaging && (
        <div className="manage-boards-panel">
          <div className="manage-header">
            <h3>Manage Boards</h3>
            <div className="manage-actions">
              <button 
                className="btn-select-all"
                onClick={handleSelectAllBoards}
              >
                {selectedBoardIds.length === boards.length ? '✓ Unselect All' : '☐ Select All'}
              </button>
              <button 
                className="btn-delete-selected"
                onClick={handleDeleteSelected}
                disabled={selectedBoardIds.length === 0}
              >
                🗑️ Delete Selected ({selectedBoardIds.length})
              </button>
              <button 
                className="btn-delete-all"
                onClick={handleDeleteAllBoards}
              >
                ⚠️ Delete All Boards
              </button>
            </div>
          </div>
          <div className="boards-list">
            {boards.map(board => (
              <div key={board.id} className="board-item">
                <label className="board-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedBoardIds.includes(board.id)}
                    onChange={() => handleToggleBoardSelection(board.id)}
                    className="board-checkbox"
                  />
                  <span className="board-name">{board.name}</span>
                </label>
                <button 
                  className="btn-delete-board"
                  onClick={() => handleDeleteBoard(board.id)}
                  disabled={boards.length === 1}
                  title={boards.length === 1 ? "Cannot delete the last board" : "Delete board"}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBoard && <Board board={selectedBoard} />}
    </div>
  );
}

export default App;
