import React from 'react';
import { Modal } from 'react-responsive-modal';
import Compose from '../../components/Compose';
import MailLayout from '../../components/MailLayout';

import './index.css';

import no_mail_selected from '../../static/images/no_mail_selected.png';

import MailItem from '../../components/MailItem';

export default class Mail extends React.Component {
	constructor() {
		super();

		this.state = {
			keyfile: null,
			id: null,
			type: null,
			modelState: false,
			content: []
		}
	}

	getKeyFile = () => {
		this.setState({keyfile: JSON.parse(sessionStorage.getItem('keyfile'))});
	}

	getContent = () => {
		const {location, id} = this.props.match.params;

		// TODO: Error handling for random URL
		if (location === 'inbox' && typeof id !== 'undefined') {
			this.setState({id: id, type: 'inbox'});
		} else if (location === 'drafts' && typeof id !== 'undefined') {
			this.setState({id: id, type: 'drafts'});
		} else {
			this.setState({id: null});
		}
	}

	toggleModal = () => {
		this.setState(previousState => ({ modalState: !previousState.modalState, keyFileName: "Upload keyfile", isLoading: false}));
	}

	componentDidMount() {
		this.getKeyFile();
		this.getContent();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.getContent();
		}
	}

	render() {
		return (
			<>
				<Modal 
					open={this.state.modalState} 
					onClose={this.toggleModal}
					center={true}>
					<Compose toggleSelf={this.toggleModal} />
				</Modal>
				<MailLayout compose={this.toggleModal} keyFile={this.state.keyfile ? this.state.keyfile : null} location={this.props.match.params}>
					{this.state.id !== null ? (
						<MailItem id={this.state.id} type={this.state.type} />
					) : (
						<div className="no-mail-selected">
							<img src={no_mail_selected} alt="No mail selected" />
							<h3>No mail selected</h3>
						</div>
					)}
				</MailLayout>
			</>
		);
	}
}
