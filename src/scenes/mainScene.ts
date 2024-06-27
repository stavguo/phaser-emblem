import {
    createWorld,
    defineQuery,
    pipe,
    removeComponent,
    System,
} from 'bitecs'
import * as Phaser from 'phaser'

import Selected from '../components/selected'
import createTiles from '../helpers/createTiles'
import createUnits from '../helpers/createUnits'
import GameWorld from '../helpers/gameWorld'
import Tile from '../helpers/tile'
import Unit from '../helpers/unit'
import createActionSystem from '../systems/actionSystem'
import createCameraSystem from '../systems/cameraSystem'
import createMovementSystem from '../systems/movementSystem'
import createPhaseSystem from '../systems/phaseSystem'
import createTileSystem from '../systems/tileSystem'
import createTintSystem from '../systems/tintSystem'
// import createTutorialTextSystem from '../systems/tutorialTextSystem'
import createUnitSelectionSystem from '../systems/unitSelectionSystem'
import createUnitSystem from '../systems/unitSystem'
import cameraSetup from '../systems/cameraSystem'

export default class MainScene extends Phaser.Scene {
    private world!: GameWorld
    unitSprites!: Map<number, Unit>
    tiles!: Map<number, Tile>

    constructor() {
        super({ key: 'MainScene' })
    }

    create() {
        // Initialize world, variables, and data structures
        this.world = createWorld()
        this.world.widthInTiles = 30
        this.world.heightInTiles = 20
        this.world.tiles = new Uint32Array(this.world.widthInTiles * this.world.heightInTiles)
        this.unitSprites = new Map<number, Unit>()
        this.tiles = new Map<number, Tile>()

        // Initialize map
        cameraSetup(this)
        createTiles(this.world)
        createUnits(this.world)


        // Setup systems
        const pipeline = pipe(
            createTileSystem(this, this.tiles),
            createUnitSystem(this, this.unitSprites),
            createUnitSelectionSystem(this, this.unitSprites),
            createTintSystem(this.tiles),
            createMovementSystem(this.tiles, this.unitSprites),
            createActionSystem(),
            createPhaseSystem(this, this.world, this.unitSprites),
            // this.tutorialTextSystem = createTutorialTextSystem(this)
        )
        this.update = () => {
            pipeline(this.world)
        }

        // Initialize scene listeners
        const selectedQuery = defineQuery([Selected])
        this.input.keyboard!.on('keydown-C', () => {
            selectedQuery(this.world).forEach((eid) => {
                removeComponent(this.world, Selected, eid)
            })
        }, this)
    }

    // update(
    //     // t: number,
    //     // dt: number
    // ) {
    //     if (!this.world) {
    //         return
    //     }

    //     // map init
    //     this.tileSystem?.(this.world)
    //     this.unitSystem?.(this.world)
    //     this.unitSelectionSystem?.(this.world)
    //     this.tintSystem?.(this.world)
    //     this.movementSystem?.(this.world)
    //     this.actionSystem?.(this.world)
    //     this.phaseSystem?.(this.world)
    //     // this.tutorialTextSystem?.(this.world)
    // }
}
