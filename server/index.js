import {Server} from 'socket.io'

const io = new Server(3000, {
    cors: "true",
});
const ADMIN_ID = 'admin'; // Hardcoded admin ID


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendAdmin', () => {
    socket.emit('adminId', ADMIN_ID);
  });

  socket.on('draw', (data) => {
    if (data.userId === ADMIN_ID) {
      io.emit('draw', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

