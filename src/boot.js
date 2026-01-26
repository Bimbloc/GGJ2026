/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.setPath('assets');
    this.load.image('logo','logo.png');
    this.load.image('present', 'gift.png');
    this.load.image('player', 'rac.png');
    this.load.spritesheet('racsheet', 'raccoonsheet.png', {
      frameWidth: 110,
      frameHeight: 170
    });
    this.load.spritesheet('drsheet', 'deersheet.png', {
      frameWidth: 110,
      frameHeight: 79
    });
    this.load.spritesheet('psheet', 'pilesheet.png', {
      frameWidth: 216,
      frameHeight: 266
    });
    this.load.spritesheet('snow','snowfall.png',{
      frameWidth: 500,
      frameHeight: 699

    });
    this.load.image('title','title.png');
    this.load.image('play','playbutton.png');
    this.load.image('screen','endscreen.png');
    this.load.image('portal','deer.png');
    this.load.image('ui','ui.png');
    this.load.image('floor','floor.png');
    this.load.image('background','background2.png');
    this.load.image('bacground','bacground.png');
    this.load.image('ammo','pile.png');
    this.load.audio('menumusic','menumusic.mp3');
    this.load.audio('mainmusic','mainmusic.mp3');
    this.load.audio('racsteps','raccooonfootstep.mp3');
    this.load.setPath('assets');
    //this.load.tiledmapTiledJSON('tiledmap','mapa.json');
    //this.load.image('mp','mp.png');

  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    
    this.scene.start('menu');
    
  }
}