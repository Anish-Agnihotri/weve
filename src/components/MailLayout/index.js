import React from 'react';
import Arweave from 'arweave/web'; // Arweave
import { withRouter, NavLink } from 'react-router-dom'; // Navigation
import Address from '../Address'; // Arweave ID
import './index.css';

// Individual mailboxes
import Inbox from '../MailLists/Inbox';
import Drafts from '../MailLists/Drafts';
import Sent from '../MailLists/Sent';

class MailLayout extends React.Component {
	constructor() {
		super();

		this.state = {
			address: null, // Initialize address to null
			inbox: true, // Set inbox as default mailbox
		};
	}

	// Get mailbar content
	getMailbarContent = () => {
		// If URL starts with /drafts:
		if (this.props.location.pathname.startsWith("/drafts")) {
			// Return drafts mailbox
			return <Drafts />;
		} else if (this.props.location.pathname.startsWith("/sent")) {
			// Return outbox
			return <Sent />;
		} else if (this.props.location.pathname === "/") {
			// If URL starts with '/'
			this.props.history.push("/inbox");
			return <Inbox />; // Return inbox
		} else {
			// Catch-all, return Inbox:
			return <Inbox />;
		}
	};

	// Handle logout
	logout = () => {
		sessionStorage.removeItem('keyfile'); // Remove keyfile from sessionStorage
		sessionStorage.removeItem('drafts'); // Remove all drafts from sessionStorage
		this.props.history.push("/"); // Push '/' route (now home not mail) to router
		window.location.reload() // Force refresh page
	};

	// Get wallet address
	getWalletAddress = () => {
		const arweave = Arweave.init();
		// Collect wallet from sessionStorage and retrieve address
		arweave.wallets.jwkToAddress(JSON.parse(sessionStorage.getItem('keyfile'))).then(async address => {
			this.setState({address: address});
		})
	};

	componentDidMount() {
		this.getWalletAddress(); // Get wallet address on load
	};

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
									<span>{this.state.address ? <Address address={this.state.address} /> : "Loading..."}</span>
									<button onClick={this.logout}>Logout</button>
								</div>
								<div>
									<img src={`https://api.adorable.io/avatars/100/${this.props.keyFile.n}.png`} alt="Avatar" />
								</div>
							</div>
						</div>
					</div>
					<div className="sidebar">
						<button onClick={this.props.compose}>New Mail</button>
						<ul>
							<li><NavLink to="/inbox" activeClassName="active-sidebar-button"><i className="fa fa-inbox"></i>Inbox</NavLink></li>
							<li><NavLink to="/drafts" activeClassName="active-sidebar-button"><i className="fa fa-file-o"></i>Drafts</NavLink></li>
							<li><NavLink to="/sent" activeClassName="active-sidebar-button"><i className="fa fa-paper-plane-o"></i>Sent</NavLink></li>
						</ul>
					</div>
					<div className={this.props.location.pathname.startsWith("/sent") ? "mailbar display-mailbar-wide" : "mailbar"}>
						{this.getMailbarContent()}
					</div>
					<div className={this.props.location.pathname.startsWith("/sent") ? "content display-content-none" : "content"}>
						{this.props.children}
					</div>
				</div>
			) : null
		);
	}
}

export default withRouter(MailLayout);
