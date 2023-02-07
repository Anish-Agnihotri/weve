import Arweave from "arweave"

const gatewayConfig = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https',
}

export const arweave = Arweave.init(gatewayConfig);
