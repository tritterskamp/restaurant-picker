import React, { Component } from "react";
import PropTypes from "prop-types";

class AddRestaurantForm extends Component {
    constructor() {
        super();

        //binding methods:
        this.addNewSubmit = this.addNewSubmit.bind(this);
    }
  addNewSubmit(e) {
    e.preventDefault();
    // generate unique restaurant key
    const timestamp = Date.now();
    const restaurantKey = `restaurant-${timestamp}`;
    // Create object of new restaurant data from form
    const newRestaurant = {
      restaurantName: this.restaurantName.value,
      restaurantWebsite: this.restaurantWebsite.value,
      haveVisited: this.haveVisited.value,
      restaurantKey: restaurantKey
    };
    this.props.addRestaurant(newRestaurant);
    this.newRestaurantForm.reset();
  }

  render() {
    
    return <div>
        <h1 className="text-center">Add a new restaurant</h1>
        <form ref={input => (this.newRestaurantForm = input)} className="form-block js-add-new" onSubmit={e => this.addNewSubmit(e)}>
          <div className="form-group">
            <label htmlFor="restaurantName">Restaurant Name:</label>
            <input ref={input => (this.restaurantName = input)} className="form-block__input form-control" type="text" name="restaurantName" />
          </div>
          <div className="form-group">
            <label htmlFor="restaurantWebsite">Restaurant Website:</label>
            <input ref={input => (this.restaurantWebsite = input)} className="form-block__input form-control" type="text" name="restaurantWebsite" />
          </div>
          <div className="form-group">
            <label htmlFor="haveVisited">Have you visited?</label>
            <select ref={input => (this.haveVisited = input)} name="haveVisited" className="form-block__select form-control" type="select">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="form-group">
            <button className="form-block__button btn btn-outline-dark" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>;
  }
}

AddRestaurantForm.propTypes = {
  addRestaurant: PropTypes.func.isRequired
}

export default AddRestaurantForm;