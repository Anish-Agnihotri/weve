import React from 'react';
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
		// return `Location: ${location}, ${id}`
		return <MailItem />
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

/*

"timestamp": tx.get('tags')[2].get('value', { decode: true, string: true }),
							"id": tx.id,
							"from": await arweave.wallets.ownerToAddress(tx.owner),
							"fee": tx.reward / 1000000000000,
							"amount": tx.quantity / 1000000000000,
							"subject": mailParse.subject,
							"body": mailParse.body,

							Header: id, from, subject
							body
							Footer: amount, fee, download, reply
*/

class MailItem extends React.Component {
	render() {
		return (
			<div className="mail-view">
				<div>
					<div>
						<div>
							<img src={`https://api.adorable.io/avatars/100/1.png`} alt="Avatar" />
						</div>
						<div>
							<span><strong>From:</strong> <a href="https://viewblock.io/arweave/address/FIXME:ADDDRESS_HERE" target="_blank" rel="noopener noreferrer">N9w5wXrc7KF_4vNSj7HvpgHdPdewlKhmIetqPLW7CcQ</a></span>
							<span><strong>Tx ID:</strong> <a href="https://viewblock.io/arweave/tx/FIXME:ID_HERE" target="_blank" rel="noopener noreferrer">N9w5wXrc7KF_4vNSj7HvpgHdPdewlKhmIe</a></span>
						</div>
					</div>
					<div>
						<h3>FIXME: Subject line: this is a really long subject line that discusses everything</h3>
					</div>
				</div>
				<div>
					<div>
						<ReactMarkdown source="# Test" />
					</div>
				</div>
				<div>
					<div>
						<span><strong>Amount:</strong><span>0.000001 AR</span></span>
						<span><strong>Tx Fee:</strong><span>0.0000001 AR</span></span>
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
