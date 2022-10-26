import GameObject from "@/GameControllers/GameObject";
import {Matrix, Mesh, MeshBuilder, Quaternion, SceneLoader, TransformNode, Vector3} from "@babylonjs/core";

class PlayerLoader extends GameObject{
    constructor() {
        super();
        this.createCollisionMesh();
    }
    createCollisionMesh(){
        this.main= new Mesh('parent',this.scene);

        //Camera target
        this.target= new TransformNode("target");
        this.target.parent= this.main;
        this.target.position = new Vector3(0,3,-10)

        this.character= new Mesh('character', this.scene)
        this.character.parent= this.main;

        this.main.position = new Vector3(0,0,0)

        //Create elipsoide
        this.main.ellipsoid = new Vector3(0.5, 0.9, 0.5);
        this.main.ellipsoidOffset = new Vector3(0, this.main.ellipsoid.y, 0);
        this.main.checkCollisions = true;
    }

    async loadPlayer(){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/","cat.glb", this.scene)
            const root = result.meshes[0];

            //body is our actual player mesh
            this.body = root;
            this.body.parent = this.main;
            this.body.isPickable = false; //so our raycasts dont hit ourself
            this.body.getChildMeshes().forEach(m => {
                m.isPickable = false;
                m.receiveShadows= true;
            })
            return {
                    mesh: this.mesh,
                    animationGroups: result.animationGroups
            }
    }
}

export default PlayerLoader;
