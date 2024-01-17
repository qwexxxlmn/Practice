window.onload = function() { // Функция, выполняющаяся после полной загрузки страницы
  buildGridOverlay();   // Создание сетки (игрового поля) с оверлеем
  cellCreator(2, 0);   // Создание двух начальных ячеек с числами 2
  directions();   // Установка обработчиков событий для определения направлений
  score(0);   // Установка начального счета (в данном случае 0)
};


/* Создание поля */
function buildGridOverlay() {
  var game = document.getElementsByClassName('game');  
  var grid = document.getElementsByClassName('grid');
  var size = 4;
  var table = document.createElement('DIV');

  table.className += 'grid';
  table.id = ' ';
  table.dataset.value = 0;
  
  for (var i = 0; i < size; i++) {
    var tr = document.createElement('DIV');
    table.appendChild(tr);
    tr.id = 'row_' + (i+1);
    tr.className += 'grid_row';
    
    for (var j = 0; j < size; j++) {
      var td = document.createElement('DIV');
      td.id = '' +(i+1) +(j+1); //ID x,y
      td.className += 'grid_cell';
      tr.appendChild(td);
    }
  document.body.appendChild(table);
  }
  
  return table;
}



/*Создание случайных плиток*/
function cellCreator(c, timeOut) {
  /* делать 2 раза для 2 новых плиток */
  for (var i = 0; i < c; i++) {
    
    var count = 0;
    /* искать пустую ячейку для создания плитки */
    
    for (var value = 1; value < 2; value++) {
      var randomX = Math.floor((Math.random()*4)+1);
      var randomY = Math.floor((Math.random()*4)+1);
      var checker = document.getElementById('' +randomX +randomY);
      if (checker.innerHTML != '') {
        value = 0;
      } 
    }
    
    var randomValue = Math.floor((Math.random()*4) +1); //создает значение 1, 2, 3 или 4
    if (randomValue == 3) {randomValue=4};              //3 --> 4
    if (randomValue == 1) {randomValue=2};              //1 --> 2
    var position = document.getElementById(''+randomX +randomY);
    var tile = document.createElement('DIV');           //создает div в x, y
    position.appendChild(tile);                         //плитка становится дочерней ячейкой сетки
    tile.innerHTML = ''+randomValue;                    //плитка берёт значение 2 или 4
    
    colorSet(randomValue, tile);
    tile.data = ''+randomValue;
    tile.id = 'tile_'+randomX +randomY;
    position.className += ' active';
    var tileValue = tile.dataset.value;
    tile.dataset.value = ''+randomValue;
    
    console.info(''+timeOut);
    if (timeOut == 0) {
      tile.className = 'tile '+randomValue;
    } else { setTimeout(function() {
        tile.className = 'tile '+randomValue;
      }, 10); }
    
  }

}

/* Перемещение плиток */
document.onkeydown = directions;

function directions(e) {
  e = e || window.event;
  var d = 0;
// ----- Стрелка вверх ----- //
    if (e.keyCode == '38') {      
      var count = 2;  
      
      for (var x = 2; x > 1; x--) {
        for (var y = 1; y < 5; y++) {
          moveTilesMain(x, y, -1, 0, 1, 0);
          console.info(''+x +y);
        }
        if (x == 2) {
          x += count;
          count++;
        }
        if (count > 4) { break; }
      }
      cellReset();
    }   
      
// ----- Стрелка вниз ----- //
    else if (e.keyCode == '40') { // down
      var count = -2;  
      var test  = 1;
      for (var x = 3; x < 4; x++) {
        for (var y = 1; y < 5; y++) {
          moveTilesMain(x, y, 1, 0, 4, 0);
        }
        if (x == 3) {
          x += count;
          count--;
        }
        if (count < -4) { break; }
      }
      cellReset();
    }
      
// ----- Стрелка влево ----- //      
    
    else if (e.keyCode == '37') { // left
      
      
      var count = 2;  
      var test  = 1;
      for (var x = 2; x > 1; x--) {
        for (var y = 1; y < 5; y++) {
          moveTilesMain(y, x, 0, -1, 0, 1);
        }
        if (x == 2) {
          x += count;
          count++;
        }
        if (count > 4) { break; }
      }
      cellReset();
    }
  
// ----- Стрелка вправо ----- //
    else if (e.keyCode == '39') { // right
      
      var count = -2;  
      var noCell = 0;
      var c = 1;
      var d = 0;
      
      for (var x = 3; x < 4; x++) {
        for (var y = 1; y < 5; y++) {
          moveTilesMain(y, x, 0, 1, 0, 4, c, d);
        }
        if (x == 3) {
          x += count;
          count--;
        }
        if (count < -4) { break; }
      }
      cellReset();
    }

}

