import GameObject from "@/GameControllers/GameObject";
import {HardwareScalingOptimization, SceneOptimizer, SceneOptimizerOptions, SimplificationType} from "@babylonjs/core";

class SceneOptimization extends GameObject{
    constructor(player) {
        super();
        this.player = player
        this.scene.getAnimationRatio();
        this.optimization()
        // this.autoLod();
        this.updateBeforeLoop()
    }

    optimization(){

        const optimizer = new SceneOptimizer(this.scene)
        optimizer.start();
        SceneOptimizer.OptimizeAsync(this.scene, SceneOptimizerOptions.ModerateDegradationAllowed(60),
            function() {
                // On success
                optimizer.stop()
            }, function() {
                console.log("cool not reach fps")
                // FPS target not reached
            });
    }




    autoLod(){
        this.scene.meshes.forEach((mesh)=>{
            if( mesh.name.includes("Z")){
                mesh.simplify(
                        [
                            { quality: 0.9, distance: 100},
                            { quality: 0.8, distance: 400, },
                        ],
                        false,
                        SimplificationType.QUADRATIC,
                        function () {
                        },
                    )
            }
        })
    }

    updateBeforeLoop(){
        this.beforeLoop=()=>{
           // console.log(window.performance.memory.usedJSHeapSize)
        }
    }
}

export default SceneOptimization
