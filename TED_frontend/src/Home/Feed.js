import React, { Component } from "react"
import jsonxml from "jsontoxml"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionsDisplay from "./AuctionsDisplay"
import Filters from "../Search/Filters"
import Recommendations from "./Recommendations"


class Feed extends Component {
	constructor() {
		super()

		this.newAuction = this.newAuction.bind(this)
		this.newCategory = this.newCategory.bind(this)
		this.exportXML = this.exportXML.bind(this)
		this.exportJSON = this.exportJSON.bind(this)
	}


	newAuction() {
		this.props.history.push("/createAuction")
	}

	newCategory() {
		this.props.history.push("/createCategory")
	}

	exportXML() {
		customRequest("GET", "/admin/allAuctions")
		.then(response => {

			const xmls = response.data.map(item => {
				let itemXML = jsonxml(item, {prettyPrint: true})
				itemXML = "<item>" + itemXML + "</item>"
				//itemXML = itemXML.replace("\n", "\n\t")	//doesn't work :/
				return itemXML
			})
			const xml = "<items>\n" + xmls.join("\n") + "\n</items>"

			//Create element with url for xml download
			const element = document.createElement("a");
			const file = new Blob([xml], {type: 'application/xml'});
			element.href = URL.createObjectURL(file);
			element.download = "auctions.xml";
			document.body.appendChild(element); // Required for this to work in FireFox
			element.click();

		}).catch(err => {
            displayError(err)
		})
	}

	exportJSON() {
		customRequest("GET", "/admin/allAuctions")
		.then(response => {

			const jsons = response.data.map(item => {
				let itemJSON = JSON.stringify(item)
				return itemJSON
			})
			const json = jsons.join("\n")

			//Create element with url for json download
			const element = document.createElement("a");
			const file = new Blob([json], {type: "application/json"});
			element.href = URL.createObjectURL(file);
			element.download = "auctions.json";
			document.body.appendChild(element); // Required for this to work in FireFox
			element.click();

		}).catch(err => {
            displayError(err)
		})
	}

	render() {
		return (
			<div className="home-content">
				<div className="search-container">
					<Filters history={this.props.history} />
				</div>
				<div className="main-content">
					<AuctionsDisplay {...this.props} />
				</div>
				<div className="suggestions">
					<div className="right-action-buttons">
						{AuthHelper.loggedIn() ? 
							<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
							: <button className="btn btn-success disabled btn-margin btn-set-size" disabled>New Auction</button>
						}

						<br />
						{AuthHelper.isAdmin() ?
							<div>
								<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newCategory}>New Category</button>
								<br />
								<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.exportXML}>Export All to XML</button>
								<br />
								<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.exportJSON}>Export All to JSON</button>
							</div>
							: null
						}
					</div>
					<br />
					<Recommendations />
				</div>
			</div>
		)
	}
}

export default Feed