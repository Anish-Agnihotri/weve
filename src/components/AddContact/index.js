import React from 'react';
import Arweave from 'arweave/web'; // Arweave libraries
import {notify} from 'react-notify-toast'; // Notifications
import './index.css';

export default class AddContact extends React.Component {
	constructor() {
		super();

		this.state = {
			contact_name: '', // Initialize contact name as empty
			contact_addr: '', // Initialize contact address as empty
			transactionLoading: false // Initialize transaction loading as false
		}
	}

	// Handle form input for contact name
	handleNameChange = event => {
		this.setState({contact_name: event.target.value});
	};

	// Handle form input for contact address
	handleContactAddressChange = event => {
		this.setState({contact_addr: event.target.value});
	};

	// Add contact function
	send = async () => {
		// Set loading status to true
		this.setState({transactionLoading: true});

		let arweave = Arweave.init();
		let wallet = JSON.parse(sessionStorage.getItem('keyfile')); // Collect wallet from sessionStorage
		let contact = {"name": this.state.contact_name, "contact": this.state.contact_addr}; // Setup contact item

		// Generate arweave transaction to push contact item to contact repository address
		let tx = await arweave.createTransaction({
			target: 'adUldINA22DQUgwk3vsKrLBWaM5F_LTdTPSzj711kGM', // Contact repository address
			data: JSON.stringify(contact), // Tx data
		}, wallet);

		// Adhere to wevecontact protocol specifications:
		tx.addTag('App-Name', 'wevecontact'); // Add wevecontact tag (to retrieve with later)

		await arweave.transactions.sign(tx, wallet); // Sign transaction
		let tx_id = tx.id; // Get transaction id from signed transaction

		// Check if sending wallet has enough AR to cover transaction fees
		let jwk_wallet = await arweave.wallets.jwkToAddress(wallet);
		let wallet_balance = await arweave.wallets.getBalance(jwk_wallet); // Collect balance
		let balance_in_ar = await arweave.ar.winstonToAr(wallet_balance); // Convert winston to AR

		if (balance_in_ar < 0.0000001) {
			// Throw a toast notification error
			notify.show("Error: Insufficient balance to add contact", "error");
			// Stop loading status
			this.setState({transactionLoading: false});
			// Stop further execution
			return
		}
		
		await arweave.transactions.post(tx); // Post transaction
		this.setState({transactionLoading: false}); // Set loading status to false
		notify.show(`Success: Contact add transaction sent, id: ${tx_id}.`, 'success'); // Show successful toast notification with tx id
		
		this.props.toggleSelf(); // Close modal
	};

	render() {
		return (
			<div className="compose-modal">
				<div>
					<h2>Add contact</h2>
					<span>Save a frequenct contact to the permaweb</span>
				</div>
				<div>
					<div>
						<span>Contact name</span>
						<input type="text" value={this.state.contact_name} onChange={this.handleNameChange} placeholder="Alice Wonderland"/>
					</div>
					<div>
						<span>Contact address</span>
						<input type="text" value={this.state.contact_addr} onChange={this.handleContactAddressChange} placeholder="cVp3bbGwp9EfSAMPLE9ej3nssi303nn300ns03i"/>
					</div>
				</div>
				<div>
					{this.state.contact_name !== '' && this.state.contact_addr !== '' ? (
						<button onClick={this.send}><i className={this.state.transactionLoading ? "fa fa-spinner fa-spin" : "fa fa-save"}></i>Save</button>
					) : (
						<button className="disabled-send fill-fields" disabled><i className="fa fa-save"></i>Fill fields</button>
					)}
				</div>
			</div>
		);
	}
}
