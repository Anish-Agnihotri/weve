import React from 'react';
import {get_mail_from_tx} from '../../utils/crypto';
import MailLayout from '../../components/MailLayout';
import ReactMarkdown from 'react-markdown';
import './index.css';

export default class Mail extends React.Component {
	constructor() {
		super();

		this.state = {
			keyfile: null
		}
	}

	getKeyFile = () => {
		this.setState({keyfile: JSON.parse(sessionStorage.getItem('keyfile'))});
	}

	getContent = () => {
		let {location, id} = this.props.match.params;

		if (location === 'inbox' && typeof id !== 'undefined') {
			return <MailItem id={id} />
		} else {
			return `${location} ${id}`;
		}
	}

	componentDidMount() {
		this.getKeyFile();
	}

	render() {
		return (
			<MailLayout keyFile={this.state.keyfile ? this.state.keyfile : null} location={this.props.match.params}>
				{this.getContent()}
			</MailLayout>
		);
	}
}

// TODO: Fix rendering if items are not present
class MailItem extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			mail: null,
		};
	}

	getMail = id => {
		get_mail_from_tx(id).then(r => {
			this.setState({mail: r, loading: false});
		})
	}

	componentDidMount() {
		let id = this.props.id;
		this.getMail(id);
	}

	render() {
		return (
			<div className="mail-view">
				{this.state.loading ? (
					<div className="mail-view-loading">
						<i className="fa fa-spinner fa-spin"></i>
						<h5>Retrieving mail</h5>
					</div>
				) : (
					<>
						<div>
							<div>
								<div>
									<img src={`https://api.adorable.io/avatars/100/${this.state.mail.from}.png`} alt="Avatar" />
								</div>
								<div>
									<span><strong>From:</strong> <a href={`https://viewblock.io/arweave/address/${this.state.mail.from}`} target="_blank" rel="noopener noreferrer">{this.state.mail.from}</a></span>
									<span><strong>Tx ID:</strong> <a href={`https://viewblock.io/arweave/tx/${this.state.mail.id}`} target="_blank" rel="noopener noreferrer">{this.state.mail.id}</a></span>
								</div>
							</div>
							<div>
								<h3>{this.state.mail.subject !== undefined ? this.state.mail.subject : "No Subject"}</h3>
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
								<span><strong>Tx Fee:</strong><span>{this.state.mail.fee} AR</span></span>
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
