import React from 'react';
import Arweave from 'arweave/web'; // Arweave
import moment from 'moment'; // Unix timestamp parsing
import {NavLink} from 'react-router-dom'; // Navigation
import {sort} from '../../utils/sort'; // Sorting by date
import {get_mail_from_tx} from '../../utils/crypto'; // Retrieving mail items from tx
import Address from '../../components/Address'; // Arweave ID
import './index.css';

// Image imports
import emptyInbox from '../../static/images/emptyinbox.png';

export default class Inbox extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [], // Initialize empty mails array
			loading: true // Set loading to true on load
		};
	}

	// Sort by date function
	sortByDate = () => {
		let array = this.state.mail;
		// Use sort() function to sort array
		this.setState({mail: sort(array)});
	};

	retrieveMail = () => {
		const arweave = Arweave.init();

		// Use keyfile from sessionStorage to get address
		arweave.wallets.jwkToAddress(JSON.parse(sessionStorage.getItem('keyfile'))).then(address => {
			
			// Feed address to arql get_blocks_with_mail query
			let get_blocks_with_mail = {
				op: 'and',
				expr1:{
					op: 'equals',
					expr1: 'to',
					expr2: address
				},
				expr2:{
					op: 'equals',
					expr1: 'App-Name',
					expr2: 'permamail'
				}
			}
			
			// Perform query to find permamail tagged emails
			arweave.api.post(`arql`, get_blocks_with_mail).then(async response => {
				let transactions = response.data;

				// For each tx tagged permamail:
				transactions.forEach(async transaction => {
					// Get mail from tx
					get_mail_from_tx(transaction).then(response => {
						// Append mail to mail array
						this.setState(previousState => ({mail: [...previousState.mail, response]}));
					})
				})

				this.setState({loading: false}); // Set loading to false (a.k.a complete)
			})
		})
	}

	componentDidMount() {
		document.title="Weve | Inbox"; // Set page title
		this.retrieveMail(); // Retrieve mail on load
	}

	render() {
		return (
			<div className="list inbox">
				<div>
					<h2>Inbox</h2>
					<span>View latest weve mails</span>
				</div>
				<div>
					<button onClick={this.sortByDate}>Sort by date</button>
				</div>
				<div>
					{this.state.loading ? (
						<div className="loading">
							<i className="fa fa-spinner fa-spin"></i>
							<h5>Retrieving emails</h5>
						</div>
					) : (
						this.state.mail.length ? (
							this.state.mail.map((mail, i) => (
								<MailItem key={i} id={mail.id ? mail.id : ""} from={mail.from} subject={mail.subject} body={mail.body} timestamp={mail.timestamp} />
							))
						) : (
							<div className="empty">
								<img src={emptyInbox} alt="Empty inbox" />
								<h4>No mails found</h4>
							</div>
						)
					)}
				</div>
			</div>
		);
	}
}

class MailItem extends React.Component {
	render() {
		return (
			<NavLink to={`/inbox/${this.props.id}`} activeClassName="active-mail-item" className="mail-item">
				<h6>{this.props.from ? (<Address address={this.props.from} />) : ""}</h6>
				<span>{this.props.subject ? this.props.subject : "No Subject"}</span>
				<span>{this.props.body ? this.props.body : "No Body"}</span>
				<span>{this.props.timestamp ? moment.unix(this.props.timestamp).fromNow() : ""}</span>
			</NavLink>
		);
	}
}
