import React from 'react';
import Arweave from 'arweave/web'; // Arweave
import moment from 'moment'; // Unix timestamp parsing
import Store from '../../stores'; // Store to save sent on load
import {get_sent_mail_from_tx} from '../../utils/crypto'; // Retrieving sent mail items from tx
import Address from '../Address'; // Arweave ID
import ReactTable from 'react-table-6'; // React table
import 'react-table-6/react-table.css'; // React table styling
import './index.css'; // Overall styling
import './table.css'; // Sent table specific styling

class Sent extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [], // Initialize empty mails array
			loading: true, // Set loading to true on load
		};
	}

	retrieveMail = () => {
		let store = this.props.store; // Setup undux store
		const arweave = Arweave.init();

		let cachedOutbox = store.get('sent'); // Collect cached outbox
		
		// If cached inbox contains emails
		if (cachedOutbox.length > 0) {
			// Set mail to cached emails and toggle loading
			this.setState({mail: cachedOutbox, loading: false});
		} else {
			// Use keyfile from sessionStorage to get address
			arweave.wallets.jwkToAddress(JSON.parse(sessionStorage.getItem('keyfile'))).then(address => {
				
				// Feed address to arql get_blocks_with_mail query
				let get_blocks_with_mail = {
					op: 'and',
					expr1:{
						op: 'equals',
						expr1: 'from',
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
					let counter = 0; // Setup current mail counter

					if (transactions.length > 0) {
						// For each tx tagged permamail:
						transactions.forEach(transaction => {
							// Get mail from tx
							get_sent_mail_from_tx(transaction).then(response => {
								// Append mail to mail array
								this.setState(previousState => ({mail: [...previousState.mail, response]}), () => {
									counter++; // Increment current mail counter

									// If all mails have been collected
									if (counter === transactions.length) {
										store.set('sent')(this.state.mail); // Update sent mails in undux store
										this.setState({loading: false}); // Toggle loading
									}
								})
							})
						})
					} else {
						this.setState({loading: false});
					}
				})
			});
		}
	};

	componentDidMount() {
		document.title="Weve | Sent"; // Set page title
		this.retrieveMail(); // Retrieve mail on load
	}

	render() {
		const columns = [
			{Header: 'Timestamp', accessor: 'timestamp', Cell: props => moment.unix(props.value).fromNow()},
			{Header: 'To', accessor: 'to', Cell: props => <To address={props.value} />},
			{Header: 'Tx ID', accessor: 'id', Cell: props => <Tx id={props.value} />},
		];

		return(
			<div className="sent">
				<div>
					<div>
						<h2>Sent</h2>
						<span>View sent weve mail</span>
					</div>
					<div>
						<ReactTable 
							data={this.state.mail}
							resizable={false}
							columns={columns}
							defaultPageSize={10}
							loading={this.state.loading}
							loadingText="Loading sent mail"
							noDataText="No sent mails found"
							className="sent-table"
						/>
					</div>
				</div>
			</div>
		);
	}
}

class To extends React.Component {
	render() {
		return <a className="sent-table-link" href={`https://viewblock.io/arweave/address/${this.props.address}`} target="_blank" rel="noopener noreferrer"><Address address={this.props.address} /></a>
	}
}

class Tx extends React.Component {
	render() {
		return <a className="sent-table-link" href={`https://viewblock.io/arweave/tx/${this.props.id}`} target="_blank" rel="noopener noreferrer">{this.props.id}</a>
	}
}

export default Store.withStore(Sent);
