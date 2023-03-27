import React from 'react';
import moment from 'moment'; // Unix timestamp parsing
import { NavLink } from 'react-router-dom'; // Navigation
import { sort } from '../../utils/sort'; // Sorting by date
import { get_mail_from_tx } from '../../utils/crypto'; // Retrieving mail items from tx
import Address from '../../components/Address'; // Arweave ID
import Store from '../../stores'; // Store to save inbox on load
import { FixedSizeList as List } from 'react-window'; // React-window list to efficiently render inbox
import AutoSizer from 'react-virtualized-auto-sizer'; // Auto-sizer for react-window parent dimensions
import { getWeavemailTransactions } from '../../utils/query';
import { arweave } from '../../utils/globals';
import './index.css';

class Inbox extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [], // Initialize empty mails array
			loading: true, // Set loading to true on load
			mobile: false // Set mobile to true on load
		};
	}

	// Handle window resizing impact on itemWidth of react-window list
	updateDimensions = e => {
		// If window width > 760
		if (window.innerWidth > 760) {
			this.setState({ mobile: false }); // Mobile layout to false
		} else {
			this.setState({ mobile: true }); // Mobile layout to true
		}
	};

	// Sort by date function
	sortByDate = () => {
		let array = this.state.mail;
		// Use sort() function to sort array
		this.setState({ mail: sort(array) });
	};

	retrieveMail = () => {
		let store = this.props.store; // Setup undux store;

		let cachedInbox = store.get('inbox'); // Collect cached inbox

		// If cached inbox contains emails
		if (cachedInbox.length > 0) {
			// Set mail to cached emails and toggle loading
			this.setState({ mail: cachedInbox, loading: false });
		} else {
			// Use keyfile from sessionStorage to get address
			arweave.wallets.jwkToAddress(JSON.parse(sessionStorage.getItem('keyfile'))).then(address => {
				getWeavemailTransactions(arweave, address)
					.then(results => {
						console.log("GraphQL query results:");
						console.log(results);
						let transactions = results.data.transactions.edges;
						let counter = 0; // Setup current mail counter
						let t = this;

						if (transactions.length > 0) {
							Promise.all(transactions.map(async function (edge, i) {
								// Get mail from tx
								return get_mail_from_tx(edge.node)
									.then(response => {
										if (response) {
											console.log(response);
											console.log(counter);
											console.log(t);
											// Append mail to mail array
											t.setState(previousState => ({ mail: [...previousState.mail, response] }), () => {
												counter++; // Increment current mail counter
											})
										}
									})
							})) // After Promise.all
								.then(() => {
									store.set('inbox')(this.state.mail); // Update inbox in undux store
									t.setState({ loading: false }); // Toggle loading
								});
						} else {
							t.setState({ loading: false });
						}
					});
			})
		}
	}
	componentDidMount() {
		document.title = "Weve | Inbox"; // Set page title
		this.updateDimensions(); // Update dimensions on load
		window.addEventListener('resize', this.updateDimensions.bind(this)); // Setup an event listener for resize
		this.retrieveMail(); // Retrieve mail on load
	}

	componentWillUnmount() {
		// Remove event listener on component unmount for performance
		window.removeEventListener('resize', this.updateDimensions.bind(this));
	}

	// Render inbox rows
	rowRenderer = ({ key, index, style }) => {
		let mail = this.state.mail[index]; // Access individual row item
		return (
			// Render row item
			<div key={key} style={style}>
				<MailItem
					key={key}
					id={mail.id ? mail.id : ""}
					from={mail.from}
					subject={mail.subject}
					body={mail.body}
					timestamp={mail.timestamp}
				/>
			</div>
		);
	};

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
							<h5>Retrieving {this.state.mail.length} emails</h5>
						</div>
					) : (
						this.state.mail.length ? (
							<AutoSizer>
								{({ width, height }) =>
									<List height={height} width={width} itemCount={this.state.mail.length} itemSize={this.state.mobile ? 220 : 90.5} layout={this.state.mobile ? "horizontal" : "vertical"} sortChange={this.state.mail[0]}>
										{this.rowRenderer}
									</List>
								}
							</AutoSizer>
						) : (
							<div className="empty">
								<img src="https://4w7orsbanx7o.arweave.net/d1jWkewQFS3ZI2xpGH9amsrx-IsNzkoucAbf1T4-4qE/emptyinbox.png" alt="Empty inbox" />
								<h4>No mails found</h4>
							</div>
						)
					)}
				</div>
			</div>
		);
	}
}

export default Store.withStore(Inbox);

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
