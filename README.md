<a name="readme-top"></a>

# Phaser-Emblem ⚔️ [Demo](https://stavguo.github.io/phaser-emblem/)

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#controls">Controls</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



## About The Project
### Inspired by Nintendo’s Fire Emblem franchise, I developed this demo to recreate and showcase its pathfinding logic.
[![Phaser Emblem Screen Shot][product-screenshot]](https://stavguo.github.io/phaser-emblem/)

### Fire Emblem
In the Fire Emblem series, the battlefield is arranged as a grid of square spaces, and so a unit's movement is equivalent to the number of adjacent spaces that unit may move in one turn. A unit's ability to move around the map is hindered by the terrain, with certain types of spaces costing more than one movement to cross (such as forests or mountains) or completely disallowing being passed at all (walls and empty spaces).

### Implementation
In my implementation, a unit can spend up to five movement points per turn. My procedurally-generated terrain made with [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) contains spaces with the following movement costs:
* a grassy space costs one movement point
* a tree space costs two movement points
* a forest space costs three movement
* a water space is impassable<br>

For my custom pathfinding algorithm, I adapted the [A* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) to traverse over terrain with variable movement costs. A* is an informed search algorithm that finds the shortest path in terms of cost (least distance traveled, shortest time, etc.) given the start and end node of a weighted graph. It does this by maintaining a tree of paths originating at the start node and extending those paths one edge at a time until the goal node is reached.

![Astar Progress Animation](https://upload.wikimedia.org/wikipedia/commons/5/5d/Astar_progress_animation.gif)

### Built With

* [Phaser](Phaser-url): An open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers.
* [bitECS](bitECS-url): A high performance [ECS](https://en.wikipedia.org/wiki/Entity_component_system) library written using JavaScript TypedArrays.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Getting Started

You can play the demo [here](https://stavguo.github.io/phaser-emblem/). Alternatively, you can run it locally on your computer.

### Prerequisites

To run the demo locally, you must [install node](https://nodejs.org/en/download). As of writing this, I'm running the project on ```v20.11.1```.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/stavguo/phaser-emblem.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start project
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Controls

* To move around, click and drag anywhere on the scene.
* To view the tinted spaces a unit can move to, <strong>double-click</strong> the unit.
* To move a unit, <strong>double-click</strong> a tinted space.
* To undo the selection of a unit, <strong>double-click</strong> the unit again.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

Gustavo D'Mello - stavguo@duck.com

Project Link: [https://github.com/stavguo/phaser-emblem](https://github.com/stavguo/phaser-emblem)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Acknowledgments

* [Sebastian Lague's A* Implementation](https://github.com/SebLague/Pathfinding/tree/master)
* [Introduction to the A* Algorithm from Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: product-pic.jpg
[Phaser-url]: https://phaser.io/
[bitECS-url]: https://github.com/NateTheGreatt/bitECS
