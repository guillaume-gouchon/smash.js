
/**
* BODY
*/
Physics.body('player', 'rectangle', function (parent) {

  var START_LIFE = 3;
  var DEFAULT_NAMES = ['Colonel Heinz', 'Juice Master', 'Lord Bobby', 'Lemon Alisa',
            'The Red Baron', 'Tom Boy', 'Tommy Toe', 'Lee Mon', 'Sigmund Fruit', 'Al Pacho', 
            'Mister Bean', 'Ban Anna', 'General Grape', 'Smoothie', 'Optimus Lime'];

  function getRandomName() {
    return DEFAULT_NAMES[parseInt(Math.random() * DEFAULT_NAMES.length)];
  }

  function getRandomCharacter() {
    return Game.CHARACTERS[parseInt(Math.random() * Game.CHARACTERS.length)];
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
        cof: 1.0,
        height: 30,
        width: 30,
        mass: 1.0,
        x: startPosition.x,
        y: startPosition.y
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.name = getRandomName();
      this.character = getRandomCharacter();
      this.commands = new Controller(this.id).toJSON();
      this.enabled = true;
      this.life = START_LIFE;
      this.damage = 0;

      this.resetCaracteristics();
      
      this.view = renderer.createDisplay('movieclip', {
        frames: ['images/' + this.character + '.png', 'images/' + this.character + '_2.png'],
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
      this.view.animationSpeed = 0.1;
      this.view.play();

      this.view.scale.x = -1;

      this.movingLeft = false;
      this.movingRight = false;
    },

    resetCaracteristics: function () {
      this.currentJump = 0;
      this.currentBomb = 0;
      this.orientation = 1;
      this.speed = 0.2;
      this.nbJumps = 2;
      this.jumpSkill = 0.25;
      this.nbBombs = 1;
      this.chargeAttack = -1;
      this.chargeJump = -1;
      if (this.buff) {
        this.buff.destroy();
        this.buff = null;
      }
      if (this.weapon) {
        this.weapon.unequip();
      }
    },

    moveLeft: function () {
      this.state.vel.x = -this.speed;
      this.orientation = -1;
      this.view.scale.x = 1;
      this.movingLeft = true;
      this.movingRight = false;
    },

    moveRight: function () {
      this.state.vel.x = this.speed;
      this.orientation = 1;
      this.view.scale.x = -1;
      this.movingLeft = false;
      this.movingRight = true;
    },

    stop: function () {
      if (this.movingLeft || this.movingRight) {
        this.state.vel.x = 0;
        this.movingLeft = false;
        this.movingRight = false;
      }
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

        if (this.weapon) {
          this.weapon.attack(power);
        }
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
      if (box.isTrap) {
        box.explode();
      } else {
        box.open();
        this.receiveItem();
      }
    },

    updateTeam: function (team) {
      this.team = team;
      this._world.emit('updateGUI', {
        type: 'team',
        target: this
      });
    },

    updateDamage: function (damage) {
      this.damage = damage;
      this._world.emit('updateGUI', {
        type: 'damage',
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
      this.updateDamage(0);
      this.resetCaracteristics();
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

    receiveItem: function () {
      var item = Item.pickRandomItem();
      switch (item.type) {
        case Item.Types.WEAPON:
          item.equip(this);
          break;
        case Item.Types.BUFF:
          item.applyBuff(this);
          break;
      }
      this.animateReceivedItem(item);
      // TODO update GUI
    },

    takeDamage: function (norm, power, stun) {
      var _this = this;
      setTimeout(function () {
        _this.setEnabled(true);
      }, stun);
      this.updateDamage(this.damage + power);
      var vector = new Physics.vector(norm.x * power * 0.0004 * (1 + this.damage / 100), (norm.y == 0 ? -0.4 : norm.y) * power * 0.0004 * (1 + this.damage / 100));
      this.accelerate(vector);
      this.setEnabled(false);
    },

    animateReceivedItem: function (item) {
      var anim = PIXI.Sprite.fromImage("images/items/" + item.image);
      anim.alpha = 0.8;
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
        this.hidden = true;
        this.setEnabled(false);
        this.reset(false);
        if (this.life > 0) {
          var _this = this;
          setTimeout(function () {
            _this.animateRepop();
            _this.setEnabled(true);
            _this.hidden = false;  
          }, 1000);
        }
        this._world.emit('death');
      }
    },

    setEnabled: function(enabled) {
      this.enabled = enabled;
      if (!enabled) {
        if (this.injured == null) {
          var _this = this;
          this.injured = new TWEEN.Tween( { x: 0.5 }, 150)
          .to( { x: 0.8 })
          .delay(0)
          .yoyo( true )
          .repeat( Infinity )
          .onUpdate(function () {
              _this.view.scale.x = this.x;
              _this.view.scale.y = this.x;
          });
          this.injured.start();
        }
      } else {
        if (this.injured != null) {
          this.injured.stop();
          this.injured = null;
        }
        this.view.scale.x = -this.orientation;
        this.view.scale.y = 1;
      }
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
          if (player == col.bodyA) {
            col.norm.x *= -1;
            col.norm.y *= -1;
          }
          if (element.gameType === 'box') {
            // collision with a box
            if (Math.abs(col.norm.y) > 0.3 && Math.abs(col.norm.x) < 0.3) {
              player.openBox(element);
            }
          } else if (element.gameType == 'player' || element.gameType == 'decor') {
            // reset jump when on a platform
            if (player.enabled && Math.abs(col.norm.y) > 0.3 && element.state.pos.y > player.state.pos.y) {
              player.resetJump();
              player.state.angular.acc = 0;
              player.state.angular.vel = 0;
              player.state.angular.pos = 0;
            }
          } else if (element.gameType == 'damage') {
            if (element.player != player) { // avoid contact weapon to damage their bearer
              player.takeDamage(col.norm, element.power, element.stun);
            }
          } else if (element.gameType == 'explosive') {
            player.takeDamage(col.norm, element.power, element.stun);
            element.explode();
          } else if (element.gameType == 'bolter') {
            player.takeDamage(col.norm, element.power, element.stun);
            element.explode();
          }
        } else if (player.buff != null && col.bodyA === player.buff || col.bodyB === player.buff) {// shield
          element = col.bodyA != player.buff ? col.bodyA : col.bodyB;
          if (element.gameType == 'damage') {
            player.buff.takeDamage(element.power);
          } else if (element.gameType == 'explosive') {
            player.buff.takeDamage(element.power);
            element.explode();
          } else if (element.gameType == 'bolter') {
            player.buff.takeDamage(element.power);
            element.explode();
          }
        } else if (col.bodyA.gameType === 'bolter' || col.bodyB.gameType === 'bolter') {
          element = col.bodyA.gameType === 'bolter' ? col.bodyA : col.bodyB;
          element.explode();
        }
      }
    },
  };

});
