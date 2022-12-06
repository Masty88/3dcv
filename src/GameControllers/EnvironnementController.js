import GameObject from "@/GameControllers/GameObject";
import {
    AmmoJSPlugin,
    Color3, CubeTexture, GlowLayer, HingeJoint,
    Mesh,
    MeshBuilder,
    PhysicsImpostor, PhysicsViewer, PolygonMeshBuilder, Quaternion,
    SceneLoader,
    StandardMaterial, Texture, TransformNode,
    Vector2,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders"
import ammo from "ammo.js";


class EnvironnementController extends GameObject{
    constructor() {
        super();
        this.createSkyBox()
    }

     createSkyBox(){
         const skybox = MeshBuilder.CreateBox("skyBox", { size: 200.0 }, this.scene);
         // skybox.physicsImpostor = new PhysicsImpostor(skybox, PhysicsImpostor.BoxImpostor,{mass:0}, this.scene)
         const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
         skyboxMaterial.backFaceCulling = false;
         skyboxMaterial.reflectionTexture = new CubeTexture("skybox/JPEG/sky", this.scene);
         skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
         skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
         skyboxMaterial.disableLighting = false;
         skyboxMaterial.specularColor = new Color3(0, 0, 0);
         skybox.material = skyboxMaterial;
     }

      async load(){
          const physicsViewer = new PhysicsViewer();
          const ground= MeshBuilder.CreateBox("ground",{width: 150, height: 0.2, depth:150},this.scene);
          let groundMat= new StandardMaterial("groundMat", this.scene);
          groundMat.diffuseColor = Color3.FromHexString("836363FF");
          ground.material = groundMat;
          ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction:0.7}, this.scene);
          ground.isVisible = false;
          ground.position = new Vector3(0,-0.45,0);

          const city=  await this.loadAssets();
          city.result.meshes.forEach((mesh)=>{
              if(mesh.name.includes("impostor") && mesh.name.includes("cube")){
                  mesh.setParent(null)
                  mesh.isVisible = false;
                  mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor,{mass: 0,restitution:0.1,friction:0.7})
              }
              if(mesh.name === "Zone1" || mesh.name === "Zone2"){
                  mesh.setParent(null);
                  mesh.isVisible = false;
              }
          })

          // physicsViewer.showImpostor(this.scene.getMeshByName("pallet_impostor_cube").physicsImpostor, this.scene.getMeshByName("pallet_impostor_cube"));

    }


     async loadAssets(){
         const result= await SceneLoader.ImportMeshAsync('',"/assets/","factory.glb",this.scene);
         result.meshes[0].name = "factory"
         return{
             result
         }
     }

}

export default EnvironnementController
