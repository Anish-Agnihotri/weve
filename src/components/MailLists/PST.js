import React from 'react';
import Address from '../Address'; // Arweave ID
import ReactTable from 'react-table-6'; // React table
import {getWalletList} from '../../utils/pst'; // Collect token holders list
import './index.css'; // Styling
import './table.css'; // Table styling

class PST extends React.Component {
	constructor() {
		super();

		this.state = {
			tokenInfo: [],
			loading: true
		};
	}
	collectTokenInfo = async () => {
		getWalletList().then(response => {
			this.setState({tokenInfo: response, loading: false});
		})
	}
	componentDidMount() {
		this.collectTokenInfo();
	}
	render() {
		const columns = [
			{Header: 'Address', accessor: 'addr', Cell: props => <To address={props.value} />},
			{Header: 'Tokens', accessor: 'balance', Cell: props => <span>{(props.value / 1000000).toLocaleString()}</span>},
			{Header: 'Percentage', accessor: 'balance', Cell: props => <span>{props.value / 10000000000}%</span>}
		];

		return (
			<div className="sent pst">
				<div>
					<div>
						<h2>weveTokens</h2>
						<span>weveTokens are profit-share tokens (PSTs) that you can purchase to invest in Weve. Token holders are distributed all fees from mails sent through Weve, and have a say in Weve development.</span>
					</div>
					<div>
						<ReactTable 
							data={this.state.tokenInfo}
							resizable={false}
							columns={columns}
							defaultPageSize={10}
							loading={this.state.loading}
							loadingText="Loading token holders"
							noDataText="No token holders found"
							className="sent-table token-table"
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default PST;

class To extends React.Component {
	render() {
		return <a className="sent-table-link" href={`https://viewblock.io/arweave/address/${this.props.address}`} target="_blank" rel="noopener noreferrer"><Address address={this.props.address} /></a>
	}
}
