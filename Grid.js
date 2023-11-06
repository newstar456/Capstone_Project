import { EnemyObject } from './EnemyObject.js';
import {GridObject} from './GridObject.js'
import { ItemObject } from './ItemObject.js';
import { Player } from './Player.js';
import { promptPlayerForDirection } from './playerPrompts.js';


class Grid{
    #currentObject;
    constructor(width, height, playerStartX=0, playerStartY = height - 1){
        this.width = width;
        this.height = height;
        this.playerX = playerStartX;
        this.playerY = playerStartY;
        this.player = new Player('Monkey King', { attack: 10, defense: 5, hp: 20})

        this.grid = [];
        for(let row = 0; row<height; row++){
            let thisRow =[];
            for(let col = 0; col<width; col++){
                thisRow.push(new GridObject())
            }
            this.grid.push(thisRow)
        }

        this.grid[height - 1][0] = new GridObject('🐒', 'player');
        this.grid[0][width-1] = new GridObject('👑', 'win');
        this.startGame();
    }

    async startGame(){
        while(this.player.getStats().hp > 0){
            this.displayGrid();
            const response = await promptPlayerForDirection();
            switch (response){
                case 'Up': {
                    this.movePlayerUp()
                    break;
                }
                case 'Down': {
                    this.movePlayerDown()
                    break;
                }
                case 'Right': {
                    this.movePlayerRight()
                    break;
                }
                case 'Left': {
                    this.movePlayerLeft()
                    break;
                }
            }
            // this.displayGrid();
            console.log('------------------')
        }
    }

    displayGrid(){
        for(let row = 0; row < this.height; row++){
            for(let col = 0; col < this.width; col++){
                process.stdout.write(this.grid[row][col].sprite + '  ')
            }
            process.stdout.write('\n')
        }
    }

    generateGridObject(){
        const random = Math.random();
        let object;
        if(random < 0.15){
            object = new ItemObject('⚔', {
                name: 'Sword',
                attack: 3,
                defense: 1,
                hp: 0
            });
        } else if (random < 0.35){
            object = new EnemyObject('🕷', {
                name: 'Spider',
                attack: 5,
                defense: 1,
                hp: 6
            })
        } else {
            object = new GridObject('🐾', 'discovered')
        }
        return object;
    }

    executeTurn() {
        if(this.grid[this.playerY][this.playerX].type === 'win'){
            console.log(`🎉 Congrats!`)
            process.exit();
        }
        if(this.#currentObject.type === 'discovered'){
            this.#currentObject.describe();
            return;
        }
        if(this.#currentObject.type === 'item'){
            this.#currentObject.describe();
            const itemStats = this.#currentObject.getStats();
            this.player.addToStats(itemStats);
            return;
        }
        this.#currentObject.describe();
        const enemyStats = this.#currentObject.getStats();
        const enemyName = this.#currentObject.getName();
        const playerStats = this.player.getStats();
        if(enemyStats.defense > playerStats.attack) {
            console.log(`You lose - ${enemyName} was too powerful!`)
            process.exit();
        }

        let totalPlayerDamage = 0;
        while(enemyStats.hp > 0){
            const enemyDamageTurn = playerStats.attack - enemyStats.defense;
            const playerDamageTurn = enemyStats.attack - playerStats.defense;
            if(enemyDamageTurn>0){
                enemyStats.hp -= enemyDamageTurn;
            }
            if(playerDamageTurn>0){
                playerStats.hp -=playerDamageTurn;
                totalPlayerDamage += playerDamageTurn;
            }
        }
        if(playerStats.hp <= 0){
            console.log(`You loose - ${enemyName} was too powerful!`);
            process.exit();
        }
        this.player.addToStats({hp: -totalPlayerDamage});
        console.log(`You defeated the ${enemyName}`)
    }

    movePlayerRight(){
        if(this.playerX === this.width -1 ){
            console.log('Cannot move right')
            return;
        }
        this.grid[this.playerY][this.playerX] = new GridObject('🐾', 'discovered');
        this.playerX += 1;

        if(this.grid[this.playerY][this.playerX].type === 'discovered'){
            this.grid[this.playerY][this.playerX].describe();
            this.grid[this.playerY][this.playerX] = new GridObject('🐒');
        }
        this.#currentObject = this.generateGridObject();
        this.executeTurn();
        this.grid[this.playerY][this.playerX] = new GridObject('🐒');
    }
    
    movePlayerLeft(){
        if(this.playerX === 0){
            console.log('Cannot move left')
            return;
        }
        this.grid[this.playerY][this.playerX] = new GridObject('🐾', 'discovered');
        this.playerX -= 1;

        if(this.grid[this.playerY][this.playerX].type === 'discovered'){
            this.grid[this.playerY][this.playerX].describe();
            this.grid[this.playerY][this.playerX] = new GridObject('🐒');
        }
        this.#currentObject = this.generateGridObject();
        this.executeTurn();
        this.grid[this.playerY][this.playerX] = new GridObject('🐒');
    }
    movePlayerUp(){
        if(this.playerY === 0){
            console.log('Cannot move up')
            return;
        }
        this.grid[this.playerY][this.playerX] = new GridObject('🐾', 'discovered');
        this.playerY -= 1;

        if(this.grid[this.playerY][this.playerX].type === 'discovered'){
            this.grid[this.playerY][this.playerX].describe();
            this.grid[this.playerY][this.playerX] = new GridObject('🐒');
        }
        this.#currentObject = this.generateGridObject();
        this.executeTurn();
        this.grid[this.playerY][this.playerX] = new GridObject('🐒');
    }
    movePlayerDown(){
        if(this.playerY === this.height - 1){
            console.log('Cannot move down')
            return;
        }
        this.grid[this.playerY][this.playerX] = new GridObject('🐾', 'discovered');
        this.playerY += 1;

        if(this.grid[this.playerY][this.playerX].type === 'discovered'){
            this.grid[this.playerY][this.playerX].describe();
            this.grid[this.playerY][this.playerX] = new GridObject('🐒');
        }
        this.#currentObject = this.generateGridObject();
        this.executeTurn();
        this.grid[this.playerY][this.playerX] = new GridObject('🐒');
    }
}

new Grid(5,5)
