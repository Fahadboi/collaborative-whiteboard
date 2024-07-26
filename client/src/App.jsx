import { useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Change the URL to your server's address

function App() {
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  useEffect(() => {
    socket.emit('sendAdmin');
    socket.on('adminId', (adminId) => {
      const id = prompt('Enter your user ID:'); // Prompt user to enter their ID
      setUserId(id);
      if (id === adminId) {
        setIsAdmin(true);
      }
    });

    socket.on('draw', (data) => {
      if (excalidrawAPI && data.userId !== userId) {
        console.log(data);
        excalidrawAPI.updateScene({ elements: data.elements });
      }
      console.log(data);
      console.log(excalidrawAPI);
    });

    return () => {
      socket.off('adminId');
      socket.off('draw');
    };
  }, [excalidrawAPI, userId]);

  const handleChange = (elements) => {
    if (isAdmin) {
      socket.emit('draw', { userId, elements });
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Excalidraw Example</h1>
      <div style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Excalidraw
          excalidrawAPI={(api)=> setExcalidrawAPI(api)}
          theme='dark'
          onChange={(elements) => handleChange(elements)}
          initialData={{ elements: [], appState: {} }}
          viewModeEnabled={!isAdmin} // Only allow drawing if the user is an admin
        />
      </div>
    </>
  );
}

export default App;