//--------------------------------------------------------

// Функция для перемещения и объединения плиток в игровом поле
// x, y - координаты текущей плитки
// X, Y - направление перемещения (1, 0 - вправо, -1, 0 - влево, 0, 1 - вниз, 0, -1 - вверх)
// xBorder, yBorder - границы игрового поля

function moveTilesMain(x, y, X, Y, xBorder, yBorder, c, d) {      
   
  // Получаем текущую плитку и клетку на игровом поле
  var tile     = document.getElementById('tile_'+x +y);
  var checker  = document.getElementById(''+x +y);
  
  // Вычисляем координаты окружающей плитки
  var xAround  = x+X;
  var yAround  = y+Y;
  

  // Проверяем, находится ли окружающая клетка в пределах игрового поля
  // и имеет ли она класс 'active'
  if (xAround > 0 && xAround < 5 && yAround > 0 && yAround < 5 && checker.className == 'grid_cell active') {
    // Получаем окружающую клетку
    var around = document.getElementById(''+xAround +yAround);
    
    //________
    
    // Если окружающая клетка активна  
    if (around.className == 'grid_cell active') {
      // Получаем окружающую плитку
      var aroundTile = document.getElementById('tile_'+xAround +yAround);
      // Если значение текущей плитки совпадает с значением окружающей
      if (aroundTile.innerHTML == tile.innerHTML) {
        // Удваиваем значение окружающей плитки и обновляем стили
        var value = tile.dataset.value*2;
        aroundTile.dataset.value = ''+value;
        aroundTile.className = 'tile '+value;
        aroundTile.innerHTML = ''+value;
        colorSet(value, aroundTile);
        // Удаляем текущую плитку и обновляем стили клеток
        checker.removeChild(tile);
        checker.className = 'grid_cell';
        around.className  = 'grid_cell active merged';
        // Обновляем идентификатор и стили игрового поля
        document.getElementsByClassName('grid').id = 'moved';
        document.getElementsByClassName('grid').className = 'grid '+value;
        // Обновляем счет и стили
        var grid = document.getElementById(' ');
        var scoreValue = parseInt(grid.dataset.value);
        var newScore = value + scoreValue;
        
        grid.dataset.value = newScore;
        var score = document.getElementById('value');
        
        score.innerHTML = ''+newScore;
      } 
    } else if (around.className == 'grid_cell'){
      // Если окружающая клетка не объединяется, перемещаем текущую плитку в эту клетку
      around.appendChild(tile);
      around.className = 'grid_cell active';
      tile.id = 'tile_'+xAround +yAround;
      checker.className = 'grid_cell';
      document.getElementsByClassName('grid').id = 'moved';
    }
    
    
    //________
  }  
}


//-------------------------------------------------------


