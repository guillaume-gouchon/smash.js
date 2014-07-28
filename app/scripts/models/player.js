
/**
* BODY
*/
Physics.body('player', 'rectangle', function (parent) {

  var START_LIFE = 3;
  var INITIAL_MASS = 1.0;
  var DEFAULT_NAMES = ['Colonel Heinz', 'Juice Master', 'Lord Bobby', 'Lemon Alisa',
            'The Red Baron', 'Tom Boy', 'Tommy Toe', 'Lee Mon', 'Sigmund Fruit', 'Al Pacho', 
            'Mister Bean', 'Ban Anna', 'General Grape', 'Smoothie', 'Optimus Lime'];
  var DEFAULT_CHARACTERS = ['tomato', 'lemon'];

  function getRandomName() {
    return DEFAULT_NAMES[parseInt(Math.random() * DEFAULT_NAMES.length)];
  }

  function getRandomCharacter() {
    return DEFAULT_CHARACTERS[parseInt(Math.random() * DEFAULT_CHARACTERS.length)];
  }

  function getStartPosition(viewport) {
    return {
      x: (viewport.width + 500 * (2 * Math.random() - 1)) / 2,
      y: Math.random() < 0.5 ? viewport.height / 2 - 50 : viewport.height / 2 + 105
    };
  }

  return {

   init: function (options) {
      var startPosition = getStartPosition(options.viewport);
      var defaults = {
        gameType: 'player',
        restitution: 0.2,
        cof: 0.3,
        height: 30,
        width: 30,
        mass: INITIAL_MASS,
        x: startPosition.x,
        y: startPosition.y
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.life = START_LIFE;
      this.name = getRandomName();
      this.commands = new Controller(this.id).toJSON();
      this.currentJump = 0;
      this.currentBomb = 0;
      this.orientation = 1;
      this.speed = 0.2;
      this.nbJumps = 2;
      this.jumpSkill = 0.25;
      this.nbBombs = 1;
      this.chargeAttack = -1;
      this.chargeJump = -1;
      this.enabled = true;

      this.character = getRandomCharacter();
      
      this.view = renderer.createDisplay('sprite', {
        texture: 'images/' + this.character + '.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },

    moveLeft: function () {
      this.state.vel.x = -this.speed;
      this.orientation = -1;
    },

    moveRight: function () {
      this.state.vel.x = this.speed;
      this.orientation = 1;
    },

    stop: function () {
      this.state.vel.x = 0;
    },

    attack: function () {
      if (this.enabled && this.chargeAttack == -1 && this.currentBomb < this.nbBombs) {
        this.chargeAttack = new Date().getTime();
      }
    },

    releaseAttack: function () {
      if (this.chargeAttack > 0 && this.currentBomb < this.nbBombs) {
        var power = 0.2 + (new Date().getTime() - this.chargeAttack) / 1000;
        this.chargeAttack = -1;

        var world = this._world;
        var pos = this.state.pos;
        var scratch = Physics.scratchpad();
        var rnd = scratch.vector();
        rnd.set(this.orientation * 20, -0.7 * 20);        

        var bomb = Physics.body('bomb', {
          x: this.state.pos.get(0),
          y: this.state.pos.get(1),
          image: this.character
        });
        bomb.state.pos.set(pos.get(0) + rnd.get(0), pos.get(1) + rnd.get(1));
        bomb.state.vel.set(this.orientation * power * 0.7, - 0.3 * power);
        bomb.state.angular.vel = (Math.random() - 0.5) * 0.06;

        var _this = this;
        setTimeout(function() {
          bomb.explode();
          _this.currentBomb = _this.currentBomb - 1 < 0 ? 0 : _this.currentBomb - 1;
        }, bomb.duration);

        this.currentBomb++;
        world.add(bomb);
        scratch.done();
      }
    },

    jump: function () {
      if (this.chargeJump == -1 && this.currentJump < this.nbJumps) {
        var power = 1 + (new Date().getTime() - this.chargeJump) / 4000;
        this.chargeJump = 1;

        this.currentJump++;
        this.state.vel.y = - this.jumpSkill;
        this.state.angular.vel = (Math.random() < 0.5 ? -1 : 1) * 0.008;
      }   
    },

    releaseJump: function () {
      this.chargeJump = -1;
    },

    resetJump: function () {
      this.currentJump = 0;
    },

    openBox: function (box) {
      console.log('whooohooo, a box !')
      box.explode();
      this.animateGetItem();
    },

    updateTeam: function (team) {
      this.team = team;
      this._world.emit('updateGUI', {
        type: 'team',
        target: this
      });
    },

    updateMass: function (mass) {
      this.mass = mass;
      this.recalc();
      this._world.emit('updateGUI', {
        type: 'mass',
        target: this
      });
    },

    updateLife: function (life) {
      this.life = life;
      this._world.emit('updateGUI', {
        type: 'life',
        target: this
      });
    },

    reset: function (isNewGame) {
      if (isNewGame) {
        this.updateLife(START_LIFE);
        this.hidden = false;
      } else {
        this.updateLife(this.life - 1);
      }
      this.updateMass(INITIAL_MASS);
      this.currentJump = 0;
      this.currentBomb = 0;
      if (this.life > 0) {
        var startPosition = getStartPosition(this.viewport);
        this.state.pos.set(startPosition.x, startPosition.y);
      }
      this.state.acc.set(0, 0);
      this.state.vel.set(0, 0);
      this.state.angular.pos = 0;
      this.state.angular.vel = 0;
      this.state.angular.acc = 0;
    },

    animateRepop: function () {
      var anim = PIXI.Sprite.fromImage("images/" + this.character + ".png");
      anim.alpha = 0.4;
      anim.anchor = {
        x: 0.5,
        y: 0.5
      };
      anim.x = this.state.pos.x;
      anim.y = this.state.pos.y;
      var world = this._world;
      world._renderer.stage.addChild(anim);
      
      var tween = new TWEEN.Tween( { x: 0, y: 0 } )
        .to( { x: 3, y: 3 }, 500)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(function () {
            anim.scale.x = this.x;
            anim.scale.y = this.y;
        })
        .onComplete(function () {
          world.emit('removeBody', anim);
        })
        .start();
    },

    animateGetItem: function () {
      var anim = PIXI.Sprite.fromImage("images/" + this.character + ".png");
      anim.alpha = 0.4;
      anim.anchor = {
        x: 0.5,
        y: 0.5
      };
      anim.x = this.state.pos.x;
      anim.y = this.state.pos.y;
      var world = this._world;
      world._renderer.stage.addChild(anim);
      
      var tween = new TWEEN.Tween( { x: 0, y: 0 } )
        .to( { x: 2, y: 2 }, 500)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(function () {
            anim.scale.x = this.x;
            anim.scale.y = this.y;
        })
        .onComplete(function () {
          world.emit('removeBody', anim);
        })
        .start();
    },

    die: function () {
      if (!this.hidden) {
        console.log('Aaaaargh !');
        this.hidden = true;
        this.reset(false);
        if (this.life > 0) {
          var _this = this;
          setTimeout(function () {
            _this.animateRepop();
            _this.hidden = false;  
          }, 1000);
        }
        this._world.emit('death');
      }
    },

    setEnabled: function(enabled) {
      this.enabled = enabled;
    },
  };

});


/**
* BEHAVIOUR
*/
Physics.behavior('player-behavior', function (parent) {

  return {

    init: function (options) {
      var self = this;
      parent.init.call(this, options);
      self.player = options.player;
    },

    connect: function (world) {
      world.on('collisions:detected', this.checkPlayerCollision, this);
    },

    disconnect: function (world) {
      world.off('collisions:detected', this.checkPlayerCollision);
    },

    // check to see if the player has collided
    checkPlayerCollision: function (data) {
      var self = this
      ,collisions = data.collisions
      ,col
      ,player = this.player
      ,element
      ;

      for (var i = 0, l = collisions.length; i < l; ++i) {
        col = collisions[i];
        if (col.bodyA === player || col.bodyB === player) {
          element = col.bodyA != player ? col.bodyA : col.bodyB;
          if (element.gameType === 'box') {
            // collision with a box
            if (Math.abs(col.norm.y) > 0.3 && Math.abs(col.norm.x) < 0.3) {
              player.openBox(element);
            }
          } else if (element.gameType == 'player' || element.gameType == 'decor') {
            // reset jump when on a platform
            if (Math.abs(col.norm.y) > 0.3 && element.state.pos.y > player.state.pos.y) {
              player.resetJump();
              player.state.angular.acc = 0;
              player.state.angular.vel = 0;
              player.state.angular.pos = 0;
            }
          } else if (element.gameType == 'explosion') {
            // take damage
            player.updateMass(Math.max(0.001, player.mass / element.power));
            player.setEnabled(false);
            setTimeout(function () {
              player.setEnabled(true);
            }, 800);
          }
        }
      }
    },
  };

});
