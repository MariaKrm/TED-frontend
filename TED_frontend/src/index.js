import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Route, Redirect } from "react-router"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import HomePage from "./Home/HomePage"
import CreateAuction from "./Auction/CreateAuction"
import CreateCategory from "./Auction/CreateCategory"
import AuctionPage from "./Auction/AuctionPage"
import EditAuction from "./Auction/EditAuction"
//import UserPage from "./UserPage"
import "./styles/style.css"
import "./styles/form_style.css"
import "./styles/header_style.css"
import "./styles/home_style.css"
import "./styles/auction_style.css"
import "./styles/bid_style.css"

import "react-datepicker/dist/react-datepicker.css"




function App() {
	return (
		<Redirect to='/login' />
	)
}



ReactDOM.render(
	<BrowserRouter> 
		<Route exact path="/" component={App} />
    	<Route path="/login" component={Login} />
    	<Route path="/signup" component={Signup} />
    	<Route path="/home" component={HomePage} />
    	<Route path="/createAuction" component={CreateAuction} />
    	<Route path="/createCategory" component={CreateCategory} />
    	<Route path="/auctions/:id" component={AuctionPage} />
    	<Route path="/editAuction/:id" component={EditAuction} />
{/*    	<Route path="/user/:id" component={UserPage} /> */}
  	</BrowserRouter>,
	document.getElementById("root")
)