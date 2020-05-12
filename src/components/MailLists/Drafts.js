import React from 'react';
import moment from 'moment';
import { NavLink, withRouter } from 'react-router-dom';
import Address from '../../components/Address';

import emptyInbox from '../../static/images/emptyinbox.png';

class Drafts extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [],
			loading: true
		};
	}
	sortByDate = () => {
		let array = this.state.mail;
		let arrayLength = array.length;
		for (let i = 0; i < arrayLength / 2; i++) {
			let t = array[i];
			array[i] = array[arrayLength - 1 - i];
			array[arrayLength - 1 - i] = t;
		}
		this.setState({mail: array});
	}
	retrieveMail = () => {
		let drafts = sessionStorage.getItem('drafts');
		
		if (drafts !== null) {
			this.setState({mail: JSON.parse(drafts)}, () => this.sortByDate());
		}

		this.setState({loading: false});
	}
	componentDidMount() {
		document.title="Weve | Drafts";
		this.retrieveMail();
	}
	componentDidUpdate(prevProps) {
		this.props.history.listen(() => {
			this.retrieveMail();
		});
	}
	render() {
		return (
			<div className="list drafts">
				<div>
					<h2>Drafts</h2>
					<span>View locally-stored drafts</span>
				</div>
				<div>
					<button onClick={this.sortByDate}>Sort by date</button>
				</div>
				<div>
					{this.state.loading ? (
						<div className="loading">
							<i className="fa fa-spinner fa-spin"></i>
							<h5>Retrieving drafts</h5>
						</div>
					) : (
						this.state.mail.length ? (
							this.state.mail.map((mail, i) => (
								<MailItem key={i} id={mail.id ? mail.id : ""} to={mail.to} subject={mail.subject} body={mail.body} timestamp={mail.timestamp} />
							))
						) : (
							<div className="empty">
								<img src={emptyInbox} alt="Empty drafts" />
								<h4>No drafts found</h4>
							</div>
						)
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(Drafts);

class MailItem extends React.Component {
	render() {
		return (
			<NavLink to={`/drafts/${this.props.id}`} activeClassName="active-mail-item" className="mail-item">
				<h6>{this.props.to ? (<Address address={this.props.to} />) : ""}</h6>
				<span>{this.props.subject ? this.props.subject : "No Subject"}</span>
				<span>{this.props.body ? this.props.body : "No Body"}</span>
				<span>{this.props.timestamp ? moment(this.props.timestamp).fromNow() : ""}</span>
			</NavLink>
		);
	}
}
