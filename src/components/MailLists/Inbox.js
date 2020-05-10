import React from 'react';
import Arweave from 'arweave/web';
import moment from 'moment';
import {NavLink} from 'react-router-dom';
import {wallet_to_key, decrypt_mail} from '../../utils/crypto';
import './index.css';

import emptyInbox from '../../static/images/emptyinbox.png';

export default class Inbox extends React.Component {
	constructor() {
		super();

		this.state = {
			mail: [],
			loading: true
		};
	}
	retrieveMail = () => {
		const arweave = Arweave.init();

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
						let mailParse = JSON.parse(arweave.utils.bufferToString(await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key)));

						let mail_item = {
							"timestamp": tx.get('tags')[2].get('value', { decode: true, string: true }),
							"id": tx.id,
							"from": await arweave.wallets.ownerToAddress(tx.owner),
							"fee": tx.reward / 1000000000000,
							"amount": tx.quantity / 1000000000000,
							"subject": mailParse.subject,
							"body": mailParse.body,
						};

						this.setState(previousState => ({mail: [...previousState.mail, mail_item]}));
					})
				}
				this.setState({loading: false});
			})
		})
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
					{this.state.loading ? (
						<div className="loading">
							<i className="fa fa-spinner fa-spin"></i>
							<h5>Retrieving emails</h5>
						</div>
					) : (
						this.state.mail.length ? (
							this.state.mail.map((mail, i) => (
								<MailItem key={i} id={mail.id} from={mail.from} subject={mail.subject} body={mail.body} timestamp={mail.timestamp} />
							))
						) : (
							<div className="empty">
								<img src={emptyInbox} alt="Empty inbox" />
								<h4>No mails found</h4>
							</div>
						)
					)}
					{}
				</div>
			</div>
		);
	}
}

class MailItem extends React.Component {
	render() {
		return (
			<NavLink to={`/inbox/${this.props.id}`} className="mail-item">
				<h6>{this.props.from}</h6>
				<span>{this.props.subject ? this.props.subject : ""}</span>
				<span>{this.props.body ? this.props.body : ""}</span>
				<span>{this.props.timestamp ? moment.unix(this.props.timestamp).fromNow() : ""}</span>
			</NavLink>
		);
	}
}
