
var STATE_GAME_NONE          = 0;//Estado de Juego Ninguno
var STATE_GAME_LOADING       = 1;//Estado de juego Cargando 
var STATE_GAME_PLAYING       = 2;//Estado de juego Jugar
var STATE_GAME_GAME_OVER     = 3;//Estado de juego Terminado
var STATE_GAME_WIN           = 4;//Estado de juego Hay un Ganador
var STATE_PAUSE              = 5;//Estado de juego Pausa
var STATE_NO_CLICK           = 6;//Estado de juego No Click
var stateGame = STATE_GAME_NONE;
var STATE_TIME_OCCUPIED = 0; //Estado de timer ocupado
var STATE_TIME_AVAILABLE = 1;//Estado timer Disponible
var stateTimeCards = STATE_TIME_AVAILABLE;
var Player=1;
var totalTime = 15;
var random = [];
var arraycards = [];
var cardsTargets= [];
var cad="";
var count =0;
var newplayer = []; 
//Desde aqui comienzan las cartas
var Validation= [];//Saber cuantas cartas se an seleccionado y se comparan para saber si es par 
var identifier = [];//Saber cuales son los id de las cartas seleccionadas
var Position= [];
var cont=0;
var cardsSeleccion=[];//Saber cuales son los pares que ya se seleccionaròn 

var CarsCreate={
        "cards":[
            {'Id':"0",'sprite':"r1","x0":125,"y0":70,'textura':""},
            {'Id':"1",'sprite':"r1","x0":300,"y0":70,'textura':""},
            {'Id':"2",'sprite':"r2","x0":475,"y0":70,'textura':""},
            {'Id':"3",'sprite':"r2","x0":650,"y0":70,'textura':""},
            {'Id':"4",'sprite':"r3","x0":125,"y0":245,'textura':""},
            {'Id':"5",'sprite':"r3","x0":300,"y0":245,'textura':""},
            {'Id':"6",'sprite':"r4","x0":475,"y0":245,'textura':""},
            {'Id':"7",'sprite':"r4","x0":650,"y0":245,'textura':""},
            {'Id':"8",'sprite':"r5","x0":125,"y0":420,'textura':""},
            {'Id':"9",'sprite':"r5","x0":300,"y0":420,'textura':""},
            {'Id':"10",'sprite':"r6","x0":475,"y0":420,'textura':""},
            {'Id':"11",'sprite':"r6","x0":650,"y0":420,'textura':""},
        ]
    } 

