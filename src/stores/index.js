import { createConnectedStore } from 'undux';

export default createConnectedStore({
	inbox: [],
	sent: [],
	nameService: new Map()
})
