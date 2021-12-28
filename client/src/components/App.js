import { Routes, Route } from "react-router-dom";
import Authorization from './Authorization';
import Chat from './Chat';
import { PrivateRoute } from '../routes/privatRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Authorization />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
