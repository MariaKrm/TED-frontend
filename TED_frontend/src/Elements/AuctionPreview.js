import React, { Component } from "react"


class AuctionPreview extends Component {
	render() {
		const categories = this.props.categories.map(category => {
			return category.name
		})
		const categoryString = categories.join(", ")
		const image = this.props.media ? this.props.media : require("../images/no_image.png")
		const alt = this.props.media ? this.props.name : "no image available"
		const endDate = new Date(this.props.endsAt)
		return (
			<div className="auction-preview">
				<img className="preview-image" src={image} alt={alt}/>
				<div className="preview-text">
					<h3 className="preview-title">{this.props.name}</h3>
					<div className="preview-details">
						<div className="preview-details-left">
							<p className="preview-categories">{categoryString}</p>
							<p className="preview-location">From {this.props.location.locationTitle}</p>
						</div>
						<div className="preview-details-right">
							<p className="preview-current-price">Currently {this.props.currently}€</p>
							{this.props.buyPrice ? <p className="preview-buy-price">or buy immediately for {this.props.buyPrice}€</p> : null}
							<p className="preview-ends-at">Ends at {endDate.toDateString()}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AuctionPreview