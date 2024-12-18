// require('dotenv').config(); // Load environment variables from .env file
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const cron = require('node-cron');

// const app = express();
// const port = 5000;

// app.use(express.json());
// app.use(cors());

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Mongoose Schemas and Models
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   profilePicture: { type: String }, // Optional field for profile picture URL
// });

// const User = mongoose.model('User', userSchema);

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   reminderTime: { type: Date, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Task = mongoose.model('Task', taskSchema);

// // Email Transport Configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or any other email service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Function to schedule email reminders
// const scheduleEmailReminder = (task) => {
//   const reminderDate = new Date(task.reminderTime);
//   const reminderTime = reminderDate.getTime() - Date.now(); // Calculate delay

//   // Schedule the job to run at the reminder time
//   if (reminderTime > 0) { // Only schedule if the time is in the future
//     const job = cron.schedule(`*/1 * * * *`, async () => {
//       const currentTime = Date.now();
//       if (currentTime >= reminderDate.getTime()) {
//         try {
//           // Fetch user email from the database
//           const user = await User.findById(task.userId);
//           if (!user) {
//             console.error('User not found for task:', task._id);
//             return; // Exit if user not found
//           }

//           const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: 'Task Reminder',
//             text: `Reminder for your task: ${task.title}\nDescription: ${task.description}`,
//           };

//           await transporter.sendMail(mailOptions);
//           console.log('Reminder email sent to:', user.email);
//           // Stop the cron job after sending
//           job.stop(); // Use job.stop() to stop this specific job
//         } catch (error) {
//           console.error('Error sending email:', error);
//         }
//       }
//     });
//   }
// };

// // Signup Route
// app.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error('Error during signup:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // Add Task Route
// app.post('/addtask', async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const { title, description, reminderTime } = req.body;

//     if (!title || !description || !reminderTime) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Create a new task
//     const task = new Task({
//       title,
//       description,
//       userId,
//       reminderTime
//     });

//     await task.save();

//     // Schedule the email reminder
//     scheduleEmailReminder(task);

//     res.status(201).json({ message: 'Task added successfully', task });
//   } catch (err) {
//     console.error('Error adding task:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get All Tasks Route for the User
// app.get('/tasks', async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const tasks = await Task.find({ userId });
//     res.status(200).json(tasks);
//   } catch (err) {
//     console.error('Error fetching tasks:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/gettasks', async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     // Fetch tasks for the user
//     const tasks = await Task.find({ userId });
//     res.status(200).json(tasks);
//   } catch (err) {
//     console.error('Error fetching tasks:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // Login Route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token });
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Delete Task Route
// app.delete('/deletetask/:id', async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     // Ensure the task belongs to the user
//     if (!task.userId.equals(userId)) {
//       return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this task' });
//     }

//     await Task.deleteOne({ _id: req.params.id });
//     res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting task:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // Protected Home Route
// app.get('/home', (req, res) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({ message: `Welcome back, user ${decoded.id}` });
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// });

// // User Profile Route
// app.get('/api/user/profile', async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select('-password');

//       if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//       }

//       res.status(200).json({
//           username: user.username,
//           email: user.email,
//           profilePicture: user.profilePicture // Optional field
//       });
//   } catch (err) {
//       console.error('Error fetching user profile:', err);
//       res.status(401).json({ error: 'Invalid token' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
});
const User = mongoose.model('User', UserSchema);

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  reminderTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
const Task = mongoose.model('Task', TaskSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// User registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a task
app.post('/tasks', authenticate, async (req, res) => {
  const { title, description, reminderTime } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const task = new Task({ userId: req.user.id, title, description, reminderTime });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks for the logged-in user
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users except the current user
app.get('/users', authenticate, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('username email profilePicture');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks for a specific user
app.get('/tasks/:userId', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).select('title description reminderTime createdAt');
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks for user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send collaboration request
app.post('/challenge', authenticate, async (req, res) => {
  const { toUserId, taskId, message } = req.body;

  if (!toUserId || !taskId || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const recipient = await User.findById(toUserId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const task = await Task.findById(taskId);
    if (!task || !task.userId.equals(toUserId)) {
      return res.status(400).json({ error: 'Invalid task or task does not belong to recipient' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient.email,
      subject: 'Collaboration Request',
      text: `You have received a collaboration request:\n\n${message}\nTask: ${task.title}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error('Error sending collaboration request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
