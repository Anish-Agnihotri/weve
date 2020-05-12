import React from 'react';
import {identity} from '../../utils/crypto';

export default class Address extends React.Component {
	state = {
		address: 'Loading...'
	}
	getAddress = async address => {
		let addr = await identity(address);
		this.setState({address: addr});
	}
	async componentDidMount() {
		await this.getAddress(this.props.address);
	}
	render() {
		return this.state.address;
	}
}
