import { createConnectedStore } from 'undux';

export default createConnectedStore({
	inbox: [],
	nameService: new Map()
})