GamePlayManager = {
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    preload: function() {
        game.load.image('background', 'assets/images/fond.jpg');
        game.load.image('card', 'assets/images/card.jpg');
        game.load.spritesheet('start', 'assets/images/movimiento.png',43,50,9);
        game.load.image('result', 'assets/images/gio.png');
        game.load.image('result1', 'assets/images/gioenojado.png');
        game.load.image('result2', 'assets/images/giofeliz.png');
        game.load.image('result3', 'assets/images/ninja.png');
        game.load.image('result4', 'assets/images/robot.png');
        game.load.image('result5', 'assets/images/Lives.png');
        game.load.spritesheet('smoke', 'assets/images/smoke.png', 125, 125, 20);
        game.load.spritesheet('buttonPlay', 'assets/images/buttonPlay.png', 200, 76, 2);
        //Sounds
        game.load.audio('loopMusic', 'assets/sounds/POL-follow-me-short.wav');
    },
    create: function() {
        game.add.sprite(0, 0, 'background');
        game.input.onDown.add(this.clicked,this);
        //Se manda a llamar el metodo que crea las cartas 
                if(random.length==0){
                 var number
                    number = game.rnd.integerInRange(-5, 6);
                    random.push(number);
                   }        
                for(var j=0;j<12;){
                    var num
                    num = game.rnd.integerInRange(-5, 6);         
                    for(var i=0;i<random.length;i++){
                            if(random[i]==num){
                                RandomValidation=false;
                                i=random.length
                            }else if(random[i]!=num){
                                RandomValidation=true;
                            }
                    }
                    if(RandomValidation==true){
                        random.push(num)
                    }
                    if(random.length==12){
                        j=12
                    }
                }
        //Para las cartas hay que separa los if para que puedan ser diferentes
        for(var k=0;k<random.length;k++){
            if(random[k]==1||random[k]==-1){
               CarsCreate.cards[k].textura="result"
               CarsCreate.cards[k].sprite="result"
               }   
            if(random[k]==2||random[k]==-2){
               CarsCreate.cards[k].textura="result1"
                CarsCreate.cards[k].sprite="result1"
               }  
            if(random[k]==3||random[k]==-3){
               CarsCreate.cards[k].textura="result2"
               CarsCreate.cards[k].sprite="result2"
               }
            if(random[k]==4||random[k]==-4){
               CarsCreate.cards[k].textura="result3"
                CarsCreate.cards[k].sprite="result3"
               } 
            if(random[k]==5||random[k]==-5){
               CarsCreate.cards[k].textura="result4"
               CarsCreate.cards[k].sprite="result4"
               } 
            if(random[k]==6||random[k]==0){
               CarsCreate.cards[k].textura="result5"
               CarsCreate.cards[k].sprite="result5"
               } 
            
            }
            for(var i=0;i<CarsCreate.cards.length;i++){
                cards = game.add.sprite(CarsCreate.cards[i].x0,CarsCreate.cards[i].y0,'card');
                cards.scale.setTo(0.5);
                Target = game.add.sprite(CarsCreate.cards[i].x0,CarsCreate.cards[i].y0,CarsCreate.cards[i].textura);
                Target.scale.setTo(0.3);
                arraycards.push(cards);
                cardsTargets.push(Target);

                //Hace invisible todas las tarjetas
                cardsTargets[i].visible=false;
                arraycards[i].visible=true;
                }   
        
        //Se crea un timer a el juego
        timer = game.time.create(false);
        //Creando el boton play
        this.buttonPlay = game.add.button(game.width/2 , game.height/2, 'buttonPlay', this.startGame, this, 1, 0, 1, 0);
        this.buttonPlay.anchor.setTo(0.5);
        //Musica de Fondo
        //this.loopMusic = game.add.audio('loopMusic');
         var style = {
            font: 'bold 30pt Arial',
            fill: '#FFFFFF',
            align: 'center'
          }
        //Agregando Textos de Jugador y Timer
        this.scoreText = game.add.text(150, 40, 'Player ', style);
        this.scoreText.anchor.setTo(0.5);
        this.scoreTextPlayer = game.add.text(250, 40, Player, style);
        this.scoreTextPlayer.anchor.setTo(0.5);
        this.scoreText1 = game.add.text(750, 40, 'Timer', style);
        this.scoreText1.anchor.setTo(0.5);
        this.timerText = game.add.text(850, 40, totalTime+'', style);
        this.timerText.anchor.setTo(0.5);
        StatusPlayer="Player1";       
    },
     startGame: function(){
         
   
           
     
         stateGame = STATE_GAME_PLAYING;
         this.buttonPlay.visible = false;
          if(stateGame == STATE_GAME_PLAYING){
                this.timer();
               }
         //game.time.events.start(this.timerinitial);
         this.loopMusic.loop = true;
         this.loopMusic.play();
    },
     timer:function(){
        timer=15;     
         this.timerinitial1 = game.time.events.loop(Phaser.Timer.SECOND, function(){
                                timer--;
                                this.timerText.text = timer+'';
                                if(timer==0){
                                     //Si se acaba el tiempo se suma el jugador 
                                    cad+=" Player "
                                    cad+=Player;
                                    cad+="= ";
                                    cad+=count;
                                    Player++;
                                    count=0;
                                    this.scoreTextPlayer.text = Player;
                                    game.time.events.remove(this.timerinitial1);
                                    //Juador numero 2
                                     if(Player!=3){
                                         //Se olcultan todas las cartas
                                         for(i=0;i<cardsTargets.length;i++){
                                             cardsTargets[i].visible=false;
                                         }
                                        stateGame =  STATE_NO_CLICK;
                                         //Elimina todo lo que se recaudo
                                         Validation=[];
                                         identifier=[];
                                         Position=[];
                                         cont=0;
                                         cardsSeleccion=[];
                                         cardsTargets=[];
                                         random=[];
                                         //manda a llamar el metodo para volver a crear el areglo aleatorio
                                         this.createCars();
                                        totalTime=15;

                                                    this.timerText.text = totalTime+'';
                                                    game.time.events.remove(this.timerinitial1);
                                                    this.showFinalMessage('Siguiente Turno');                          
                                       }
                                     if(Player==3){
                                        //Si player es igual a 3 entonces se acaba el juego 
                                        stateGame =  STATE_GAME_GAME_OVER;
                                        //Se manda mensaje de Puntaje
                                        this.showFinalMessage(cad);
                                        var timerPA=3;
                                        this.timerPlayAgain = game.time.events.loop(Phaser.Timer.SECOND, function(){
                                            timerPA--;
                                            if(timerPA==0){
                                                //Se crea un timer para quital el puntaje y que vuelva a comenzar 
                                                this.textFieldFinalMsg.visible=false;
                                                //Se manda a llamar el metodo Game Over 
                                                this.gameOver();
                                                game.time.events.remove(this.timerPlayAgain);
                                                
                                            }
                                        },this);
                                       }
                                   }
                            },this);
    },
    createCars: function(){  
            if(random.length==0){
                 var number
                    number = game.rnd.integerInRange(-5, 6);
                    random.push(number);
                   }        
        for(var j=0;j<12;){
             var num
             num = game.rnd.integerInRange(-5, 6);         
                for(var i=0;i<random.length;i++){

                            if(random[i]==num){
                                RandomValidation=false;
                                i=random.length
                            }else if(random[i]!=num){
                                RandomValidation=true;
                            }
                }
            if(RandomValidation==true){
               random.push(num)
               }
              if(random.length==12){
                    j=12
                }
        }
        for(var k=0;k<random.length;k++){
            if(random[k]==1||random[k]==-1){
               CarsCreate.cards[k].textura="result"
                CarsCreate.cards[k].sprite="result"
               }   
            if(random[k]==2||random[k]==-2){
               CarsCreate.cards[k].textura="result1"
                 CarsCreate.cards[k].sprite="result1"
               }  
            if(random[k]==3||random[k]==-3){
               CarsCreate.cards[k].textura="result2"
                 CarsCreate.cards[k].sprite="result2"
               }
            if(random[k]==4||random[k]==-4){
               CarsCreate.cards[k].textura="result3"
                 CarsCreate.cards[k].sprite="result3"
               } 
            if(random[k]==5||random[k]==-5){
               CarsCreate.cards[k].textura="result4"
                 CarsCreate.cards[k].sprite="result4"
               } 
            if(random[k]==6||random[k]==0){
               CarsCreate.cards[k].textura="result5"
                 CarsCreate.cards[k].sprite="result5"
               } 
            
        }
    for(var i=0;i<CarsCreate.cards.length;i++){
        Target = game.add.sprite(CarsCreate.cards[i].x0,CarsCreate.cards[i].y0,CarsCreate.cards[i].textura);

        Target.scale.setTo(0.3);
        arraycards.push(cards);
        cardsTargets.push(Target);
        //Hace invisible todas las tarjetas
        cardsTargets[i].visible=false;
        arraycards[i].visible=true;
        
        }    
            },
     showFinalMessage:function(msg){
        stateGame =  STATE_PAUSE;
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000000';
        bgAlpha.ctx.fillRect(0,0,game.width, game.height);
        bg = game.add.sprite(0,0,bgAlpha); 
        bg.alpha = 0.5;
         var style = {
            font: 'bold 60pt Arial',
            fill: '#FFFFFF',
            align: 'center'
          }
        this.textFieldFinalMsg = game.add.text(game.width/2, game.height/2, msg, style);
        this.textFieldFinalMsg.anchor.setTo(0.5);
         var timerUno=3;
         StatusPlayer="Player2";
        this.timerMessage = game.time.events.loop(Phaser.Timer.SECOND, function(){
                                timerUno--;
                                if(timerUno==0){
                                    this.textFieldFinalMsg.visible=false;
                                    bg.visible=false;
                                     if(stateGame == STATE_GAME_PLAYING){
                                         this.timer();
                                     }
                                         
                                       // stateGame =  STATE_GAME_GAME_OVER;
                                    this.timer();
                                    game.time.events.remove(this.timerMessage);
                                    stateGame = STATE_GAME_PLAYING;
                                   }
                            },this);
    },
   clicked:function(){
         switch(stateGame){
            case STATE_GAME_PLAYING:
                  for(var i=0;i<CarsCreate.cards.length;i++){      
                      var dimensionx=CarsCreate.cards[i].x0 +145;
                      var dimensiony=CarsCreate.cards[i].y0 +145;
                      if(pointerX>CarsCreate.cards[i].x0 && pointerX< dimensionx){
                          if(pointery>CarsCreate.cards[i].y0 && pointery< dimensiony){
                              var bool=false;
                              if(cardsSeleccion.length!=0){
                                  for(var j=0;j<cardsSeleccion.length;j++){
                                      if(CarsCreate.cards[i].Id==cardsSeleccion[j]){
                                          bool=true;
                                      }
                                  }
                                  if(bool==false){
                                      if(identifier.length==1){
                                          if(identifier[0]!=CarsCreate.cards[i].Id){
                                              identifier.push(CarsCreate.cards[i].Id);
                                              Validation.push(CarsCreate.cards[i].sprite);  
                                              Position.push(i);
                                              cont++;
                                              arraycards[i].visible=false;
                                              cardsTargets[i].visible=true;
                                          }
                                      }
                                      if(identifier.length==0){
                                          identifier.push(CarsCreate.cards[i].Id);
                                          Validation.push(CarsCreate.cards[i].sprite);  
                                          Position.push(i);
                                          cont++;
                                          arraycards[i].visible=false;
                                          cardsTargets[i].visible=true;
                                      }
                                  }
                              }
                              if(cardsSeleccion.length==0){
                                  if(identifier.length==1){
                                      if(identifier[0]!=CarsCreate.cards[i].Id){
                                          identifier.push(CarsCreate.cards[i].Id);
                                          Validation.push(CarsCreate.cards[i].sprite);  
                                          Position.push(i);
                                          cont++;
                                          arraycards[i].visible=false;
                                          cardsTargets[i].visible=true;
                                      }
                                  }
                                  if(identifier.length==0){
                                      identifier.push(CarsCreate.cards[i].Id);
                                      Validation.push(CarsCreate.cards[i].sprite);  
                                      Position.push(i);
                                      cont++;
                                      arraycards[i].visible=false;
                                      cardsTargets[i].visible=true;
                                  }
                              }
                          }
                      }   
                  }              
            break;
         }
  if(Validation.length==2){
     stateGame =  STATE_NO_CLICK;
     val1=Position[0];
     val2=Position[1];
      //Saber si es Par
         if(Validation[0]==Validation[1]){
             stateTimeCards = STATE_TIME_OCCUPIED;
             cardsSeleccion.push(identifier[0]);
             cardsSeleccion.push(identifier[1]);
             var timer=1;
             newplayer.push(val1); 
             newplayer.push(val2);           
             this.TimerCardsPar = game.time.events.loop(Phaser.Timer.SECOND, function(){
                 
                 timer--;
              if(timer==0){
                 cardsTargets[val1].visible=false;
                 cardsTargets[val2].visible=false;
                    switch(stateGame){
                       case STATE_NO_CLICK:
                            stateGame = STATE_GAME_PLAYING;
                            stateTimeCards = STATE_TIME_AVAILABLE;
                           
                             game.time.events.remove(this.TimerCardsPar);
                            break;
                          }
                       }
                },this);
                count++;
                }
      //Saber si no es Par
                        if(Validation[0]!=Validation[1] ){
                            stateTimeCards = STATE_TIME_OCCUPIED;
                            var timer=1;
                            this.TimerCardsInpar = game.time.events.loop(Phaser.Timer.SECOND, function(){
                                
                                
                                timer--;
                                if(timer==0){
                                   arraycards[val1].visible=true;
                                   arraycards[val2].visible=true;
                                   cardsTargets[val1].visible=false;
                                   cardsTargets[val2].visible=false;
                                    switch(stateGame){
                                          case STATE_NO_CLICK:
                                              stateGame = STATE_GAME_PLAYING;
                                            stateTimeCards = STATE_TIME_AVAILABLE;
                                            game.time.events.remove(this.TimerCardsInpar);

                                        break;
                                      }
                                   }
                            },this);
            }
                  Validation=[];
                  Position=[];
                  identifier=[];
          }
    },
    update: function() {
        pointerX=game.input.x;
        pointery=game.input.y;
         switch(stateGame){
            case STATE_GAME_NONE:
                break;
            case STATE_GAME_LOADING:
                break;
            case STATE_GAME_PLAYING:
                break;
            case STATE_GAME_GAME_OVER:
                break;
            case STATE_GAME_WIN:
                break;
        }
    },
      gameOver:function(){
          //Pasamos el estado de juego a cargando
          stateGame = STATE_GAME_GAME_OVER
          cad="";
           Player=1;
          this.scoreTextPlayer.text = Player;
          timer=15;
          this.timerText.text = timer+'';
          condicion="No Activo"
          game.time.events.remove(this.timerinitial1);
          this.buttonPlay.visible = true;
           //Se olcultan todas las cartas
                                         for(i=0;i<cardsTargets.length;i++){
                                             cardsTargets[i].visible=false;
                                         }
                                        stateGame =  STATE_NO_CLICK;
                                         //Elimina todo lo que se recaudo
                                         Validation=[];
                                         identifier=[];
                                         Position=[];
                                         cont=0;
                                         cardsSeleccion=[];
                                         cardsTargets=[];
                                         random=[];
                                         //manda a llamar el metodo para volver a crear el areglo aleatorio
                                         this.createCars();

          
          
    },
    }

var game = new Phaser.Game(1012, 657, Phaser.AUTO);
    
game.state.add("gameplay", GamePlayManager);
game.state.start("gameplay");