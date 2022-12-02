import GameObject from "@/GameControllers/GameObject";
import {Color3, GlowLayer, Scene, StandardMaterial, Texture} from "@babylonjs/core";

class MaterialController extends GameObject{
    constructor() {
        super();
        this.setGlow();
    }

    setGlow() {
        const glow = new GlowLayer("glow", this.scene);
        glow.intensity = 0.6
        this.setEmission();
        this.setMeshToGlow()
        this.setMaterial()
        // Fog
        this.scene.fogMode = Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_NONE;
        //BABYLON.Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_EXP2;
        //BABYLON.Scene.FOGMODE_LINEAR;

        this.scene.fogColor = new Color3(0.9, 0.9, 0.85);
        this.scene.fogDensity = 0.002;
    }

    setEmission(){
        if(this.scene.getMaterialByName("glow_text")){
            this.glowText = this.scene.getMaterialByName("glow_text");
            this.glowText.emissiveColor = new Color3(0.769,0.663,0.110);
        }
    }

    setMeshToGlow(){
        this.glowingMesh = this.scene.meshes.forEach((mesh)=>{
            console.log(mesh.name)
            if(mesh.name.includes("glowing")){
                mesh.material = this.glowText;
                console.log(mesh.material)
            }
        })
    }

    setMaterial(){
        this.pivot = this.scene.getMeshByName("rightPivot");
        if(this.pivot){
            this.pivotMaterial = new StandardMaterial("rustMat", this.scene)
            this.pivotMaterial.diffuseTexture = new Texture("/textures/rust.jpg")
            this.pivot.material = this.pivotMaterial
        }
    }
}

export default MaterialController;
