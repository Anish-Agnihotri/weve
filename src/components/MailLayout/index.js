import React from 'react';
import Arweave from 'arweave/web';
import { withRouter, NavLink } from 'react-router-dom';
import './index.css';

// TODO: rewrite layout for mobile display

import Inbox from '../MailLists/Inbox';
import Drafts from '../MailLists/Drafts';

class MailLayout extends React.Component {
	constructor() {
		super();

		this.state = {
			address: null,
			inbox: true,
		};
	}
	getMailbarContent = () => {
		if (this.props.location.pathname.startsWith("/drafts")) {
			return <Drafts />;
		} else if (this.props.location.pathname === "/") {
			this.props.history.push("/inbox");
			return <Inbox />;
		} else {
			return <Inbox />;
		}
	}
	logout = () => {
		sessionStorage.removeItem('keyfile');
		// TODO: modal better way to do this
		this.props.history.push("/");
		window.location.reload()
	}
	getWalletAddress = () => {
		const arweave = Arweave.init();
		arweave.wallets.jwkToAddress(JSON.parse(sessionStorage.getItem('keyfile'))).then(address => {
			this.setState({address: address});
		})
	}
	componentDidMount() {
		this.getWalletAddress();
	}
	render() {
		return (
			this.props.keyFile ? (
				<div className="mail">
					<div className="header">
						<div>
							<h1 className="unselectable">weve.</h1>
						</div>
						<div>
							<div className="profile">
								<div>
									<span>{this.state.address ? this.state.address : "Loading..."}</span>
									<button onClick={this.logout}>Logout</button>
								</div>
								<div>
									<img src={`https://api.adorable.io/avatars/100/${this.props.keyFile.n}.png`} alt="Avatar" />
								</div>
							</div>
						</div>
					</div>
					<div className="sidebar">
						<button>New Mail</button>
						<ul>
							<li><NavLink to="/inbox" activeClassName="active-sidebar-button"><i className="fa fa-inbox"></i>Inbox</NavLink></li>
							<li><NavLink to="/drafts" activeClassName="active-sidebar-button"><i className="fa fa-file-o"></i>Drafts</NavLink></li>
						</ul>
					</div>
					<div className="mailbar">
						{this.getMailbarContent()}
					</div>
					<div className="content">
						{this.props.children}
					</div>
				</div>
			) : null
		);
	}
}

export default withRouter(MailLayout);
