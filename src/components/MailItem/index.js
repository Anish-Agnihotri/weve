import React from 'react';
import Arweave from 'arweave/web'; // Arweave
import ReactMarkdown from 'react-markdown'; // Display markdown from mail
import { withRouter } from 'react-router-dom'; // Navigation
import { get_mail_from_tx } from '../../utils/crypto'; // Retrieve mail function
import Address from '../../components/Address'; // Arweave ID parsing
import FileSaver from 'file-saver'; // Save file (download button)
import { getWeavemailTransactions } from '../../utils/query';
import { arweave } from '../../utils/globals';

class MailItem extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true, // Set mail loading to true by default
			errorLoading: false,
			mail: null, // Hold mail item
		};
	}

	getMail = id => {
		this.setState({loading: true, errorLoading: false});
		let t = this;
		// If mail type is "inbox":
		if (this.props.type === 'inbox') {
			// Get mail from permaweb
			getWeavemailTransactions(arweave, null, id).then(results => {
				let transactions = results.data.transactions.edges;
				if(transactions.length == 1) {
					get_mail_from_tx(transactions[0].node).then(r => {
						if(r) {
							t.setState({mail: r, loading: false});
						} else {
							t.setState({errorLoading:true})
						}
					})
				} else {
					console.error(`Wrong number of transactions ${transactions.length}`);
					t.setState({errorLoading:true});
				}
				
			});
			
		} else {
			// Else, if mail type is "draft":
			let drafts = JSON.parse(sessionStorage.getItem('drafts')); // Get drafts array from sessionStorage
			for (let i = 0; i < drafts.length; i++) {
				// Find draft with matching URL id
				if (drafts[i].id === id) {
					// Get mail from drafts
					this.setState({mail: drafts[i], loading: false});
				}
			}
		}
	};

	componentDidMount() {
		let id = this.props.id;
		this.getMail(id); // Get mail information on mount
	}

	componentDidUpdate(prevProps) { 
		// If ID updates, selected mail has changed
		if (prevProps.id !== this.props.id) {
			// Re-get data about new mail
			this.getMail(this.props.id);
		}
	}

	// Individual button functions
	// Download button
	button_download = () => {
		// Create blob with JSON mail content
		let blob = new Blob([JSON.stringify(this.state.mail)], {type: "application/json;charset=utf-8"});
		// Use FileSaver to save blob as mail.json
		FileSaver.saveAs(blob, 'mail.json');
	};

	// Reply button
	button_reply = () => {
		// Add from and subject to existingData
		this.props.updateExistingData(["reply", this.state.mail.from, this.state.mail.subject]);
		// Open compose modal
		this.props.toggleModal();
	}

	// Delete button
	button_delete = () => {
		let drafts = JSON.parse(sessionStorage.getItem('drafts')); // Collect drafts array from sessionStorage
		let newDrafts = [];

		for (let i = 0; i < drafts.length; i++) {
			// Add all drafts that are not this one
			if (drafts[i].id !== this.props.id) {
				// to the newDrafts array
				newDrafts.push(drafts[i]);
			}
		}

		sessionStorage.setItem('drafts', JSON.stringify(newDrafts)); // Update sessionStorage with new array excluding this draft id
		this.props.history.push('/drafts'); // Redirect to /drafts
	}

	// Edit button
	button_edit = () => {
		// Add all mail items to existingData
		this.props.updateExistingData(["edit", this.state.mail]);
		// Open compose modal
		this.props.toggleModal();
	}

	render() {
		return (
			<div className="mail-view">
				{this.state.loading ? (
					<div className="mail-view-loading">
						{this.state.errorLoading ? (<h5>Unable to load</h5>) : (<><i className="fa fa-spinner fa-spin"></i><h5>Retrieving {this.props.type === 'inbox' ? "mail" : "draft"}</h5></>)}
					</div>
				) : (
					<>
						<div>
							<div>
								<div>
									<img src={`https://api.adorable.io/avatars/100/${this.props.type === 'inbox' ? this.state.mail.from : this.state.mail.to}.png`} alt="Avatar" />
								</div>
								<div>
									<span><strong>{this.props.type === 'inbox' ? "From" : "To"}:</strong> <a href={`https://viewblock.io/arweave/address/${this.props.type === 'inbox' ? this.state.mail.from : this.state.mail.to}`} target="_blank" rel="noopener noreferrer">{this.props.type === 'inbox' ? (<Address address={this.state.mail.from} />) : (<Address address={this.state.mail.to} />)}</a></span>
									{this.props.type === 'inbox' ? (
										<span><strong>Tx ID:</strong> <a href={`https://viewblock.io/arweave/tx/${this.state.mail.id}`} target="_blank" rel="noopener noreferrer">{this.state.mail.id}</a></span>
									) : null}
								</div>
							</div>
							<div>
								<h3>{this.state.mail.subject !== undefined && this.state.mail.subject !== "" ? this.state.mail.subject : "No Subject"}</h3>
							</div>
						</div>
						<div>
							<div>
								<ReactMarkdown source={this.state.mail.body !== undefined ? this.state.mail.body : "No Body"} />
							</div>
						</div>
						<div>
							<div>
								{this.state.mail.amount !== undefined ? (
									<span><strong>Amount:</strong><span>{this.state.mail.amount} AR</span></span>
								) : null }
								{this.props.type === 'inbox' ? (
									<span><strong>Tx Fee:</strong><span>{this.state.mail.fee} AR</span></span>
								) : null}
							</div>
							{this.props.type === 'inbox' ? (
								<div>
									<button onClick={this.button_download}><i className="fa fa-download"></i>Download</button>
									<button onClick={this.button_reply}><i className="fa fa-mail-reply"></i>Reply</button>
								</div>
							) : (
								<div>
									<button onClick={this.button_delete}><i className="fa fa-trash"></i>Delete</button>
									<button onClick={this.button_edit}><i className="fa fa-edit"></i>Edit</button>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		);
	}
}

export default withRouter(MailItem);
