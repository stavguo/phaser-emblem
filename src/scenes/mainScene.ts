import {
    createWorld,
    defineQuery,
    pipe,
    removeComponent,
} from 'bitecs'
import * as Phaser from 'phaser'

import Selected from '../components/selected'
import createTiles from '../helpers/createTiles'
import createUnits from '../helpers/createUnits'
import GameWorld from '../helpers/gameWorld'
import createActionSystem from '../systems/actionSystem'
import cameraSetup from '../systems/cameraSystem'
import createMovementSystem from '../systems/movementSystem'
import createPhaseSystem from '../systems/phaseSystem'
import createStatWindowSystem from '../systems/statWindowSystem'
import createTileSystem from '../systems/tileSystem'
import createTintSystem from '../systems/tintSystem'
// import createTutorialTextSystem from '../systems/tutorialTextSystem'
import createUnitSelectionSystem from '../systems/unitSelectionSystem'
import createUnitSystem from '../systems/unitSystem'

export default class MainScene extends Phaser.Scene {
    private world!: GameWorld
    private unitSprites!: Map<number, Phaser.GameObjects.Sprite>
    private tiles!: Map<number, Phaser.GameObjects.Image>

    constructor() {
        super({ key: 'MainScene' })
    }

    create() {
        // Initialize world, variables, and data structures
        this.world = createWorld()
        this.world.widthInTiles = 30
        this.world.heightInTiles = 20
        this.world.selected = 0
        this.world.tiles = new Uint32Array(this.world.widthInTiles * this.world.heightInTiles)
        this.unitSprites = new Map<number, Phaser.GameObjects.Sprite>()
        this.tiles = new Map<number, Phaser.GameObjects.Image>()

        // Initialize map
        cameraSetup(this)
        createTiles(this.world)
        createUnits(this.world)

        // Setup systems
        const pipeline = pipe(
            createTileSystem(this, this.tiles),
            createUnitSystem(this, this.unitSprites),
            createUnitSelectionSystem(this.unitSprites),
            createTintSystem(this.tiles, this.unitSprites),
            createMovementSystem(this.tiles, this.unitSprites),
            createActionSystem(),
            createPhaseSystem(this, this.world),
            createStatWindowSystem(this),
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
}
