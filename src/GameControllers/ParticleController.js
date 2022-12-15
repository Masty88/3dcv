import gameObject from "@/GameControllers/GameObject";
import {Color4, MeshBuilder, ParticleSystem, Texture, TransformNode, Vector3} from "@babylonjs/core";

class ParticleController extends gameObject{
    constructor() {
        super();
        this.setParticle()
    }

    setParticle(){
        this.createParticleSystem("particle_position");
        this.createParticleSystem("particle_pos_van");
    }

    createParticleSystem(name){
        // Create a particle system
        const particleSystem = new ParticleSystem("particles", 8000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/FFV/smokeParticleTexture.png", this.scene);

        // lifetime
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 6;

        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 5;


        // emit rate
        particleSystem.emitRate = 30;

        // gravity
        particleSystem.gravity = new Vector3(0.25, 1.5, 0);

        // size gradient
        particleSystem.addSizeGradient(0, 0.6, 1);
        particleSystem.addSizeGradient(0.3, 1, 2);
        particleSystem.addSizeGradient(0.5, 2, 3);
        particleSystem.addSizeGradient(1.0, 6, 8);

        // color gradient
        particleSystem.addColorGradient(0, new Color4(0.5, 0.5, 0.5, 0),  new Color4(0.8, 0.8, 0.8, 0));
        particleSystem.addColorGradient(0.4, new Color4(0.1, 0.1, 0.1, 0.1), new Color4(0.4, 0.4, 0.4, 0));
        //particleSystem.addColorGradient(0.7, new Color4(0.03, 0.03, 0.03, 0.2), new Color4(0.3, 0.3, 0.3, 0.4));
        particleSystem.addColorGradient(1.0, new Color4(0.0, 0.0, 0.0, 0), new Color4(0.03, 0.03, 0.03, 0));

        // speed gradient
        particleSystem.addVelocityGradient(0, 1, .5);
        particleSystem.addVelocityGradient(0.1, 0.8, 0.9);
        particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
        particleSystem.addVelocityGradient(1, 0.1, 0.2);

        // rotation
        particleSystem.minInitialRotation = 0;
        particleSystem.maxInitialRotation = Math.PI;
        particleSystem.minAngularSpeed = -1;
        particleSystem.maxAngularSpeed = 1;

        // blendmode
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;

        // emitter shape
        const sphereEmitter = particleSystem.createSphereEmitter(0.1);


        // Where the particles come from
        particleSystem.emitter = MeshBuilder.CreateBox("emitter"); // the starting object, the emitter
        particleSystem.emitter.isVisible = false
        particleSystem.emitter.setParent(this.scene.getTransformNodeByName(name))
        particleSystem.emitter.position = Vector3.Zero();
        particleSystem.minEmitBox = new Vector3(-0.5, -0.5, -0.5); // Starting all from
        particleSystem.maxEmitBox = new Vector3(0.5, 0.5, 0.5); // To...

        // Start the particle system
        particleSystem.start();
    }
}

export default ParticleController;
