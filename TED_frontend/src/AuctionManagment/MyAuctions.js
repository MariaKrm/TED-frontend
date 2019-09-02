import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuctionManagmentControl from "./AuctionManagmentControl"
import AuctionPreview from "../Auction/AuctionPreview"

class MyAuction extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
			openClosed: "Open",
		}

	}

	getOpenAuctions() {
		customRequest("GET", "/user/myOpenAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}

	getClosedAuctions() {
		customRequest("GET", "/user/myCompletedAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}


	componentDidMount() {
		if(!AuthHelper.loggedIn()) {
			return false
		}

		if(this.props.completed) {
			this.setState({
				openClosed: "Closed",
			})
			this.getClosedAuctions()
		}
		else {
			this.setState({
				openClosed: "Open",
			})
			this.getOpenAuctions()
		}
		
	}

	render() {
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		let myAuctions
		if(this.state.auctions) {
			myAuctions = this.state.auctions.map(item => {
				return (
					<AuctionPreview
						key={item.id}
						auction={item}
						history={this.props.history}
					/>
				)
			})
		}
		else {
			myAuctions = []
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="auction-managment">
					<AuctionManagmentControl history={this.props.history} />
					<div className="auction-managment-myactivity">
						<h2 className="auction-managment-myactivity-title">My {this.state.openClosed} Auctions</h2>
						<div>
							{myAuctions}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default MyAuction