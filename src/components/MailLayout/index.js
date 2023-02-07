import React from 'react';
import Arweave from 'arweave/web'; // Arweave
import { withRouter, NavLink } from 'react-router-dom'; // Navigation
import Address from '../Address'; // Arweave ID
import SlidingPane from 'react-sliding-pane'; // Sliding pane for notifications
import 'react-sliding-pane/dist/react-sliding-pane.css';
import './index.css';
import { arweave } from '../../utils/globals';

// Sliding pane notifications
import Notifications from '../Notifications';

// Individual mailboxes
import Inbox from '../MailLists/Inbox';
import Drafts from '../MailLists/Drafts';
import Sent from '../MailLists/Sent';
import Contacts from '../MailLists/Contacts';

class MailLayout extends React.Component {
	constructor() {
		super();

		this.state = {
			address: null, // Initialize address to null
			inbox: true, // Set inbox as default mailbox
			notificationsOpen: false // Initialize notifications sliding pane to closed
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
		} else if (this.props.location.pathname === "/contacts") {
			// Return contacts
			return <Contacts />;
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
		sessionStorage.removeItem('notifications'); // Remove all notifications from sessionStorage
		window.location.reload() // Force refresh page
	};

	// Get wallet address
	getWalletAddress = () => {
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
				<>
					<SlidingPane
					isOpen={this.state.notificationsOpen}
					className="notifications-pane"
					title="Notifications"
					subtitle="Sent mail details"
					onRequestClose={() => this.setState({notificationsOpen: false})}>
						<Notifications />
					</SlidingPane>
					<div className="mail">
						<div className="header">
							<div>
								<h1 className="unselectable">weve.</h1>
							</div>
							<div>
								<button className="notifications" onClick={() => this.setState({notificationsOpen: true})}><i className="fa fa-bell"></i></button>
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
								<li><NavLink to="/contacts" activeClassName="active-sidebar-button"><i className="fa fa-address-book"></i>Contacts</NavLink></li>
							</ul>
						</div>
						<div className={this.props.location.pathname.startsWith("/sent") || this.props.location.pathname.startsWith("/contacts") || this.props.location.pathname.startsWith("/pst") ? "mailbar display-mailbar-wide" : "mailbar"}>
							{this.getMailbarContent()}
						</div>
						<div className={this.props.location.pathname.startsWith("/sent") || this.props.location.pathname.startsWith("/contacts") || this.props.location.pathname.startsWith("/pst") ? "content display-content-none" : "content"}>
							{this.props.children}
						</div>
					</div>
				</>
			) : null
		);
	}
}

export default withRouter(MailLayout);
