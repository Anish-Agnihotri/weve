import React from 'react';
import ReactMarkdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { get_mail_from_tx } from '../../utils/crypto';
import FileSaver from 'file-saver';

// TODO: buttons
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

	button_download = () => {
		let blob = new Blob([JSON.stringify(this.state.mail)], {type: "application/json;charset=utf-8"});
		FileSaver.saveAs(blob, 'mail.json');
	}

	button_reply = () => {
		this.props.updateExistingData(["reply", this.state.mail.from, this.state.mail.subject]);
		this.props.toggleModal();
	}

	button_delete = () => {
		let drafts = JSON.parse(sessionStorage.getItem('drafts'));
		let newDrafts = [];

		for (let i = 0; i < drafts.length; i++) {
			if (drafts[i].id !== this.props.id) {
				newDrafts.push(drafts[i]);
			}
		}

		sessionStorage.setItem('drafts', JSON.stringify(newDrafts));
		this.props.history.push('/drafts');
	}

	button_edit = () => {
		this.props.updateExistingData(["edit", this.state.mail]);
		this.props.toggleModal();
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
