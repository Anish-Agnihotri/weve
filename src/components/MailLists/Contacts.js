import React from 'react';
import Arweave from 'arweave/web'; // Arweave
import { Modal } from 'react-responsive-modal'; // Compose modal setup
import { withRouter } from 'react-router-dom'; // React-router-dom navigation
import AddContact from '../AddContact'; // Import add contact modal
import './index.css';

class Contacts extends React.Component {
	constructor() {
		super();

		this.state = {
			modalOpen: false, // Initialize modal state as closed
			loading: true, // Initialize loading contacts as true
			contacts: [], // Initialize contacts array as empty
		}
	}

	// Toggle add contact modal
	toggleAddContact = () => {
		this.setState(previousState => ({modalOpen: !previousState.modalOpen}));
	}

	getContacts = async () => {
		const arweave = Arweave.init();

		// Use keyfile from sessionStorage to get address
		let wallet = JSON.parse(sessionStorage.getItem('keyfile'));

		// Get current address
		arweave.wallets.jwkToAddress(wallet).then(address => {

			// Feed address to arql get_blocks_with_contacts query
			let get_blocks_with_contacts = {
				op: 'and',
				expr1:{
					op: 'equals',
					expr1: 'from',
					expr2: address
				},
				expr2:{
					op: 'equals',
					expr1: 'App-Name',
					expr2: 'wevecontact'
				}
			}

			// Collect blocks that contain a contact
			arweave.api.post(`arql`, get_blocks_with_contacts).then(async response => {
				let contact_transactions = response.data; // All contacts
				let counter = 0; // Setup current contact counter
				
				// If there are contacts (a.k.a length > 0)
				if (contact_transactions.length > 0) {
					// For each contact:
					contact_transactions.forEach(async contacttx => {
						// Get the contact transaction
						await arweave.transactions.get(contacttx).then(async tx => {
							// Get the data from the contact transaction
							await arweave.transactions.getData(tx.id).then(async data => {
								// Parse the JSON in the transaction body
								let response = JSON.parse(arweave.utils.bufferToString(arweave.utils.b64UrlToBuffer(data)));
								
								// Update the contacts array with the new contact
								this.setState(previousState => ({contacts: [...previousState.contacts, response]}), () => {
									counter++; // Increment current contacts counter

									// If all contacts have been collected
									if (counter === contact_transactions.length) {
										this.setState({loading: false}); // Toggle loading
									}
								})
							})
						});
					});
				} else {
					// Else, set loading to false and dont update contacts array
					this.setState({loading: false});
				}
			});
		});
	}

	componentDidMount() {
		this.getContacts(); // Get contacts on load
	}

	render() {
		return(
			<>
				<Modal 
					open={this.state.modalOpen} 
					onClose={this.toggleAddContact}
					center={true}>
						<AddContact toggleSelf={this.toggleAddContact} />
				</Modal>
				<div className="sent contacts">
					<div>
						<div>
							<h2>Contacts</h2>
							<span>Experimental: Save addresses as contacts</span>
							<button onClick={this.toggleAddContact}>Add contact</button>
						</div>
						<div>
							<h4>Saved contacts</h4>
						</div>
						<div>
							{this.state.loading ? (
								<div className="loading loading-contacts">
									<i className="fa fa-spinner fa-spin"></i>
									<h5>Retrieving contacts</h5>
								</div>
							) : (
								this.state.contacts.length ? (
									this.state.contacts.map((contact, index) => {
										return <ContactItem 
											contact={contact.contact}
											name={contact.name}
											key={index}
											{...this.props}
										/>
									})
								) : (
									<div className="empty empty-contacts">
										<i className="fa fa-user"></i>
										<h4>No contacts found</h4>
										<span>Add a contact to get started.</span>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(Contacts);

class ContactItem extends React.Component {
	// On click, navigate to directive-based to link to trigger compose
	contactClick = () => {
		// Props are passed down from parent via {...props}
		this.props.history.push(`/inbox/to=${this.props.contact}`);
	};

	render() {
		return (
			<button onClick={this.contactClick} className="contact-item">
				<div>
					<img src={`https://api.adorable.io/avatars/100/${this.props.contact}`} alt="Contact"/>
				</div>
				<div>
					<span>{this.props.name}</span>
				</div>
			</button>
		);
	}
}
