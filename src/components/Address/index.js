import React from 'react';
import {identity} from '../../utils/crypto'; // Import identity function
import Store from '../../stores'; // Import store for nameService

class Address extends React.Component {
	state = {
		address: this.props.address // Default return "Loading..."
	}

	getAddress = async address => {
		let store = this.props.store; // Access undux store
		let nameService = store.get('nameService'); // Collect nameService

		// If nameService contains address
		if (nameService.has(address)) {
			// Retrieve address mapping from memory
			this.setState({address: nameService.get(address)});
		} else {
			// If nameService does not contain address, check identity
			let addr = await identity(address);

			// Update nameService
			nameService.set(address, addr);
			store.set('nameService')(nameService);
			this.setState({address: addr});
		}
	};

	async componentDidMount() {
		await this.getAddress(this.props.address); // Call getAddress on mount
	}

	render() {
		return this.state.address;
	}
}

export default Store.withStore(Address);
