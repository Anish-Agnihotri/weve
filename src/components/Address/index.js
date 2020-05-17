import React from 'react';
import {identity} from '../../utils/crypto'; // Import identity function

export default class Address extends React.Component {
	state = {
		address: this.props.address // Default return "Loading..."
	}

	getAddress = async address => {
		let addr = await identity(address);
		this.setState({address: addr});
	};

	async componentDidMount() {
		await this.getAddress(this.props.address); // Call getAddress on mount
	}

	render() {
		return this.state.address;
	}
}
