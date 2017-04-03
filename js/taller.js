var app = angular.module('taller',['ngRoute'])
.config(function($routeProvider){
	$routeProvider
		.when("/", {
			templateUrl: "templates/main.html"
		})
		.when("/create-ticket", {
			templateUrl: "templates/create-ticket.html"
		})
		.when("/edit-ticket/:id", {
			templateUrl: "templates/edit-ticket.html",
      controller: "editTicketCtrl"
		})
		.when("/ver-ticket", {
			templateUrl: "templates/ver-ticket.html"
		})
		.when("/delete-ticket", {
			templateUrl: "templates/delete-ticket.html"
		})
		.when("/ticket/:id", {
			templateUrl: "templates/ticket.html",
			controller: "ticketCtrl"
		})
})
.directive("fileread", [function(){
	return {
		scope: {
			fileread: "="
		},
		link: function(scope, element, attributes) {
			element.bind("change", function(changeEvent){
				scope.$apply(function(){
					scope.fileread = changeEvent.target.files[0];
				});
			});
		}
	}
}])
.controller('tallerController', tallerController);

	function tallerController($scope, $http, $location, $window, ticketService) {
		var taller = $scope;
		// Get protocol concatenated to host
	  // $scope.site = $location.protocol() + "://" + $location.host();

	  // Get token from url
	  //$scope.url = "http://bienes.com/rest/session/token";
	  // $http.get($scope.url).success(function(respuesta){
	  //   $scope.token = respuesta;
	  // });
	
    // Simulating users
    taller.user = {
      "usuarios" : [
        {
          "name": "Jesus",
          "lastName": "Mi Dios"
        },
        {
          "name": "Lionel",
          "lastName": "Messi"
        },
        {
          "name": "Thomaz",
          "lastName": "Santos"
        },
        {
          "name": "Kevin",
          "lastName": "Mamani"
        },
        {
          "name": "Sarahi",
          "lastName": "Mamani"
        },
        {
          "name": "Leonilda",
          "lastName": "Mollo"
        },
        {
          "name": "Noel",
          "lastName": "Mamani"
        },
        {
          "name": "Alberto",
          "lastName": "Quiroga"
        },
        {
          "name": "Jhimy",
          "lastName": "Cardenas"
        },
      ]
    }
    taller.users = taller.user.usuarios;

    // Simulating tickets
    taller.tickets = ticketService.getTickets();

    // Select a user
    taller.selectUser = function(u){
      console.log(u);
    };

    // This filter by category and producto
    taller.filter = function(categoria, producto){
      if (categoria == undefined || producto == undefined) {
        swal({
				  title: "Error!",
				  text: "Category or/and product is missing!",
				  type: "error",
				  confirmButtonText: "OK"
				});
      } else {
        taller.filterCategoria = categoria;
        taller.filterProducto = producto;
      }
    };

    // Save the new ticket
    var allTickets = [];
    allTickets = angular.fromJson(ticketService.getTickets());
    taller.saveTicket = function(code, category, product, opening, message, file){
    	if (code==undefined || code == "" || category==undefined || category == "" || product==undefined || product == "" || opening == undefined || opening == "" || message==undefined || message == "" || file==undefined || file == "") {
    		swal({
				  title: "Error!",
				  text: "Complete all filds",
				  type: "error",
				  confirmButtonText: "OK"
				});
    	} else {
	    	var a = {
	    		"id" : code,
	        "categoria" : category,
	        "producto" : product,
	        "creadoEn" : moment(opening).format('MM/DD/YYYY'),
	        "ultimaActualizacion" : moment(opening).format('MM/DD/YYYY'),
	        "atendidoPor" : "Alvaro",
	        "status": "Fechado",
	        "message": message,
	        "file": file
	    	};
	    	//allTickets.push(a);
	    	ticketService.addTicket(a);
	    	console.log(allTickets);
	    	swal("Great!", "Ticket created!", "success");
    	}
    };

    taller.deleteTicket = function(index) {
      swal("Deleted!", "Ticket deleted.", "success");
      ticketService.deleteTicket(index);
    };
	};

