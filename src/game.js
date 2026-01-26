import Boot from './boot.js';
import End from './end.js';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width:  1000,
    height: 600,
    parent : 'player1Holder',
    scale: {
        // mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot,  End],
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 800 }, 
            debug: false
        } 
    }
  
};
new Phaser.Game(config,'player1Holder');
//new Phaser.Game(config,'player2Holder');
/*export default class Game
{ constructor(){
    let game;

  game = new Phaser.Game(config,'player1Holder');
}
}*/
