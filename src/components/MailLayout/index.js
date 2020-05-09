import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './index.css';

// TODO: rewrite layout for mobile display

import Inbox from '../MailLists/Inbox';
import Drafts from '../MailLists/Drafts';
import Sent from '../MailLists/Sent';

class MailLayout extends React.Component {
	getMailbarContent = () => {
		switch(this.props.location.pathname) {
			case "/":
				return <Inbox />
			case "/drafts":
				return <Drafts />
			case "/sent":
				return <Sent />
			default:
				return <Inbox />
		}
	}
	logout = () => {
		sessionStorage.removeItem('keyfile');
		// TODO: modal better way to do this
		this.props.history.push("/");
		window.location.reload()
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
									<span>hurhbhehjg1212heu1b2iehb2jeh1hjdwjbwjbdjwbdjbwhe</span>
									<button onClick={this.logout}>Logout</button>
								</div>
								<div>
									<img src={`https://api.adorable.io/avatars/100/${this.props.keyFile.n}.png`} alt="Avatar" />
								</div>
							</div>
						</div>
					</div>
					<div className="sidebar">
						<button>New Email</button>
						<ul>
							<li><NavLink to="/" exact activeClassName="active-sidebar-button"><i className="fa fa-inbox"></i>Inbox</NavLink></li>
							<li><NavLink to="/drafts" activeClassName="active-sidebar-button"><i className="fa fa-file-o"></i>Drafts</NavLink></li>
							<li><NavLink to="/sent" activeClassName="active-sidebar-button"><i className="fa fa-send-o"></i>Sent</NavLink></li>
						</ul>
					</div>
					<div className="mailbar">
						{this.getMailbarContent()}
					</div>
					<div className="content">
						<span>Test</span>
					</div>
				</div>
			) : null
		);
	}
}

export default withRouter(MailLayout);
