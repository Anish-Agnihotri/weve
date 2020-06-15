import Arweave from 'arweave/web';
const arweave = Arweave.init();

// Get current PSTAllocation percentages
export const getPSTAllocation = async () => {
	let maxPST = 1000000000000;
	return calculateFeeRecipient(await getWalletList(), maxPST);
}

export const getWalletList = async () => {
	let weveTokenContract = 'VmuX0SkjULd1RJ1CGHf5hPb9A9gtqSty8Hh3Uir84oc';

	let tipTX = await findContractTip(weveTokenContract);
	return JSON.parse(getTXState(tipTX)).walletList;
}

const calculateFeeRecipient = (stakeholders, maxPST) => {
	let weightedStakeholders = {};

	for (let i = 0; i < stakeholders.length; i++) {
		weightedStakeholders[stakeholders[i].addr] = stakeholders[i].balance / maxPST;
	}

	return weightedRandom(weightedStakeholders);
}

const weightedRandom = probability => {
	let i, sum = 0, r = Math.random();
	
	for (i in probability) {
		sum += probability[i];
		if (r <= sum) return i;
	}
}

/*
	Helper functions retrieved from SmartWeave libraries
*/
const findContractTip = async contractID => {
	const contract = await getContract(contractID);
	let current = contract.contractTX;
	let state = getTXState(current);
	let last;

	do {
		last = current;
		current = await findNextTX(contract, state, current);
		state = getTXState(current);
	}
	while(current);

	return last;
};


const getContract = async contractID => {
	const contractTX = await arweave.transactions.get(contractID);
	const contractSrcTXID = await getTag(contractTX, 'Contract-Src');
	const minDiff = await getTag(contractTX, 'Min-Diff');
	const contractSrcTX = await arweave.transactions.get(contractSrcTXID);
	const contractSrc = await contractSrcTX.get('data', {decode: true, string: true});
	const state = await contractTX.get('data', {decode: true, string: true});

	return {
		id: contractID,
		contractSrc: contractSrc,
		initState: state,
		minDiff: minDiff,
		contractTX: contractTX
	}
}

const findNextTX = async (contract, state, currentTX) => {
	let successorsQuery =
		{
			op: 'and',
			expr1:
				{
					op: 'equals',
					expr1: 'App-Name',
					expr2: 'SmartWeave'
				},
			expr2:
				{
					op: 'equals',
					expr1: 'Previous-TX',
					expr2: currentTX.id
				}
		}
	const response = await arweave.api.post(`arql`, successorsQuery)
	const results = response.data

	let successors = (results == '') ? [] : results

	for(let i = 0; i < successors.length; i++) {
		let TX = await arweave.transactions.get(successors[i])
		if(validateNextTX(contract, state, TX))
			return TX
	}

	return false
};

const getTXState = (TX) => {
	if(!TX) return false
	if(getTag(TX, 'Type') == "contract")
		return TX.get('data', {decode: true, string: true})
	else
		return JSON.parse(TX.get('data', {decode: true, string: true}))['newState']
};

const getTag = async (TX, name) => {
	let tags = TX.get('tags')

	for(let i = 0; i < tags.length; i++)
		if(tags[i].get('name', { decode: true, string: true }) == name)
			return tags[i].get('value', { decode: true, string: true })

	return false
};


const validateNextTX = async (contract, state, nextTX) => {
	let struct = JSON.parse(nextTX.get('data', {decode: true, string: true}))
	return (
		contract.contractSrc, 
		struct.input, 
		state, 
		await arweave.wallets.ownerToAddress(nextTX.owner)
	);
};
