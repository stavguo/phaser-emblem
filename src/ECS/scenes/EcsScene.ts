import {
    addComponent,
    addEntity,
    createWorld,
    IWorld,
    System
} from 'bitecs'
import * as Phaser from 'phaser'
import { createNoise2D } from 'simplex-noise'
import { Cell } from '../components/base/cell'
import { Sprite } from '../components/base/sprite'
import { Phase } from '../components/state/phase'
import { Noise } from '../components/tile/noise'
import { Tile } from '../components/tile/tile'
import { createAvailableTileSystem } from '../systems/availableTileSystem'
import { createCameraSystem } from '../systems/cameraSystem'
import { createMovementSystem } from '../systems/movementSystem'
import { createNoiseSystem } from '../systems/noiseSystem'
import { createSelectActorSystem } from '../systems/selectActorSystem'
import { createSelectTileSystem } from '../systems/selectTileSystem'
// import { createRiverSystem } from '../systems/riverSystem'
import { createSpriteSystem } from '../systems/spriteSystem'
import { createTintSystem } from '../systems/tintSystem'
import { Path } from '../types/Path'
import { createTutorialTextSystem } from '../systems/tutorialTextSystem'


export default class EcsScene extends Phaser.Scene {
    private world?: IWorld
    private spriteSystem?: System
    private cameraSystem?: System
    private doubleClickSystem?: System
    private availableTileSystem?: System
    private tintSystem?: System
    private movementSystem?: System
    private noiseSystem?: System
    private neighborSystem?: System
    // private riverSystem?: System
    private selectTileSystem?: System
    private tutorialTextSystem?: System
    spriteById: Map<number, Phaser.GameObjects.Sprite>
    availableTiles: Map<number, Map<number, Path>>
    tiles: Map<string, number>

    constructor() {
        super({ key: 'EcsScene' })
    }

    create() {
        this.world = createWorld()
        this.spriteById = new Map<number, Phaser.GameObjects.Sprite>()
        this.availableTiles = new Map<number, Map<number, Path>>()
        this.tiles = new Map<string, number>()

        // Initialize game manager
        const gm = addEntity(this.world)
        addComponent(this.world, Phase, gm)

        //Initialize enemy
        //this.createEnemy()

        //Initialize player
        //this.createPlayer()

        // Initialize map
        const noise2D = createNoise2D()
        for (let row = 0; row < 20; ++row) {
            for (let col = 0; col < 30; ++col) {
                const tile = addEntity(this.world)
                this.tiles.set(`${col},${row}`, tile)
                addComponent(this.world, Tile, tile)

                // Set Cell
                addComponent(this.world, Cell, tile)
                Cell.row[tile] = row
                Cell.col[tile] = col

                // Set sprite
                addComponent(this.world, Sprite, tile)
                Sprite.texture[tile] = 2

                // const noise = noise2D(row /10, col /10)
                const noise = noise2D(row/15, col/15)
                addComponent(this.world, Noise, tile)
                Noise.value[tile] = noise
            }
        }

        // Sprite system
        this.spriteSystem = createSpriteSystem(
            this,
            [
                'goodChar',
                'badChar',
                'terrain'
            ],
            this.spriteById
        )

        // Initialize camera system
        this.cameraSystem = createCameraSystem(this)

        // Initialize available tile system
        this.availableTileSystem = createAvailableTileSystem(this.availableTiles)

        // Initialize double click detection system
        this.doubleClickSystem = createSelectActorSystem(this, this.spriteById, this.availableTiles)

        this.tintSystem = createTintSystem(this.spriteById)

        this.movementSystem = createMovementSystem(this.spriteById)

        this.noiseSystem = createNoiseSystem()

        // this.riverSystem = createRiverSystem(this.tiles)

        this.selectTileSystem = createSelectTileSystem(this, this.spriteById, this.availableTiles)

        this.tutorialTextSystem = createTutorialTextSystem(this)
    }

    update(
        // t: number,
        // dt: number
    ) {
        if (!this.world) {
            return
        }
        // camera init
        this.cameraSystem?.(this.world)

        // map init
        this.noiseSystem?.(this.world)
        this.neighborSystem?.(this.world)
        // this.riverSystem?.(this.world)

        this.spriteSystem?.(this.world)
        this.availableTileSystem?.(this.world)
        this.doubleClickSystem?.(this.world)
        this.selectTileSystem?.(this.world)
        this.tutorialTextSystem?.(this.world)
        this.tintSystem?.(this.world)
        this.movementSystem?.(this.world)
    }
}