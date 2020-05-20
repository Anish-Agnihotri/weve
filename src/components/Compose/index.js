import React from 'react';
import Arweave from 'arweave/web'; // Arweave libraries
import {notify} from 'react-notify-toast'; // Notifications
import { withRouter } from 'react-router-dom'; // React-router-dom navigation
import { get_public_key, encrypt_mail } from '../../utils/crypto'; // Mail encryption
import './index.css';

// React draft
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { markdownToDraft } from 'markdown-draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Compose extends React.Component {
	constructor() {
		super();

		this.state= {
			recipient: '', // Initialize empty recipient
			subject: '', // Initialize empty subject
			numTokens: 0, // Initialize AR tokens to send to 0
			transactionLoading: false, // Set loading status to false
			editorState: EditorState.createEmpty() // Initialize react-draft
		}
	}

	// Input field change handlers
	onEditorStateChange = editorState => {
		this.setState({editorState});
	};
	handleRecipientChange = event => {
		this.setState({recipient: event.target.value});
	};
	handleSubjectChange = event => {
		this.setState({subject: event.target.value});
	};
	handleNumTokensChange = event => {
		this.setState({numTokens: event.target.value});
	};

	// Save as draft function
	save = () => {
		// Generate random temporary id
		let randomID = (Math.random()*1e32).toString(36).substring(0, 10);
		// Collect markdown from editor
		let markdown = draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent()));

		// Make a complete mail_item
		let mail_item = {
			"id": randomID,
			"to": this.state.recipient,
			"subject": this.state.subject,
			"body": markdown,
			"amount": this.state.numTokens,
			"timestamp": Date.now()
		};

		// Collect items from drafts in sessionStorage;
		let sessionDrafts = sessionStorage.getItem('drafts');
		let drafts;

		// If drafts in sessionStorage exists
		if (sessionDrafts !== null) {
			// Parse what is in it
			drafts = JSON.parse(sessionDrafts);
		} else {
			// Initialize empty drafts
			drafts = [];
		}

		drafts.push(mail_item); // Push new draft to array
		sessionStorage.setItem('drafts', JSON.stringify(drafts)); // Set new array to drafts item in sessionStorage
		this.props.toggleSelf(); // Close modal
		this.props.history.push(`/drafts/${randomID}`); // Redirect to draft in drafts page
	};

	// Send mail function
	send = async () => {
		// Set loading status to true
		this.setState({transactionLoading: true});

		let arweave = Arweave.init();
		let wallet = JSON.parse(sessionStorage.getItem('keyfile')); // Collect wallet from sessionStorage
		let tokens = arweave.ar.arToWinston(this.state.numTokens); // Collect number of tokens to send
		let pub_key = await get_public_key(this.state.recipient); // Collect recipient public key
		let pub_key_holder = await arweave.wallets.jwkToAddress(wallet); // Collect sender public key

		// If public key returns as undefined, thus, address has not sent a transaction to network:
		if (pub_key === undefined) {
			// Throw a toast notification error
			notify.show("Error: Recipient has to send a transaction to the network, first!", "error");
			// Stop loading status
			this.setState({transactionLoading: false});
			// Stop further execution
			return
		}

		// If public key is also recipient, a.k.a self-mail
		if (pub_key_holder === this.state.recipient) {
			// Throw a toast notification error
			notify.show("Error: Cannot send mail to yourself", "error");
			// Stop loading status
			this.setState({transactionLoading: false});
			// Stop further execution
			return
		}

		// Collect content from react-draft
		let content = await encrypt_mail(draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent())), this.state.subject, pub_key);

		// Generate arweave transactions
		let tx = await arweave.createTransaction({
			target: this.state.recipient, // Recipient from input
			data: arweave.utils.concatBuffers([content]), // Tx data
			quantity: tokens
		}, wallet);

		// Adhere to Weavemail protocol specifications:
		tx.addTag('App-Name', 'permamail'); // Add permamail tag
		tx.addTag('App-Version', '0.0.2'); // Add version tag
		tx.addTag('Unix-Time', Math.round((new Date()).getTime() / 1000)); // Add Unix timestamp

		await arweave.transactions.sign(tx, wallet); // Sign transaction
		let tx_id = tx.id; // Get transaction id from signed transaction

		// Check if sending wallet has enough AR to cover transaction fees
		let jwk_wallet = await arweave.wallets.jwkToAddress(wallet);
		let wallet_balance = await arweave.wallets.getBalance(jwk_wallet); // Collect balance
		let balance_in_ar = await arweave.ar.winstonToAr(wallet_balance); // Convert winston to AR

		if (balance_in_ar < 0.00000001 + tokens) {
			// Throw a toast notification error
			notify.show("Error: Insufficient balance to send mail", "error");
			// Stop loading status
			this.setState({transactionLoading: false});
			// Stop further execution
			return
		}
		
		await arweave.transactions.post(tx); // Post transaction
		this.setState({transactionLoading: false}); // Set loading status to false
		notify.show(`Success: Transaction sent, id: ${tx_id}.`, 'success'); // Show successful toast notification with tx id
		
		// Add new pending notification to sessionStorage
		// If notifications array is present in sessionStorage
		if (sessionStorage.getItem('notifications') !== null) {
			let notifications = JSON.parse(sessionStorage.getItem('notifications')); // Collect notifications item and parse
			notifications.push({id: tx_id, timestamp: Date.now(), pending: true}); // Append to notifications
			sessionStorage.setItem('notifications', JSON.stringify(notifications)); // Update notifications in sessionStorage
		} else {
			let notifications = [];
			notifications.push({id: tx_id, timestamp: Date.now(), pending: true}); // Append to notifications
			sessionStorage.setItem('notifications', JSON.stringify(notifications)); // Set notifications in sessionStorage
		}
		
		this.props.toggleSelf(); // Close modal
	};

	// Fill existing data from props (used for edit/reply button modal opening)
	fillExistingData = () => {
		// If existingData is not null (i.e, there is data to fill):
		if (this.props.existingData !== null) {
			// If data is from reply button (i.e inbox page)
			if (this.props.existingData[0] === 'reply') {
				// Fill data
				let subject = this.props.existingData[2].startsWith('RE: ') ? this.props.existingData[2] : 'RE: ' + this.props.existingData[2];
				this.setState({recipient: this.props.existingData[1], subject: subject});
			} else if (this.props.existingData[0] === 'edit') {
				// If data is from edit button (i.e drafts page)
				// Fill data
				this.setState({
					recipient: this.props.existingData[1].to, 
					subject: this.props.existingData[1].subject, 
					numTokens: this.props.existingData[1].amount,
					editorState: EditorState.createWithContent(convertFromRaw(markdownToDraft(this.props.existingData[1].body)))
				})
			}
		}
	};

	componentDidMount() {
		this.fillExistingData(); // Run fillExistingData on load
	}

	render() {
		return (
			<div className="compose-modal">
				<div>
					<h2>Compose mail</h2>
					<span>Send a weve mail.</span>
				</div>
				<div>
					<div>
						<span>Mail recipient</span>
						<input type="text" value={this.state.recipient} onChange={this.handleRecipientChange} placeholder="cVp3bbGwp9EfSAMPLE9ej3nssi303nn300ns03i"/>
					</div>
					<div>
						<span>Mail subject</span>
						<input value={this.state.subject} onChange={this.handleSubjectChange} type="text" />
					</div>
					<div>
						<span>Mail body</span>
						<Editor
							editorState={this.state.editorState}
							toolbar={toolbarOptions}
							toolbarClassName="editor-toolbar"
							wrapperClassName="editor-wrapper"
							editorClassName="editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
					</div>
					<div>
						<span>AR tokens to send</span>
						<input value={this.state.numTokens} onChange={this.handleNumTokensChange} type="number" />
					</div>
				</div>
				<div>
					<button onClick={this.save}><i className="fa fa-floppy-o"></i>Save as draft</button>
					{this.state.recipient === '' ? (
						<button onClick={this.send} className="disabled-send" disabled>Enter recipient</button>
					) : (
						<button onClick={this.send}><i className={this.state.transactionLoading ? "fa fa-spinner fa-spin" : "fa fa-send-o"}></i>Send</button>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(Compose);

const toolbarOptions = {
	options: ['inline', 'list', 'link', 'image'],
	inline: {
		options: ['bold', 'italic', 'underline', 'strikethrough'],
	},
	list: {
		options: ['unordered', 'ordered'],
	},
	image: {
		uploadEnabled: false,
	}
}