// Функция для сброса состояния плиток на игровом поле
function cellReset() {
  var count = 0; // Счетчик непустых плиток на игровом поле
  var a = document.getElementsByClassName('grid').id; // Получаем идентификатор игрового поля
  console.log('' + a); // Выводим идентификатор в консоль для отладки
  
  // Итерируем по всем клеткам на игровом поле
  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 5; y++) {
      
      var resetter = document.getElementById('' + x + y); // Получаем текущую клетку
      if (resetter.innerHTML != '') {
        count++; // Увеличиваем счетчик, если клетка не пуста
      }
      
      if (resetter.innerHTML == '') {
        resetter.className = 'grid_cell'; // Сбрасываем стиль клетки, если она пуста
      } 
      
      if (resetter.className == 'grid_cell active merged') {
        resetter.className = 'grid_cell active' // Сбрасываем стиль объединенной клетки
      }
    }
  }
  
  // Проверяем условие поражения (все клетки заняты)
  if (count == 16) {
    alert("Увы, вы проиграли!"); // Оповещение при проигрыше
    document.getElementById('status').className = 'lose'; // Устанавливаем стиль для статуса проигрыша
  } else if (document.getElementsByClassName('grid').id == 'moved') {
    cellCreator(1, 1); // Если были перемещения, создаем новую клетку
  }
  document.getElementsByClassName('grid').id = ' '; // Сбрасываем идентификатор игрового поля
}

// Функция для обновления отображения счета в игре
function score() {
  // Получаем элемент игрового поля
  var grid = document.getElementById(' ');
  // Получаем значение счета из данных элемента игрового поля
  var value = grid.dataset.value;
  // Обновляем отображение счета на странице
  document.getElementById('value').innerHTML = ''+value;
  
}


// Стили плиток
function colorSet(value, tile) {
  switch(value) {
    case 2:    tile.style.background = '#fcd4fc'; tile.style.color = 'black'; break;
    case 4:    tile.style.background = '#ecefc6'; tile.style.color = 'black'; break;
    case 8:    tile.style.background = '#ffb296'; tile.style.color = 'black'; break;
    case 16:   tile.style.background = '#ff7373'; tile.style.color = 'black'; break;
    case 32:   tile.style.background = '#f6546a'; tile.style.color = 'white'; break;
    case 64:   tile.style.background = '#8b0000'; tile.style.color = 'white'; break;
    case 128:  tile.style.background = '#794044'; tile.style.color = 'white'; 
               tile.style.fontSize = '50px'; break;
    case 256:  tile.style.background = '#31698a'; tile.style.color = 'white';
               tile.style.fontSize = '50px'; break;
    case 512:  tile.style.background = '#297A76'; tile.style.color = 'white';
               tile.style.fontSize = '50px'; break;
    case 1024: tile.style.background = '#2D8A68'; tile.style.color = 'white';
               tile.style.fontSize = '40px'; break;
    case 2048: tile.style.background = '#1C9F4E'; tile.style.color = 'white'; 
               tile.style.fontSize = '40px'; 
               document.getElementById('status').className = 'won'; break;
    case 4096: tile.style.background = '#468499'; tile.style.color = 'white'; 
               tile.style.fontSize = '40px'; break;
    case 8192: tile.style.background = '#0E2F44'; tile.style.color = 'white';
               tile.style.fontSize = '40px'; break;
  }
                    
}

// Функция для отображения информации с задержкой
function info() {
  // Устанавливаем таймаут для выполнения кода с задержкой 10 миллисекунд
  setTimeout(function() {
    document.getElementById('description').classList.toggle('show');
  }, 10);  
  
}

// Функция для сброса состояния игровых плиток
function reset() {
  // Итерируем по всем плиткам на игровом поле
  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 5; y++) {
      // Получаем текущую плитку
      var resetter = document.getElementById(''+x +y);
      // Проверяем, имеет ли плитка класс 'grid_cell active'
      if (resetter.className == 'grid_cell active') {
        // Если да, получаем плитку внутри поля и удаляем ее
        var tile = document.getElementById('tile_'+x +y);
        resetter.removeChild(tile);
      }
    }
  }

  // Сброс состояния игры
  // Устанавливаем стиль элемента с идентификатором 'status' в пустую строку
  document.getElementById('status').className = '';
  // Сбрасываем значение счета в данных элемента с идентификатором ' '
  document.getElementById(' ').dataset.value = 0;
  // Обновляем отображение счета
  score();
  // Сбрасываем состояние клеток на игровом поле
  cellReset();
  // Создаем две новые клетки на игровом поле
  cellCreator(2, 0);
}
