import { arweave } from "./globals";

export const getWeavemailTransactions = async (arweave, address, mailItemTxid) => {

	var mailItemFilter = "";
	if (mailItemTxid) {
		mailItemFilter = `ids: ["${mailItemTxid}"],`;
	}

	var addressFilter = ""
	if (address) {
		addressFilter = `recipients: ["${address}"],`;
	}

	const res2 = await arweave.api.post('/graphql', {
		query: `
			{
				transactions(first: 50, 
					${addressFilter}
					${mailItemFilter}
					tags: [
						{
							name: "App-Name",
							values: ["permamail"]
						}
					]
				) {
					edges {
						node {
							id
							recipient
							owner {
								address
							}
							tags {
								name
								value
							}
							block {
								timestamp
								height
							}
							quantity {
								winston
							}
							fee {
								winston
							}
						}
					}
				}
			}`,
	});
	return res2.data;
}