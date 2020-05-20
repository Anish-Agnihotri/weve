import React from 'react';
import './index.css';

class Notifications extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			notifications: [],
		}
	}

	render() {
		return (
			<div className="notifications-list">
				<NotificationItem />
			</div>
		);
	}
}

class NotificationItem extends React.Component {
	render() {
		return (
			<div className="notification-item">
				<div>
					<div>
						<i className="fa fa-mail-o"></i>
					</div>
				</div>
				<div>
					<p>Testing some long form content</p>
					<span>Testing a date item</span>
				</div>
			</div>
		);
	}
}

export default Notifications;
