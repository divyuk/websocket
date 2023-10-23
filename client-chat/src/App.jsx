import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState({});
  const [users, setUsers] = useState([]);
  const socket = io("http://localhost:8000/");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("message", (mes) => {
      console.log("message", mes);
      setMessage(mes);
    });

    // socket.on("roomUsers", (r, u) => {
    //   setRoom(r);
    //   // setUsers((prev) => [...prev, u]);
    // });

    // Clean up the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const sendData = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", { username, room });
  };
  return (
    <div className="App">
      <h1>WebSocket React App</h1>
      <p>Message</p>
      <h3>{message.username}</h3>
      <p>{message.text}</p>
      <p>{message.time}</p>

      <form>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Program Name</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={sendData}>Submit</button>
      </form>

      <ul>
        {users.map((un, i) => (
          <li key={i}>{un}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
