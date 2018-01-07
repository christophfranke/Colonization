


class Map extends window.me.Entity{
	init(){

        this._super(window.me.Entity, 'init', [0, 0, {
        	width: 0,
        	height: 0,
        	name: "Map"
        }]);

	}

	update(dt){
		this._super(window.me.Entity, [dt]);
		console.log('hallo');
		return true;
	}

	draw(){
		console.log('drawing');
	}
};

export default Map;