app.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
});
app.controller('ticketCtrl', ticketController);

	function ticketController($scope, $routeParams, $filter, $http, $location, $window, ticketService) {
		//console.log(productService.getProducts());
		var ticket = $scope;
		ticket.codeTicket = $routeParams.id;

		// Tickets
    var allTickets = [];
    allTickets = angular.fromJson(ticketService.getTickets());
    console.log(allTickets);

	  ticket.searchTicket = function() {
      var found = $filter('getById')(allTickets, ticket.codeTicket);
      console.log(found);
      //$scope.selected = JSON.stringify(found);
      ticket.code = "Ticket " + found.id;
      ticket.category = found.categoria;
      ticket.product = found.producto;
      ticket.opening = moment(found.creadoEn).toDate();
      ticket.message = "Ticket " + found.message;
      ticket.file = "Ticket " + found.file;
      console.log(moment(found.creadoEn).toDate());
   	};
   	ticket.searchTicket();

    ticket.answer = false;
    ticket.answerTicket = function() {
      ticket.answer = true;
    };

    ticket.answers = [];
    ticket.showAnswers = false;
    ticket.sendAnswer = function(a) {
      if(a != undefined && a != ""){
        var ans = {
          "answer" : a
        };
        ticket.answer = false;
        swal("Great!", "Answer sent!", "success");
        ticket.answers.push(ans);
        ticket.userAnswer = "";
        if (ticket.answers.length > 0) {
          ticket.showAnswers = true;
        }
      } else{
        swal({
          title: "Error!",
          text: "Answer is missing!",
          type: "error",
          confirmButtonText: "OK"
        });
        ticket.answer = true;
      }
    };

    ticket.deleteAnswer = function(item) {
      var index = ticket.answers.indexOf(item);
      ticket.answers.splice(index, 1);     
    };
	};

app.controller('editTicketCtrl', editTicketController);
  function editTicketController($scope, $routeParams, $filter, $http, $location, $window, ticketService) {
    //console.log(productService.getProducts());
    var ticket = $scope;
    ticket.codeTicket = $routeParams.id;

    // Tickets
    var allTickets = [];
    allTickets = angular.fromJson(ticketService.getTickets());

    ticket.searchTicket = function() {
      var found = $filter('getById')(allTickets, ticket.codeTicket);
      console.log(found);
      //$scope.selected = JSON.stringify(found);
      ticket.code = "Ticket " + found.id;
      ticket.category = found.categoria;
      ticket.product = found.producto;
      ticket.opening = moment(found.creadoEn).toDate();
      ticket.message = "Ticket " + found.message;
      ticket.file = "Ticket " + found.file;
      console.log(moment(found.creadoEn).toDate());
    };
    ticket.searchTicket();

    ticket.editTicket = function() {
      var found = $filter('getById')(allTickets, ticket.codeTicket);
      ticket.toEdit = found;
      var index = allTickets.indexOf(ticket.toEdit);
      console.log(index);
      ticketService.deleteTicket(ticket.toEdit);
      var ticketEdited = {
        "id" : ticket.code,
        "categoria" : ticket.category,
        "producto" : ticket.product,
        "creadoEn" : moment(ticket.opening).format('MM/DD/YYYY'),
        "ultimaActualizacion" : moment(ticket.opening).format('MM/DD/YYYY'),
        "atendidoPor" : "--",
        "message": ticket.message,
        "file" : ticket.file.name,
        "status": "abierto",
      };
      ticketService.addTicket(ticketEdited);
      swal("Great!", "Ticket edited!", "success");
    };
  };
// Service for tickets
app.service('ticketService', function() {
	var tickets = [
    {
      "id" : "000235",
      "categoria" : "Dúvida",
      "producto" : "Outros",
      "creadoEn" : "09/03/2015",
      "ultimaActualizacion" : "--",
      "atendidoPor" : "--",
      "message": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam ",
      "status": "abierto",
    },
    {
      "id" : "000234",
      "categoria" : "Conta violada",
      "producto" : "General War",
      "creadoEn" : "09/01/2015",
      "ultimaActualizacion" : "09/03/2015",
      "atendidoPor" : "--",
      "message": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam ",
      "status": "Responder",
    },
    {
      "id" : "000233",
      "categoria" : "Reembolso",
      "producto" : "Barbarians",
      "creadoEn" : "08/25/2015",
      "ultimaActualizacion" : "08/25/2015",
      "atendidoPor" : "Alvaro",
      "message": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam ",
      "status": "Fechado",
    },
  ];

  var addTicket = function(newObj) {
    tickets.push(newObj);
    console.log(tickets);
  };

  var deleteTicket = function(item) {
    var index = tickets.indexOf(item);
    tickets.splice(index, 1);   
  };

  var getTickets = function(){
  	console.log(tickets);
    return tickets;
  };

  return {
    addTicket: addTicket,
    getTickets: getTickets,
    deleteTicket: deleteTicket
  };
});