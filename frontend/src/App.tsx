import Authpage from "./pages/Authpage";
import Chatpage from "./pages/Chatpage";
import NotFound from "./pages/NotFound";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Authpage />} />
        <Route path="/chats" element={<Chatpage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
