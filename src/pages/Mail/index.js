import React from 'react';
import { get_mail_from_tx } from '../../utils/crypto';
import { Modal } from 'react-responsive-modal';
import Compose from '../../components/Compose';
import MailLayout from '../../components/MailLayout';
import ReactMarkdown from 'react-markdown';
import './index.css';

import no_mail_selected from '../../static/images/no_mail_selected.png';

export default class Mail extends React.Component {
	constructor() {
		super();

		this.state = {
			keyfile: null,
			id: null,
			type: null,
			modelState: false,
			content: []
		}
	}

	getKeyFile = () => {
		this.setState({keyfile: JSON.parse(sessionStorage.getItem('keyfile'))});
	}

	getContent = () => {
		const {location, id} = this.props.match.params;

		// TODO: Error handling for random URL
		if (location === 'inbox' && typeof id !== 'undefined') {
			this.setState({id: id, type: 'inbox'});
		} else if (location === 'drafts' && typeof id !== 'undefined') {
			this.setState({id: id, type: 'drafts'});
		} else {
			this.setState({id: null});
		}
	}

	toggleModal = () => {
		this.setState(previousState => ({ modalState: !previousState.modalState, keyFileName: "Upload keyfile", isLoading: false}));
	}

	componentDidMount() {
		this.getKeyFile();
		this.getContent();
	}

	componentDidUpdate(prevProps) {
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
					<Compose toggleSelf={this.toggleModal} />
				</Modal>
				<MailLayout compose={this.toggleModal} keyFile={this.state.keyfile ? this.state.keyfile : null} location={this.props.match.params}>
					{this.state.id !== null ? (
						<MailItem id={this.state.id} type={this.state.type} />
					) : (
						<div className="no-mail-selected">
							<img src={no_mail_selected} alt="No mail selected" />
							<h3>No mail selected</h3>
						</div>
					)}
				</MailLayout>
			</>
		);
	}
}

// TODO: Download and reply
class MailItem extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			mail: null,
		};
	}

	getMail = id => {
		if (this.props.type === 'inbox') {
			get_mail_from_tx(id).then(r => {
				this.setState({mail: r, loading: false});
			})
		} else {
			let drafts = JSON.parse(sessionStorage.getItem('drafts'));
			for (let i = 0; i < drafts.length; i++) {
				if (drafts[i].id === id) {
					this.setState({mail: drafts[i], loading: false});
				}
			}
		}
	}

	componentDidMount() {
		let id = this.props.id;
		this.getMail(id);
	}

	componentDidUpdate(prevProps) { 
		if (prevProps.id !== this.props.id) {
			this.getMail(this.props.id);
		}
	}

	render() {
		return (
			<div className="mail-view">
				{this.state.loading ? (
					<div className="mail-view-loading">
						<i className="fa fa-spinner fa-spin"></i>
						<h5>Retrieving {this.props.type === 'inbox' ? "mail" : "draft"}</h5>
					</div>
				) : (
					<>
						<div>
							<div>
								<div>
									<img src={`https://api.adorable.io/avatars/100/${this.props.type === 'inbox' ? this.state.mail.from : this.state.mail.to}.png`} alt="Avatar" />
								</div>
								<div>
									<span><strong>{this.props.type === 'inbox' ? "From" : "To"}:</strong> <a href={`https://viewblock.io/arweave/address/${this.props.type === 'inbox' ? this.state.mail.from : this.state.mail.to}`} target="_blank" rel="noopener noreferrer">{this.props.type === 'inbox' ? this.state.mail.from : this.state.mail.to}</a></span>
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
								{this.props.type === 'string' ? (
									<span><strong>Tx Fee:</strong><span>{this.state.mail.fee} AR</span></span>
								) : null}
							</div>
							<div>
								<button><i className="fa fa-download"></i>Download</button>
								<button><i className="fa fa-mail-reply"></i>Reply</button>
							</div>
						</div>
					</>
				)}
			</div>
		);
	}
}
