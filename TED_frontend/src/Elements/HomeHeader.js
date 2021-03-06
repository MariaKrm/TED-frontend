import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"
import Header from "./Header"
import AccountButtons from "./AccountButtons"
import SearchBar from "../Search/SearchBar"

//Header with SearchBar for Home
class HomeHeader extends Component {
	render() {
		return (
			<div>
				<div className="home-header">
					<Header />
					<div className="home-header-search">
						<SearchBar history={this.props.history} />
					</div>
					<AccountButtons history={this.props.history} />
				</div>
				{AuthHelper.displayVisitorSign()}
			</div>
		)
	}
}

export default HomeHeader