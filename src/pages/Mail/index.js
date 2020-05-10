import React from 'react';
import {get_mail_from_tx} from '../../utils/crypto';
import MailLayout from '../../components/MailLayout';
import ReactMarkdown from 'react-markdown';
import './index.css';

export default class Mail extends React.Component {
	constructor() {
		super();

		this.state = {
			keyfile: null,
		}
	}
	getKeyFile = () => {
		this.setState({keyfile: JSON.parse(sessionStorage.getItem('keyfile'))});
	}
	renderContent = () => {
		const { location, id } = this.props.match.params;

		if (location === 'inbox' && typeof id !== 'undefined') {
			return "Content is here";
		} else {
			return "Fix This";
		}
	}
	componentDidMount() {
		this.getKeyFile();
	}
	render() {
		return (
			<MailLayout keyFile={this.state.keyfile ? this.state.keyfile : null} location={this.props.match.params}>
				{this.renderContent()}
			</MailLayout>
		);
	}
}

class MailItem extends React.Component {
	render() {
		return (
			<div className="mail-view">
				<div>
					<div>
						<div>
							<img src={`https://api.adorable.io/avatars/100/${this.props.r.from}.png`} alt="Avatar" />
						</div>
						<div>
							<span><strong>From:</strong> <a href={`https://viewblock.io/arweave/address/${this.props.r.from}`} target="_blank" rel="noopener noreferrer">{this.props.r.from}</a></span>
							<span><strong>Tx ID:</strong> <a href={`https://viewblock.io/arweave/tx/${this.props.r.id}`} target="_blank" rel="noopener noreferrer">{this.props.r.id}</a></span>
						</div>
					</div>
					<div>
						<h3>{this.props.r.subject}</h3>
					</div>
				</div>
				<div>
					<div>
						<ReactMarkdown source={this.props.r.subject} />
					</div>
				</div>
				<div>
					<div>
						<span><strong>Amount:</strong><span>{this.props.r.fee} AR</span></span>
						<span><strong>Tx Fee:</strong><span>{this.props.r.amount} AR</span></span>
					</div>
					<div>
						<button><i className="fa fa-download"></i>Download</button>
						<button><i className="fa fa-mail-reply"></i>Reply</button>
					</div>
				</div>
			</div>
		);
	}
}
