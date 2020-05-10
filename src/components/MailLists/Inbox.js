import React from 'react';
import Arweave from 'arweave/web';
import moment from 'moment';
import {NavLink} from 'react-router-dom';
import {get_mail_from_tx} from '../../utils/crypto';
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

			arweave.api.post(`arql`, get_blocks_with_mail).then(async response => {
				let transactions = response.data;

				transactions.forEach(async transaction => {
					get_mail_from_tx(transaction).then(response => {
						this.setState(previousState => ({mail: [...previousState.mail, response]}));
					})
				})

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
								<MailItem key={i} id={mail.id ? mail.id : ""} from={mail.from} subject={mail.subject} body={mail.body} timestamp={mail.timestamp} />
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
