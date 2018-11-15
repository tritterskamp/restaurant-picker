import React, { Component } from "react";
import { BrowserRouter, Link, NavLink, Switch, Route } from "react-router-dom";
import base, { auth, provider } from "./base";
import { sortAlphabetically } from "./helpers"
import Home from "./components/Home";
import AddRestaurantForm from "./components/AddRestaurantForm";
import AddWeeklySpecialForm from "./components/AddWeeklySpecialForm";
import EditRestaurant from "./components/EditRestaurant";
import "./css/App.css";


const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantsList: {},
      weeklySpecials: {},
      activeButton: "",
      editRestaurantKey: "",
      user: null
    };

    // Bind methods:
    this.formatRestaurantsList = this.formatRestaurantsList.bind(this);    
    this.addRestaurant = this.addRestaurant.bind(this);
    this.addSpecial = this.addSpecial.bind(this);
    this.editRestaurant = this.editRestaurant.bind(this);
    this.resetRestaurantKey = this.resetRestaurantKey.bind(this);
    this.removeRestaurant = this.removeRestaurant.bind(this);
    this.updateRestaurant = this.updateRestaurant.bind(this);
    this.removeSpecial = this.removeSpecial.bind(this);
    this.updateSpecial = this.updateSpecial.bind(this);
    this.renderActiveButton = this.renderActiveButton.bind(this);
    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this); 
  }

  componentWillMount() {
    //syncs state with firebase data
    base.syncState("restaurants", {
      context: this,
      state: "restaurantsList"
    });
    base.syncState("weeklySpecials", {
      context: this,
      state: "weeklySpecials"
    });
    this.formatRestaurantsList();
    
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
  }

  // Format restaurantsList 
  formatRestaurantsList() {
      let restaurantsList = { ...this.state.restaurantsList };
      restaurantsList = sortAlphabetically(restaurantsList, "restaurantName");
  
      // set state
      this.setState({ restaurantsList });
      console.log(this.state.restaurantsList)
  }

  // Add new functions
  addRestaurant(restaurant) {
    // update our state - make a copy first, this is best practice:
    const restaurantsList = { ...this.state.restaurantsList };
    // add in our new restaurant
    const timestamp = Date.now();
    restaurantsList[`restaurant-${timestamp}`] = restaurant;
    // set state
    this.setState({ restaurantsList });
  }

  addSpecial(restaurant, key) {
    // update our state - make a copy first, this is best practice:
    const weeklySpecials = { ...this.state.weeklySpecials };
    const timestamp = Date.now();
    // add in our new special
    weeklySpecials[`special-${timestamp}`] = restaurant;
    // set state
    this.setState({ weeklySpecials });
  }

  // Edit/remove functions
  editRestaurant(key) {
    this.setState({
      editRestaurantKey: key
    });
  }

  resetRestaurantKey() {
    this.setState({
      editRestaurantKey: ""
    });
  }

  removeRestaurant(key) {
    // take a copy of state
    const restaurantsList = { ...this.state.restaurantsList };
    restaurantsList[key] = null;
    
    //update our state
    this.setState({ restaurantsList });
  }

  updateRestaurant(key, restaurantDetails) {
    // take a copy of state
    const restaurantsList = { ...this.state.restaurantsist };
    restaurantsList[key] = restaurantDetails;
    this.setState({ restaurantsList });
  }

  removeSpecial(keyArray) {
    // take a copy of state
    const weeklySpecials = { ...this.state.weeklySpecials };    
    // there may be multiple specials so map each one to null
    keyArray.map(key => (weeklySpecials[key] = null));

    //update our state
    this.setState({ weeklySpecials });
  }

  updateSpecial(key, specialDetails) {
    // take a copy of state
    const weeklySpecials = { ...this.state.weeklySpecials };
    weeklySpecials[key] = specialDetails;
    this.setState({ weeklySpecials });
  }

  renderActiveButton(target) {
    this.setState({
      activeButton: target
    });
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  }
  login() {
    auth.signInWithRedirect(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <nav className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar justify-content-between">
            <Link to="/" className="navbar-brand mr-0 mr-md-2">
              Restaurant Picker!
            </Link>
            <div className="navbar-nav-scroll">
              <ul className="navbar-nav bd-navbar-nav flex-row">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" exact>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/add-restaurant">Add a Restaurant</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/add-special">Add a Special</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/edit-restaurant">Edit a Restaurant</NavLink>
                </li>
              </ul>
            </div>
            <button className="btn btn-secondary d-lg-inline-block" onClick={this.logout}>Log Out</button>
          </nav>
          <div className="container">
            <div className="row">
              {this.state.user ?
                <div className="col">
                  <Switch>
                    <PropsRoute
                      path="/"
                      exact
                      component={Home}
                      restaurantsList={this.state.restaurantsList}
                      weeklySpecials={this.state.weeklySpecials}
                      activeButton={this.state.activeButton}
                      renderActiveButton={this.renderActiveButton}
                      user={this.state.user}
                    />
                    <PropsRoute
                      path="/add-restaurant"
                      component={AddRestaurantForm}
                      restaurantsList={this.state.restaurantsList}
                      addRestaurant={this.addRestaurant}
                    />
                    <PropsRoute
                      path="/add-special"
                      component={AddWeeklySpecialForm}
                      restaurantsList={this.state.restaurantsList}
                      addSpecial={this.addSpecial}
                    />
                    <PropsRoute
                      path="/edit-restaurant"
                      component={EditRestaurant}
                      restaurantsList={this.state.restaurantsList}
                      weeklySpecials={this.state.weeklySpecials}
                      editRestaurantKey={this.state.editRestaurantKey}
                      editRestaurant={this.editRestaurant}
                      resetRestaurantKey={this.resetRestaurantKey}
                      removeRestaurant={this.removeRestaurant}
                      updateRestaurant={this.updateRestaurant}
                      removeSpecial={this.removeSpecial}
                      updateSpecial={this.updateSpecial}
                    />
                  </Switch>
                </div>
                :
                <div className="text-center col">
                  <h1>Please log in</h1>
                  <button className="btn btn-secondary" onClick={this.login}>Log In</button>              
                </div>
              }
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
