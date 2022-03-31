import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GalleryHome from "./components/GalleryHome";
import TopNavBar from "./components/TopNavBar"
import BottomNavBar from "./components/BottomNavBar";
import Context from "./scripts/context";
import NetworkInfoState from "./NetworkConfig";
import ItemDetails from "./components/ItemDetails";
import Profile from './components/Profile'
import NewItem from './components/NewItem'
import { Box } from "@material-ui/core";

const App = React.memo(props => {
  const networkInfo = NetworkInfoState();
  return (
    <Context.Provider value={networkInfo}>
      <Router>
        <TopNavBar />
        <Switch>
          <Route path="/" exact component={GalleryHome} />
          <Route path="/item" component={ItemDetails} />
          <Route path="/profile" component={Profile} />
          <Route path="/newItem" component={NewItem} />
        </Switch>
        <Box paddingBottom={10}></Box>
        <BottomNavBar />
      </Router>
    </Context.Provider>
  );


})

export default App;
