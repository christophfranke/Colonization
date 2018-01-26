

class Global{
	static register(key, obj){
		if(Global[key])
			console.error('duplicate global key', key, obj);
		else
			Global[key] = obj;
	}
}


export default Global;