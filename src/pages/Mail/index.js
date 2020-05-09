import React from 'react';
import MailLayout from '../../components/MailLayout';

export default class Mail extends React.Component {
	constructor() {
		super();

		this.state = {
			keyfile: null,
		}
	}
	getKeyFile = () => {
		this.setState({keyfile: JSON.parse(sessionStorage.getItem('keyfile'))});
	}
	componentDidMount() {
		this.getKeyFile();
	}
	render() {
		return (
			<MailLayout keyFile={this.state.keyfile ? this.state.keyfile : null} location={this.props.match.params}>

			</MailLayout>
		);
	}
}
