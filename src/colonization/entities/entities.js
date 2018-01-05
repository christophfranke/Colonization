/**
 * Player Entity
 */

class PlayerEntity extends window.me.Entity{

    /**
     * constructor
     */
    init (x, y, settings) {
        
        console.log('alive');
        // call the constructor
        this._super(window.me.Entity, 'init', [x, y , settings]);
    }

    /**
     * update the entity
     */
    update (dt) {

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        window.me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(window.me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision (response, other) {
        // Make all other objects solid
        return true;
    }
};

export default PlayerEntity;