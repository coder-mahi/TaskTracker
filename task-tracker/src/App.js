import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import DefaultPage from './components/DefaultPage';
import Profile from './components/Profile';
import TaskCalendar from './components/TaskCalendar';
import TaskReport from './components/TaskReport'; // Import TaskReport
import { TaskProvider } from './context/TaskContext'; // Import TaskProvider
import './App.css';
import Challenge from './components/Challenge';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(
        localStorage.getItem('isLoggedIn') === 'true' || false
    );

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <TaskProvider>
                <div className="container">
                    <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

                    <Routes>
                        <Route
                            path="/defaultpage"
                            element={isLoggedIn ? <Navigate to="/home" /> : <DefaultPage />}
                        />
                        <Route
                            path="/signup"
                            element={isLoggedIn ? <Navigate to="/home" /> : <Signup onSignup={handleLogin} />}
                        />
                        <Route
                            path="/login"
                            element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/home"
                            element={isLoggedIn ? (
                                <>
                                    <TaskList />
                                    <Footer />
                                </>
                            ) : (
                                <Navigate to="/defaultpage" />
                            )}
                        />
                        <Route
                            path="/addtask"
                            element={isLoggedIn ? <AddTask /> : <Navigate to="/defaultpage" />}
                        />
                        <Route
                            path="/calendar"
                            element={isLoggedIn ? <TaskCalendar /> : <Navigate to="/defaultpage" />}
                        />
                        <Route
                            path="/task-report"
                            element={isLoggedIn ? <TaskReport /> : <Navigate to="/defaultpage" />} // Task Report Route
                        />
                        <Route
                            path="/profile"
                            element={isLoggedIn ? <Profile /> : <Navigate to="/defaultpage" />}
                        />
                        <Route
                            path="*"
                            element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/defaultpage" />}
                        />
    <Route
    path="/challenge"
    element={isLoggedIn ? <Challenge /> : <Navigate to="/defaultpage" />}
/>
                    </Routes>
                </div>
            </TaskProvider>
        </Router>
    );
};

export default App;
