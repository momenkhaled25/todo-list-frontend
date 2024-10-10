import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import Avatar from "react-avatar";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDetails, setNewTaskDetails] = useState("");
  const [tasks, setTasks] = useState([]);
    
    const navigate = useNavigate();


  // Function to fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/task/get-all-tasks");
      console.log(response.data); 
      if (Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks); 
      } else {
        console.error("Fetched data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks(); 
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (newTaskTitle.trim() === "" || newTaskDetails.trim() === "") return;

    try {
      const response = await axiosInstance.post("/task/createtask", {
        title: newTaskTitle,
        details: newTaskDetails,
      });

      if (response.status === 201) {
        setTasks([...tasks, response.data]);
        setNewTaskTitle("");
        setNewTaskDetails("");
        
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      
      const response = await axiosInstance.patch(`/task/update-completion/${taskId}`);

      if (response.status === 200) {
      
        const updatedTask = response.data.task;
  
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, completed: updatedTask.completed } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };
  

  const handleEditTask = async (taskId) => {
    console.log("Editing task with ID:", taskId);
    const taskToEdit = tasks.find((task) => task._id === taskId);

    if (!taskToEdit) {
      console.error("Task not found");
      return;
    }
  
    const updatedTitle = prompt("Edit your task title", taskToEdit.title);
    const updatedDetails = prompt("Edit your task details", taskToEdit.details);
  
    if (updatedTitle !== null && updatedDetails !== null) {
      try {
        const response = await axiosInstance.patch(`/task/update-task/${taskId}`, {
          title: updatedTitle,
          details: updatedDetails,
        });
  
        if (response.status === 200) {
          setTasks(
            tasks.map((task) =>
              task._id === taskId ? { ...task, title: updatedTitle, details: updatedDetails } : task
            )
          );
        }
      } catch (error) {
        console.error("Error updating task data:", error);
      }
    }
  };
  

const handleDeleteTask = async (taskId) => {
try {
 const response = await axiosInstance.delete(`/task/delete-task/${taskId}`)
      if (response.status === 200) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
}

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-500 p-4 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Hi</span>
          <Avatar name="__" size="40" round={true} />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Add New Task</h2>

        <form onSubmit={handleAddTask} className="mb-6 flex flex-col">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            value={newTaskDetails}
            onChange={(e) => setNewTaskDetails(e.target.value)}
            placeholder="Task Details"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </form>

        <h2 className="text-xl font-bold text-gray-700 mb-4">Your Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`flex flex-col p-4 mb-2 rounded-lg ${
                task.completed ? "bg-green-100 line-through" : "bg-white"
              } shadow-md`}
            >
              <span className="font-bold">{task.title}</span>
              <p className="text-sm text-gray-700">{task.details}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleCompleteTask(task._id)}
                  className={`text-green-500 hover:text-green-600`}
                >
                  <FiCheck size={20} />
                </button>
                <button
                  onClick={() => handleEditTask(task._id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FiEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
