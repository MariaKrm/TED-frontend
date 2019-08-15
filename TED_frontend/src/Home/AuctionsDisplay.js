import React, { Component } from "react"
import Swal from "sweetalert2"
import { request } from "../utils/AuthHelper"
import AuctionPreview from "../Elements/AuctionPreview"
import testAuctions from "./testItems.js"

class AuctionsDisplay extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
		}

		this.getAuctions = this.getAuctions.bind(this)
	}


	getAuctions() {
		console.log("getAuctions")
	//	axios.get(Constants.BASEURL + "/item/auctions", {headers: AuthHelper.getAuthHeader()} )
		request("GET", "/item/openAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data,
			})
		}).catch(err => {
            console.log(err)
            var errText = err.response ? err.response.status + ":" + err.response.data.text : err
            Swal.fire({
                type: "error",
                title: "Oops...",
                text: errText,
            })
		})
	}

	componentDidMount() {
		this.getAuctions()
	}

	render() {
		var auctionList
		if(this.state.auctions) {
			auctionList = testAuctions.concat(this.state.auctions)
		}
		else {
			auctionList = testAuctions
		}
		
		const auctions = auctionList.map(item => {
			return (
				<AuctionPreview
					name={item.name}
					media={item.media} 
					buyPrice={item.buyPrice}
					currently={item.currently}
					endsAt={item.endsAt} 
					categories={item.categories} 
					location={item.location}
				/>
			)
		})

		return (
			<div>
				<div className="refresh-button-container">
					<button className="refresh-small" onClick={this.getAuctions}>Refresh</button>
				</div>
				{auctions}
			</div>
		)
	}
}


export default AuctionsDisplay