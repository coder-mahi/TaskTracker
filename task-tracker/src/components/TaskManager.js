import React, { useEffect, useState } from 'react';
import AddTask from './AddTask';
import TaskList from './TaskList';
import axios from 'axios';
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await axios.get('${process.env.BACKEND_URI}/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (task) => {
    const token = localStorage.getItem('token'); 
    try {
      await axios.post('${process.env.BACKEND_URI}/addtask', task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  const deleteTask = async (taskId) => {
    console.log(`Delete task with ID: ${taskId}`);
  };
  return (
    <div>
      <AddTask onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
};

export default TaskManager;
