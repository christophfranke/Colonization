

let Easing = {

	None: (k) => {
		if(k < 1)
			return 0;
		return k;
	}

}

export default Easing;