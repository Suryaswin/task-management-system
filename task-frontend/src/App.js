import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App({ token, setToken }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To-Do');
  const [priority, setPriority] = useState('High');
  const [editingTask, setEditingTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const fetchTasks = () => {
    const url = filterPriority
      ? `http://localhost:8080/tasks?priority=${filterPriority}&page=${page}&size=5`
      : `http://localhost:8080/tasks?page=${page}&size=5`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  useEffect(() => {
    if (!token) navigate('/');
    else {
      fetchTasks();
      const interval = setInterval(fetchTasks, 5000);
      return () => clearInterval(interval);
    }
  }, [token, filterPriority, page, navigate, fetchTasks]); // Added fetchTasks

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = { title, description, status, priority };
    const url = editingTask ? `http://localhost:8080/tasks/${editingTask.id}` : 'http://localhost:8080/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save task');
        return response.json();
      })
      .then(data => {
        if (editingTask) {
          setTasks(tasks.map(t => t.id === editingTask.id ? data : t));
          setEditingTask(null);
        } else {
          setTasks([...tasks, data]);
        }
        setTitle('');
        setDescription('');
        setStatus('To-Do');
        setPriority('High');
        fetchTasks();
      })
      .catch(error => console.error('Error saving task:', error));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
        fetchTasks();
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setToken(null);
      navigate('/');
    }
  };

  return (
    <div className="App">
      <h1>Task Management</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
      </form>
      <div className="filter">
        <label>Filter by Priority: </label>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={() => setFilterPriority('')}>Clear Filter</button>
      </div>
      <div>
        <button onClick={() => setPage(page > 0 ? page - 1 : 0)}>Previous</button>
        <span> Page {page + 1} </span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.title} - {task.status} (Priority: {task.priority})</span>
            <div>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;