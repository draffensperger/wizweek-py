!function(){"use strict";angular.module("wizweekTemplates",[]),angular.module("wizweekPy",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngMessages","ngAria","ngResource","ui.router","ui.bootstrap","toastr","angular-gapi","angularSpinner","wizweekTemplates"])}(),function(){"use strict";function e(e){var t=this;t.auth=e}e.$inject=["auth"],angular.module("wizweekPy").component("wwWelcome",{controller:e,controllerAs:"welcome",templateUrl:"app/welcome/welcome.html"})}(),function(){"use strict";function e(e,t,o){function n(e){return o.put("settings",e)}function i(t){return s?e.resolve(s):o.get("settings").then(function(e){return s=angular.extend({},t,e.data),a(s.workStartTimes),a(s.workEndTimes),s})}function a(e){for(var t=0;t<e.length;t++)e[t]=new Date(e[t])}var s=null,l={load:i,save:n};return l}e.$inject=["$q","$window","api"],angular.module("wizweekPy").service("settingsStore",e)}(),function(){"use strict";function e(e,t,o,n){function i(){l(),a()}function a(){o.load(d).then(function(e){r.settings=e})}function s(){o.save(r.settings).then(function(){n.success("Settings saved!")})}function l(){e.request({path:"/calendar/v3/users/me/calendarList"}).then(function(e){r.calendars=e.result.items},function(){r.calendars=[],t.debug("Calendar call failed!")})}var r=this;r.calendars=[],r.weekDays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var d={appointmentsCalId:null,tasksCalId:null,workStartTimes:Array(7).fill(new Date(0,0,0,9)),workEndTimes:[new Date(0,0,0,9)].concat(Array(5).fill(new Date(0,0,0,17))).concat([new Date(0,0,0,9)])};r.settings={},r.saveSettings=s,i()}e.$inject=["GApi","$log","settingsStore","toastr"],angular.module("wizweekPy").controller("SettingsController",e)}(),angular.module("wizweekPy").factory("store",["$http","$injector",function(e,t){"use strict";return t.get("localStorage")}]).factory("api",["$resource",function(e){"use strict";var t={todos:[],api:e("/api/todos/:id",null,{update:{method:"PUT"}}),clearCompleted:function(){var e=t.todos.slice(0),o=t.todos.filter(function(e){return!e.completed});return angular.copy(o,t.todos),t.api["delete"](function(){},function(){angular.copy(e,t.todos)})},"delete":function(e){var o=t.todos.slice(0);return t.todos.splice(t.todos.indexOf(e),1),t.api["delete"]({id:e.id},function(){},function(){angular.copy(o,t.todos)})},get:function(){return t.api.query(function(e){angular.copy(e,t.todos)})},insert:function(e){var o=t.todos.slice(0);return t.api.save(e,function(o){e.id=o.id,t.todos.push(e)},function(){angular.copy(o,t.todos)}).$promise},put:function(e){return t.api.update({id:e.id},e).$promise}};return t}]).factory("localStorage",["$q",function(e){"use strict";var t="todos-angularjs",o={todos:[],_getFromLocalStorage:function(){return JSON.parse(localStorage.getItem(t)||"[]")},_saveToLocalStorage:function(e){localStorage.setItem(t,JSON.stringify(e))},clearCompleted:function(){var t=e.defer(),n=o.todos.filter(function(e){return!e.completed});return angular.copy(n,o.todos),o._saveToLocalStorage(o.todos),t.resolve(o.todos),t.promise},"delete":function(t){var n=e.defer();return o.todos.splice(o.todos.indexOf(t),1),o._saveToLocalStorage(o.todos),n.resolve(o.todos),n.promise},get:function(){var t=e.defer();return angular.copy(o._getFromLocalStorage(),o.todos),t.resolve(o.todos),t.promise},insert:function(t){var n=e.defer();return o.todos.push(t),o._saveToLocalStorage(o.todos),n.resolve(o.todos),n.promise},put:function(t,n){var i=e.defer();return o.todos[n]=t,o._saveToLocalStorage(o.todos),i.resolve(o.todos),i.promise}};return o}]),function(){"use strict";function e(e){function t(t){e.localStorage.signInExpiry=t}function o(){e.localStorage.signInExpiry=0}function n(){var t=e.localStorage.signInExpiry;if(t){var o=parseInt(t)-(new Date).getTime();return o>0}return!1}var i={isLikelyActive:n,signedIn:t,signedOut:o};return i}e.$inject=["$window"],angular.module("wizweekPy").service("lastSignIn",e)}(),function(){"use strict";function e(e,t,o,n,i,a){function s(e){c.signingIn=!1,c.signedIn=e.isSignedIn(),c.signedIn?(c.userEmail=e.getBasicProfile().getEmail(),c.userName=e.getBasicProfile().getName(),c.token=e.getAuthResponse().access_token,a.signedIn(e.getAuthResponse().expires_at)):(c.userEmail=null,c.userName=null,c.token=null,a.signedOut()),i.$digest()}function l(){e.checkAuth()}function r(){c.signingIn=!0,e.signIn()}function d(){e.signOut()}e.setConfig({clientId:o,scope:t,currentUserListener:s});var c={checkAuth:l,signIn:r,signOut:d,signedIn:!1,signingIn:!1,userEmail:null,userName:null,token:null};return c}e.$inject=["GAuth","gapiScopes","gapiClientId","$state","$rootScope","lastSignIn"],angular.module("wizweekPy").service("auth",e)}(),function(){"use strict";function e(e,t,o){function n(e){return a("GET",e)}function i(e,t){return a("PUT",e,t)}function a(n,i,a){return o({method:n,url:e+i,data:a,headers:{Authorization:"Bearer "+t.token}})}var s={put:i,get:n,request:a};return s}e.$inject=["apiBaseUrl","auth","$http"],angular.module("wizweekPy").service("api",e)}(),function(){"use strict";function e(e,t,o){function n(e){return o.current.name==e}var i=this;i.auth=e,i.lastSignIn=t,i.isActive=n,i.state=o}e.$inject=["auth","lastSignIn","$state"],angular.module("wizweekPy").component("wwNavbar",{controller:e,controllerAs:"navbar",templateUrl:"app/navbar/navbar.html"})}(),function(){"use strict";function e(){}angular.module("wizweekPy").controller("MainController",e)}(),function(){"use strict";function e(e,t){var o=this;o.auth=e,o.lastSignIn=t}e.$inject=["auth","lastSignIn"],angular.module("wizweekPy").controller("AuthorizedController",e)}(),function(){"use strict";function e(){}angular.module("wizweekPy").component("wwFooter",{controller:e,controllerAs:"footer",templateUrl:"app/footer/footer.html"})}(),angular.module("wizweekPy").directive("todoFocus",["$timeout",function(e){"use strict";return function(t,o,n){t.$watch(n.todoFocus,function(t){t&&e(function(){o[0].focus()},0,!1)})}}]),angular.module("wizweekPy").directive("todoEscape",function(){"use strict";var e=27;return function(t,o,n){o.bind("keydown",function(o){o.keyCode===e&&t.$apply(n.todoEscape)}),t.$on("$destroy",function(){o.unbind("keydown")})}}),angular.module("wizweekPy").controller("TodoCtrl",["$scope","$filter","store",function(e,t,o){"use strict";o.get();var n=e.todos=o.todos,i={title:"",hours:null,value:null,deadline:null,minStart:null};e.deadlinePopupOpen=!1,e.deadlineFocused=function(){e.deadlinePopupOpen=!0},e.minStartPopupOpen=!1,e.minStartFocused=function(){e.minStartPopupOpen=!0},e.newTodo=angular.extend({},i),e.editedTodo=null,e.$watch("todos",function(){e.remainingCount=t("filter")(n,{completed:!1}).length,e.completedCount=n.length-e.remainingCount,e.allChecked=!e.remainingCount},!0),e.$on("$routeChangeSuccess",function(){var t=e.status="";e.statusFilter="active"===t?{completed:!1}:"completed"===t?{completed:!0}:{}}),e.addTodo=function(){var t={title:e.newTodo.title.trim(),hours:e.newTodo.hours,value:e.newTodo.value,deadline:e.newTodo.deadline,minStart:e.newTodo.minStart,completed:!1};t.title&&t.hours&&t.value&&(e.saving=!0,o.insert(t).then(function(){e.newTodo=angular.extend({},i)})["finally"](function(){e.saving=!1}))},e.editTodo=function(t){e.editedTodo=t,e.originalTodo=angular.extend({},t)},e.saveEdits=function(t,n){return"blur"===n&&"submit"===e.saveEvent?void(e.saveEvent=null):(e.saveEvent=n,e.reverted?void(e.reverted=null):(t.title=t.title.trim(),t.title===e.originalTodo.title?void(e.editedTodo=null):void o[t.title?"put":"delete"](t).then(function(){},function(){t.title=e.originalTodo.title})["finally"](function(){e.editedTodo=null})))},e.revertEdits=function(t){n[n.indexOf(t)]=e.originalTodo,e.editedTodo=null,e.originalTodo=null,e.reverted=!0},e.removeTodo=function(e){o["delete"](e)},e.saveTodo=function(e){o.put(e)},e.toggleCompleted=function(e,t){angular.isDefined(t)&&(e.completed=t),o.put(e,n.indexOf(e)).then(function(){},function(){e.completed=!e.completed})},e.clearCompletedTodos=function(){o.clearCompleted()},e.markAll=function(t){n.forEach(function(o){o.completed!==t&&e.toggleCompleted(o,t)})}}]),function(){"use strict";angular.module("angular-gapi",[])}(),function(){"use strict";function e(e,t){function o(e){r=e}function n(){s().then(function(e){e.getAuthInstance().signIn()})}function i(){s().then(function(e){e.getAuthInstance().signOut()})}function a(){s()}function s(){return c?l():l().then(function(e){return e.init({client_id:r.clientId,scope:r.scope}),e.getAuthInstance().currentUser.listen(r.currentUserListener),c=!0,e})}function l(){return d?t.resolve(d):e.get().then(function(e){return d=e.auth2,e.auth2})}var r,d=null,c=!1,u={setConfig:o,checkAuth:a,signIn:n,signOut:i};return u}e.$inject=["GApi","$q"],angular.module("angular-gapi").service("GAuth",e)}(),function(){"use strict";function e(e,t,o,n){function i(e){return a().then(function(t){return t.client.request(e)})}function a(){if(r)return e.when(o.gapi);var t=e.defer();return c.push(t),d||(d=!0,s().then(function(e){r=!0,d=!1,c.forEach(function(t){t.resolve(e)})})),t.promise}function s(){var t=e.defer();return l().then(function(e){e.load("client:auth2",function(){t.resolve(e)})}),t.promise}function l(){var i="https://apis.google.com/js/api.js?onload=_gapiOnLoad",a=e.defer();o._gapiOnLoad=function(){a.resolve(o.gapi)};var s=t[0].createElement("script");return s.onerror=function(e){n(function(){a.reject(e)})},s.src=i,t[0].body.appendChild(s),a.promise}var r=!1,d=!1,c=[];this.get=a,this.request=i}e.$inject=["$q","$document","$window","$timeout"],angular.module("angular-gapi").service("GApi",e)}(),function(){"use strict";function e(e,t){e.checkAuth(),t.get("/")}e.$inject=["auth","api"],angular.module("wizweekPy").run(e)}(),function(){"use strict";function e(e,t){e.state("main",{"abstract":!0,templateUrl:"app/layout/main.html",controller:"MainController",controllerAs:"main"}).state("main.authorized",{"abstract":!0,templateUrl:"app/layout/authorized.html",controller:"AuthorizedController",controllerAs:"authorized"}).state("main.authorized.dashboard",{url:"/",templateUrl:"app/dashboard/dashboard.html",controller:"TodoCtrl",controllerAs:"dash"}).state("main.authorized.settings",{url:"/settings",templateUrl:"app/settings/settings.html",controller:"SettingsController",controllerAs:"$ctrl"}),t.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("wizweekPy").config(e)}(),function(){"use strict";angular.module("wizweekPy").constant("malarkey",malarkey).constant("moment",moment).constant("gapiScopes","https://www.googleapis.com/auth/calendar").constant("gapiClientId","562801966668-qu83ib47l7bqcddpvd7qtkescdohg4e7.apps.googleusercontent.com").constant("apiBaseUrl","https://wizweek-api.herokuapp.com/")}(),function(){"use strict";function e(e,t){e.debugEnabled(!0),t.allowHtml=!0,t.timeOut=1e3,t.positionClass="toast-top-right",t.preventDuplicates=!1,t.progressBar=!1,t.preventOpenDuplicates=!0,t.maxOpened=1}e.$inject=["$logProvider","toastrConfig"],angular.module("wizweekPy").config(e)}(),angular.module("wizweekTemplates").run(["$templateCache",function(e){e.put("app/dashboard/dashboard.html",'<div class=row><div class=col-md-5><h3>Tasks</h3></div></div>Welcome {{dash.auth.userName}}! This page will soon display a list of tasks.<br><br><section id=todoapp><header id=header><div class="row todo-headers"><div class="first-todo-header col-md-5">Task</div><div class="col-md-1 right-align">Duration</div><div class="col-md-1 right-align">Value</div><div class=col-md-2>Deadline</div><div class=col-md-2>Min start</div></div><form id=todo-form ng-submit=addTodo()><div class=row><div class=col-md-5><input id=title class="new-todo first-field" placeholder="Project or task name?" ng-model=newTodo.title ng-disabled=saving autofocus></div><div class=col-md-1><input class="new-todo right-align" placeholder=Hours ng-model=newTodo.hours ng-disabled=saving></div><div class=col-md-1><input class="new-todo right-align" placeholder=Points ng-model=newTodo.value ng-disabled=saving></div><div class=col-md-2><input type=text class=new-todo uib-datepicker-popup=shortDate ng-model=newTodo.deadline close-text=Close is-open=deadlinePopupOpen on-open-focus=false placeholder=(Optional) ng-focus=deadlineFocused()></div><div class=col-md-2><input type=text class=new-todo uib-datepicker-popup=shortDate ng-model=newTodo.minStart close-text=Close is-open=minStartPopupOpen on-open-focus=false placeholder=(Optional) ng-focus=minStartFocused()></div><div class=col-md-1><input class="todo-save-btn btn btn-default" type=submit class="btn btn-success" value=Save></div></div></form></header><section id=main ng-show=todos.length ng-cloak><input id=toggle-all type=checkbox ng-model=allChecked ng-click=markAll(allChecked)><ul id=todo-list><li ng-repeat="todo in todos track by $index" ng-class="{completed: todo.completed, editing: todo == editedTodo}"><div class=view><div class=row><div class=col-md-5><input class=toggle type=checkbox ng-model=todo.completed ng-change=toggleCompleted(todo)><label class=first-label ng-click=editTodo(todo)>{{todo.title}}</label></div><div class=col-md-1><label class=right-align ng-click=editTodo(todo)>{{todo.hours}}h</label></div><div class=col-md-1><label class=right-align ng-click=editTodo(todo)>{{todo.value}}p</label></div><div class=col-md-2><label ng-click=editTodo(todo)>{{todo.deadline | date:\'shortDate\'}}</label></div><div class=col-md-2><label ng-click=editTodo(todo)>{{todo.minStart | date:\'shortDate\'}}</label></div><button class=destroy ng-click=removeTodo(todo)></button></div></div><form ng-submit="saveEdits(todo, \'submit\')"><div class=row><div class=col-md-5><input class="edit first-field" ng-trim=false ng-model=todo.title todo-escape=revertEdits(todo) ng-blur="saveEdits(todo, \'blur\')" todo-focus="todo == editedTodo"></div></div></form></li></ul></section></section>'),e.put("app/footer/footer.html","<div class=container><div class=row><div class=col-md-12><p>&copy; 2015 David Raffensperger. <a href=https://github.com/draffensperger/wizweek>Source code.</a></p></div></div></div>"),e.put("app/layout/authorized.html",'<ww-welcome ng-show="!authorized.auth.signedIn && !authorized.lastSignIn.isLikelyActive()"></ww-welcome><div ng-show="!authorized.auth.signedIn && authorized.lastSignIn.isLikelyActive()"><span us-spinner="{radius:30, width:8, length: 16}"></span></div><div class="container main-content" ng-if=authorized.auth.signedIn><div class=row><div class=col-md-12><div ui-view></div></div></div></div>'),e.put("app/layout/main.html","<article><ww-navbar></ww-navbar><div ui-view></div></article><footer class=page-footer><ww-footer></ww-footer></footer>"),e.put("app/navbar/navbar.html",'<nav class="navbar navbar-default navbar-fixed-top"><div class=container><div class=navbar-header><button type=button class="navbar-toggle collapsed" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class="nav navbar-brand" ui-sref=home><div class=wizweek-brand>WizWeek</div></a></div><div id=navbar class="navbar-collapse collapse"><ul class="nav navbar-nav" ng-show=navbar.auth.signedIn><li ng-class="{ active: navbar.isActive(\'main.authorized.dashboard\')}"><a ui-sref=main.authorized.dashboard>Tasks</a></li><li ng-class="{ active: navbar.isActive(\'main.authorized.settings\')}"><a ui-sref=main.authorized.settings>Settings</a></li></ul><form class="navbar-text navbar-form navbar-right"><div ng-show=navbar.auth.signedIn>{{navbar.auth.userEmail}} <a ng-click=navbar.auth.signOut() href="">Log out</a></div><div ng-show="!navbar.auth.signedIn && !navbar.lastSignIn.isLikelyActive()"><a ng-click=navbar.auth.signIn() href="">Login with Google</a></div></form></div><!--/.navbar-collapse --></div></nav>'),e.put("app/settings/settings.html",'<div class=row><div class=col-md-5><h3>Settings</h3></div></div><div class=row><div class=col-md-5><h4>Calendars</h4></div></div><div class=row><div class=col-md-5><div class=form-group><label for=appointments-cal>Appointments calendar</label><select id=appointments-cal class=form-control ng-options="cal.id as cal.summary for cal in $ctrl.calendars" ng-model=$ctrl.settings.appointmentsCalId ng-change=$ctrl.saveSettings()></select>WizWeek will treat events on this calendar as fixed meetings and will schedule your project tasks around them.</div></div><div class=col-md-5><div class=form-group><label for=tasks-cal>Tasks calendar (will be overwritten)</label><select id=tasks-cal class=form-control ng-options="cal.id as cal.summary for cal in $ctrl.calendars" ng-model=$ctrl.settings.tasksCalId ng-change=$ctrl.saveSettings()></select>WizWeek will <b>overwrite future events</b> on this calendar and replace them with automatically scheduled project work tasks.</div></div></div><div class=row><div class=col-md-5><h4>Work Schedule</h4>WizWeek will schedule your project tasks within your work hours, except when you have an event in your appointments calendar.</div></div><div class=row><div class=col-md-1><h5>Day</h5></div><div class=col-md-2><h5>Start</h5></div><div class=col-md-2><h5>End</h5></div></div><div class=row ng-repeat="day in $ctrl.weekDays"><div class=col-md-1>{{day}}</div><div class=col-md-2><div uib-timepicker hour-step=1 minute-step=1 show-spinners=false mousewheel=false pad-hours=false ng-model-options="{ debounce:800 }" ng-change=$ctrl.saveSettings() ng-model=$ctrl.settings.workStartTimes[$index]></div></div><div class=col-md-2><div uib-timepicker hour-step=1 minute-step=1 show-spinners=false mousewheel=false pad-hours=false ng-model-options="{ debounce:800 }" ng-change=$ctrl.saveSettings() ng-model=$ctrl.settings.workEndTimes[$index]></div></div></div>'),e.put("app/welcome/welcome.html",'<!-- Main jumbotron for a primary marketing message or call to action --><div class=jumbotron><div class=container><h1>Want to optimize your week?</h1><p>WizWeek helps you effectively plan your week based on your to-do list and appointments.</p><p>You define tasks with deadlines, estimates and business value - and WizWeek jump starts your schedule.</p><p><a class="btn btn-primary btn-lg" role=button ng-click=welcome.auth.signIn()>Sign in with Google to get started &raquo;</a></p></div></div><div class=container><!-- Example row of columns --><div class=row><div class=col-md-6><h2>Clarify your priorities</h2><blockquote><p>&ldquo;What do you do the last week before you leave on a big trip? You clean up, close up, clarify, and renegotiate all your agreements with yourself and others. I just suggest that you do this weekly instead of yearly.&rdquo;</p><footer>David Allen of <cite title="Getting Things Done">Getting Things Done</cite></footer></blockquote></div><div class=col-md-6><h2>Schedule your work</h2><blockquote><p>&ldquo;Just as there is only so much stuff we can fit into our closets, so also there is only so much stuff we can fit into our days. If we don\'t think in terms of a basic schedule ... we end up in overload.&rdquo;</p><footer>Matt Perman of <cite title="What\'s Best Next">What\'s Best Next</cite></footer></blockquote></div></div></div><!-- /container -->')}]);
//# sourceMappingURL=../maps/scripts/app-5aa3ed8823.js.map
