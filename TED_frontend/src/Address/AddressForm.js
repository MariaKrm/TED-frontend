import React, {Component} from "react"
import AddressInput from "./AddressInput"
import AddressSuggest from "./AddressSuggest"
import { displayError } from "../utils/ErrorHelper"
import axios from "axios"
import * as Constants from "../Constants/Constants"

// https://developer.here.com/blog/street-address-validation-with-reactjs-and-here-geocoder-autocomplete

class AddressForm extends Component {
	constructor(props) {
		super(props)

		const address = this.getEmptyAddress();
    	this.state = {
      		address: address,
      	 	query: "",
      		locationId: "",
      		coords: {
      			lat: "",
      			lon: ""
      		},
      		isChecked: false,
      		error: "",
    	}

    this.onQuery = this.onQuery.bind(this);
		this.onCheck = this.onCheck.bind(this);
		this.onClear = this.onClear.bind(this);
	}

	getEmptyAddress() {
		return {
			street: "",
			city: "",
			state: "",
			postalCode: "",
			country: ""
		}
	}

	onQuery(event) {
		this.setState( {
			coords: null
		})
		const query = event.target.value
		if(!query.length > 0) {
			const address = this.getEmptyAddress()
			return this.setState({
      		address: address,
      		query: "",
      		locationId: "",
     		})
		}


		axios.get("https://autocomplete.geocoder.api.here.com/6.2/suggest.json", {
			params: {
				app_id: Constants.GEOCODER_ID,
        app_code: Constants.GEOCODER_CODE,
        query: query,
        maxresults: 1,
			}
		}).then(response => {
			const address = response.data.suggestions[0].address;
			const id = response.data.suggestions[0].locationId;
			this.setState({
      		address: address,
      		query: query,
      		locationId: id,
      	})
		}).catch(err => {
      console.error("Address Error: ", err)
    })


		this.props.onAddressSubmit(null, null, null)
	}


	onCheck(evt) {
		let params = {
    		app_id: Constants.GEOCODER_ID,
    		app_code: Constants.GEOCODER_CODE
  		}

  		if(this.state.locationId.length > 0) {
    		params['locationId'] = this.state.locationId;
  		}
  		else {
    		params['searchtext'] = this.state.address.street
      			+ this.state.address.city
      			+ this.state.address.state
      			+ this.state.address.postalCode
      			+ this.state.address.country
  		}

  		axios.get('https://geocoder.api.here.com/6.2/geocode.json',
    		{ params: params }
  		).then(response => {
    		const view = response.data.Response.View

        //Only accepting addresses with at least city and country
    		if(view.length > 0 && view[0].Result.length > 0 && this.state.address.city && this.state.address.country) {
      			const location = view[0].Result[0].Location;
      			const oldCity = this.state.address.city
      			const oldCountry = this.state.address.country

      			this.setState({
        			isChecked: true,
        			coords: {
            			lat: location.DisplayPosition.Latitude,
            			lon: location.DisplayPosition.Longitude
        			},
        			address: {
          				street: location.Address.HouseNumber + ' ' + location.Address.Street,
          				city: location.Address.City,
          				state: location.Address.State,
          				postalCode: location.Address.PostalCode,
         				country: location.Address.Country
        			},
        			error: ""
        		})

      			this.props.onAddressSubmit(this.state.coords, oldCity, oldCountry)

    		}
    		else {
      			this.setState({
        			isChecked: false,
        			coords: null,
        			error: "Please enter a full address"
        		})
    		}
  			
  		}).catch(err => {
        displayError(err)
      })

	}

	onClear() {
		const address = this.getEmptyAddress();
		this.setState({
			address: address,
			query: "",
			locationId: "",
			coords: null,
			isChecked: false,
			error: "",
		})
		this.props.onAddressSubmit(null, null, null)
	}

  componentDidMount() {
    if(this.props.address) {
      const addressArray = this.props.address.split(", ")
      const address = {
        city: addressArray[0],
        country: addressArray[1],
      }

      this.setState({
        query: this.props.address,
        address: address,
      })

    }
  }

  render() {
    return (
      <div className="address-form">
        {this.state.error && this.state.error !== "" && <div className="alert-danger">{this.state.error} </div>}
        <AddressSuggest 
          query={this.state.query}
					onChange={this.onQuery}
				/>
				<br />
				<AddressInput
					street={this.state.address.street}
          city={this.state.address.city}
          state={this.state.address.state}
          code={this.state.address.postalCode}
          country={this.state.address.country}
        />
        <br />
        <button type="button" className="btn btn-light btn-margin" onClick={this.onCheck}>Check</button>
        <button type="button" className="btn btn-light btn-margin" onClick={this.onClear}>Clear</button>
    </div>
		)
	}
}


export default AddressForm