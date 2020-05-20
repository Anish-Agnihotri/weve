import React from 'react';
import { Modal } from 'react-responsive-modal'; // Compose modal setup
import Compose from '../../components/Compose'; // Compose modal content
import MailLayout from '../../components/MailLayout'; // Inbox UI layout
import MailItem from '../../components/MailItem'; // Individual mail item import
import './index.css';

export default class Mail extends React.Component {
	constructor() {
		super();

		this.state = {
			keyfile: null, // Initialize keyfile to empty
			id: null, // Initialize selected email id to empty
			type: null, // Initialize type of email (inbox/draft) to empty
			modalState: false, // Modal is not toggled by default
			content: [], // Initialize content array
			existingData: null // Initialize existingData to hold data from reply/edit buttons
		}
	}

	// Collect keyfile from sessionStorage on load
	getKeyFile = () => {
		this.setState({keyfile: JSON.parse(sessionStorage.getItem('keyfile'))});
	};

	// Programatically display emails
	// TODO: Error handling for random URL
	getContent = () => {
		// Collect location + id from URL
		const {location, id} = this.props.match.params;
		
		// If an email in inbox is selected:
		if (location === 'inbox' && typeof id !== 'undefined') {
			// Update type and id
			this.setState({id: id, type: 'inbox'});
		} else if (location === 'drafts' && typeof id !== 'undefined') {
			// Else if an email in drafts is selected, update type and id
			this.setState({id: id, type: 'drafts'});
		} else {
			// Else, set id to null
			this.setState({id: null});
		}
	};

	// Toggle compose modal
	toggleModal = () => {
		// If no existingData (i.e, not toggled by reply or edit buttons):
		if (this.state.modalState && this.state.existingData !== null) {
			// Keep existingData at null or rest to null
			this.setState({existingData: null});
		}
		this.setState(previousState => ({ modalState: !previousState.modalState, keyFileName: "Drop keyfile here", isLoading: false}));
	};

	componentDidMount() {
		this.getKeyFile(); // Get keyfile on mount
		this.getContent(); // Get email + sidebar content on mount
	}

	// Function passed down to children to update existingData (for reply/edit buttons)
	updateExistingData = data => {
		this.setState({existingData: data});
	};

	componentDidUpdate(prevProps) {
		// Call a complete update on pathname change
		// Used when navigating between /inbox and /drafts
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.getContent();
		}
	}

	render() {
		return (
			<>
				<Modal 
					open={this.state.modalState} 
					onClose={this.toggleModal}
					center={true}>
					<Compose toggleSelf={this.toggleModal} existingData={this.state.existingData} updateExistingData={this.updateExistingData} />
				</Modal>
				<MailLayout compose={this.toggleModal} keyFile={this.state.keyfile ? this.state.keyfile : null} location={this.props.match.params}>
					{this.state.id !== null ? (
						<MailItem id={this.state.id} type={this.state.type} toggleModal={this.toggleModal} updateExistingData={this.updateExistingData} />
					) : (
						<div className="no-mail-selected">
							<img src="https://pspfqlx3qgd7.arweave.net/Il2bA6IuoancZwMYqH9t3nPOdKRP94WqbGmrQwc_b_0/no_mail_selected.png" alt="No mail selected" />
							<h3>No mail selected</h3>
						</div>
					)}
				</MailLayout>
			</>
		);
	}
}
