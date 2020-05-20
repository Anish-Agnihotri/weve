import React from 'react';
import moment from 'moment'; // Unix timestamp parsing
import {get_tx_status} from '../../utils/crypto'; // Get tx status function
import './index.css';

class Notifications extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true, // Initialize loading to true
			notifications: [], // Initialize empty notifications array
		}
	}

	// Get all notifications from sessionStorage
	getNotifications = async () => {
		// If notifications sessionStorage item exists
		if (sessionStorage.getItem('notifications') !== null) {
			let notifications = JSON.parse(sessionStorage.getItem('notifications')).reverse(); // Parse notifications

			// Collect most recent pending status
			for (let i = 0; i < notifications.length; i++) {
				notifications[i].pending = await get_tx_status(notifications[i].id);
			}

			this.setState({notifications: notifications, loading: false}); // Update notifications in state
		} else {
			// Set loading to false, keep empty notifications array
			this.setState({loading: false});
		}
	};

	componentDidMount() {
		this.getNotifications(); // Collect all notifications on load
	}

	render() {
		return (
			<div className="notifications-list">
				{this.state.loading ? (
					<div className="loading notifications-loading">
						<i className="fa fa-spinner fa-spin"></i>
						<h5>Retrieving notifications</h5>
					</div>
				) : (
					this.state.notifications.length ? (
						this.state.notifications.map((notification, index) => {
							return <NotificationItem 
										id={notification.id} 
										timestamp={notification.timestamp} 
										pending={notification.pending}
									/>
						})
					) : (
						<div className="empty notifications-empty">
							<i className="fa fa-bell"></i>
							<h4>No notifications found</h4>
							<span>Send a transaction to get started.</span>
						</div>
					)
				)}
			</div>
		);
	}
}

class NotificationItem extends React.Component {
	render() {
		return (
			<a href={`https://viewblock.io/arweave/tx/${this.props.id}`} target="_blank" rel="noopener noreferrer" className="notification-item">
				<div>
					<div className={this.props.pending ? "" : "confirmed-notification"}>
						<i className={this.props.pending ? "fa fa-spinner fa-spin" : "fa fa-check"}></i>
					</div>
				</div>
				<div>
					<p><strong>Mail {this.props.pending ? "send pending" : "sent succesfully"}.</strong> Tx ID: <span>{this.props.id}.</span></p>
					<span>{this.props.timestamp ? moment(this.props.timestamp).fromNow() : ""}</span>
				</div>
			</a>
		);
	}
}

export default Notifications;
