import { BrowserRouter, Route, Switch } from "react-router-dom";

// Switch never lets 2 routes to be called at the same time

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";

import { AuthContextProvider } from "./context/AuthContext";


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        {/* exat props talks that the path is exactly that and not started with that */}
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/rooms/new" component={NewRoom}/>
          <Route path="/rooms/:id" component={Room}/>

          <Route path="/admin/rooms/:id" component={AdminRoom}/>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
