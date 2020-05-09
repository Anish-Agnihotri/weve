import React from 'react';
import Arweave from 'arweave/web';
import moment from 'moment';
import {NavLink} from 'react-router-dom';
import {wallet_to_key, decrypt_mail} from '../../utils/crypto';
import './index.css';

export default class Inbox extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [],
			retrieved: false
		};
	}
	retrieveMail = () => {
		const arweave = Arweave.init();

		let all_mail = [];

		arweave.wallets.jwkToAddress(JSON.parse(sessionStorage.getItem('keyfile'))).then(address => {
			
			let get_blocks_with_mail = {
				op: 'and',
				expr1:{
					op: 'equals',
					expr1: 'to',
					expr2: address
				},
				expr2:{
					op: 'equals',
					expr1: 'App-Name',
					expr2: 'permamail'
				}
			}

			arweave.api.post(`arql`, get_blocks_with_mail).then(response => {
				let transactions = response.data;

				for (let i = 0; i < transactions.length; i++) {
					arweave.transactions.get(transactions[i]).then(async tx => {
						let key = await wallet_to_key(JSON.parse(sessionStorage.getItem('keyfile')));
						let mail = JSON.parse(arweave.utils.bufferToString(await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key)));

						let mail_item = {
							"timestamp": tx.get('tags')[2].get('value', { decode: true, string: true }),
							"id": tx.id,
							"from": await arweave.wallets.ownerToAddress(tx.owner),
							"fee": tx.reward / 1000000000000,
							"amount": tx.quantity / 1000000000000,
							"subject": mail.subject,
							"body": mail.body,
						};

						all_mail.push(mail_item);
					})
				}
			})
		})

		console.log("mail: " + all_mail);
		this.setState({mail: all_mail, retrieved: true});
	}
	componentDidMount() {
		this.retrieveMail();
	}
	render() {
		return (
			<div className="list inbox">
				<div>
					<h2>Inbox</h2>
					<span>View latest weve mails</span>
				</div>
				<div>
					<button>Sort by date</button>
				</div>
				<div>
					{this.state.mail.map((mail, i) => (
						<MailItem key={i} id={mail.id} from={mail.from} subject={mail.subject} body={mail.body} timestamp={mail.timestamp} />
					))}
				</div>
			</div>
		);
	}
}

class MailItem extends React.Component {
	render() {
		return (
			<button to="/" className="mail-item">
				<a href={`https://viewblock.io/arweave/address/${this.props.from}`} target="_blank" rel="noopener noreferrer">{this.props.from}</a>
				<span>{this.props.subject ? this.props.subject : ""}</span>
				<span>{this.props.body ? this.props.body : ""}</span>
				<span>{this.props.timestamp ? moment.unix(this.props.timestamp).fromNow() : ""}</span>
			</button>
		);
	}
}
