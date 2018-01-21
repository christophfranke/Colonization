
import Units from '../../data/units.json';


class Colonist{
	constructor(props){
		this.colony = props.colony;
		this.type = props.type;
		this.id = Units[this.type].id;
	}
}


export default Colonist;