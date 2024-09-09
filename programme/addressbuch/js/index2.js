/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    state : {
      todoList : [],
      selectedTodo : "",
      storageKey : "todo-app-lp.de-arek"
    },

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        $("#addTodo").click(this.addTodo.bind(this));

        $("#deleteTodo").click(this.deleteTodo.bind(this));

        $("#checkTodo").click(this.checkTodo.bind(this));
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      app.loadTodoList();
      app.showTodoList();
    },

    showTodoList: function () {
      //remove all items from div
      $("#todo-list").empty();
      //add item foreach todo-item...
      for (var i = 0; i < app.state.todoList.length; i++) {
       $("#todo-list").append(app.createTodoElement(app.state.todoList[i]));
      }

      //WICHTIG: Click erst nach Erstellung der Elemente registrieren!
      $(".todoElement").click(function(event) {
       app.state.selectedTodo = event.target.id;
     });

     app.saveTodoList();
    },

    createTodoElement: function (todo) {
     var todoElement = document.createElement("button");
     todoElement.innerHTML = todo.text;
     todoElement.id = todo.id;
     todoElement.className = "todoElement list-group-item";
     if (todo.done == true) {
       todoElement.style.textDecoration = "line-through";
     }
     return todoElement;
    },

    addTodo: function() {
      var newTodoText = $("#newTodoText").val();
      var newId = app.getNextId();
      var newTodo = { text : newTodoText, done : false, id:newId };

      app.state.todoList.push(newTodo);

      app.showTodoList();
      $("#newTodoText").val("");
    },

    getNextId: function() {
     var nextId = app.state.todoList.length;
     var tryId = "todo-" + nextId;

     var idExists = false;
     var foundNext = false;

     while(foundNext == false) { //solange wir keine neue id haben, weiter probieren
       //jedes element prüfen, ob id vorhanden
       for (var i = 0; i < app.state.todoList.length; i++) {
         var todoItem = app.state.todoList[i];
         if (todoItem.id == tryId) {
           idExists = true;
           break;
         }
       }

       //id existiert?
       if (idExists) {
         nextId++;
         tryId = "todo-" + nextId;
         idExists = false;
       } else {
         foundNext = true;
         return tryId;
       }
     }
    },

    deleteTodo: function() {
      if (app.state.selectedTodo == "") {
       return;
      }

      var itemForDelete = app.getTodoItemIndex(app.state.selectedTodo);
      //entferne das element an selektierten index
      app.state.todoList.splice(itemForDelete, 1);

      app.showTodoList();
    },

    getTodoItemIndex: function(selectedId) {
     //hole index für todo item id
     var itemIndex = null;
     for (var i = 0; i < app.state.todoList.length; i++) {
       var todoItem = app.state.todoList[i];
       if (todoItem.id == selectedId) {
         itemIndex = i; //index merken
         break;
       }
     }
     return itemIndex;
   },

   checkTodo: function() {
    if (app.state.selectedTodo == "") {
      return;
    }

    var itemIndex = app.getTodoItemIndex(app.state.selectedTodo);
    var itemForCheck = app.getTodoItem(app.state.selectedTodo);

    //Wir kehren das bool-Flag mit dem Nicht-Operator einfach um.
    itemForCheck.done = !itemForCheck.done;
    app.state.todoList[itemIndex] = itemForCheck;

    app.showTodoList();
   },

   getTodoItem: function(selectedId) {
    //hole todo item für id
    for (var i = 0; i < app.state.todoList.length; i++) {
      var todoItem = app.state.todoList[i];
      if (todoItem.id == selectedId) {
        return todoItem;
      }
    }
    return null;
  },

  saveTodoList: function() {
   var todoListJson = JSON.stringify(app.state.todoList);
   localStorage.setItem(app.state.storageKey, todoListJson);
  },

  loadTodoList: function() {
   var todoListJson = localStorage.getItem(app.state.storageKey);
   if (todoListJson != null) {
    app.state.todoList = JSON.parse(todoListJson);
   }
  }
};

app.initialize();