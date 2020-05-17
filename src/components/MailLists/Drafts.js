import React from 'react';
import moment from 'moment'; // Unix timestamp parsing
import {sort} from '../../utils/sort'; // Sorting by date
import { NavLink, withRouter } from 'react-router-dom'; // Navigation
import Address from '../../components/Address'; // Arweave ID

class Drafts extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [], // Initialize mails array to empty
			loading: true // Set loading mail to default at load
		};
	}

	// Sort by date function
	sortByDate = () => {
		let array = this.state.mail;
		// Use sort() function to sort array
		this.setState({mail: sort(array)});
	};

	// Retrieve drafts function
	retrieveMail = () => {
		let drafts = sessionStorage.getItem('drafts'); // Get drafts array from sessionStorage
		
		// If drafts array contains drafts
		if (drafts !== null) {
			// Parse those drafts and sort automatically
			this.setState({mail: JSON.parse(drafts)}, () => this.sortByDate());
		}

		this.setState({loading: false}); // Set loading to false (a.k.a complete)
	}

	componentDidMount() {
		document.title="Weve | Drafts"; // Set page title
		this.retrieveMail(); // Retrieve drafts on load
	}

	componentDidUpdate(prevProps) {
		// On path change
		this.props.history.listen(() => {
			// Update mail
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
								<img src="https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/emptyinbox.png" alt="Empty drafts" />
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
