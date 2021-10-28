// YOUR CODE HERE
var ha2 = {
    "signals": {
        "changePriority": 'CHANGEPRTY',
        "clear": 'CLEAR',
        "clearText": 'CLEARTEXT',
        "clearView": 'CLEARVIEW',
        "add": 'ADD',
        "viewSchedule": 'SCHEDULE',
        "makeNewDetail": 'MAKEDETAIL',
        "viewDetail": 'DETAIL',
        "clearViewDetail": 'CLEARVIEWDETAIL',
        "help": 'HELP',
        "remove": 'REMOVE'
    }
}

// This is the makeSignaller function as discussed in class
// Do not change this function
var makeSignaller = function () {
    var _subscribers = []; // Private member

    // Return the object that's created
    return {
        // Register a function with the notification system
        add: function (handlerFunction) { _subscribers.push(handlerFunction); },

        // Loop through all registered functions and call them with passed
        // arguments
        notify: function (args) { for (var i = 0; i < _subscribers.length; i++) { _subscribers[i](args); } }
    }
}


// makes the model for the day planner system
//
var makeModel = function () {
    // YOUR CODE HERE
    var _observers = makeSignaller();
    var _items = [];
    var _priority = "Normal";
    var _detailContainer = "";

    return {
        "register": function (observer_function) {
            _observers.add(observer_function);
        },
        "changePriority": function (prty) {
            _priority = prty;
            var normalBtn = document.getElementById("normalBtn");
            var highBtn = document.getElementById("highBtn");
            var tentativeBtn = document.getElementById("tentativeBtn");
            if (prty == "Normal") {
                normalBtn.style.background = "#CED8F6";
                highBtn.style.background = "lightGray";
                tentativeBtn.style.background = "lightGray";
            }
            if (prty == "High") {
                highBtn.style.background = "#CED8F6";
                normalBtn.style.background = "lightGray";
                tentativeBtn.style.background = "lightGray";
            }
            if (prty == "Tentative") {
                tentativeBtn.style.background = "#CED8F6";
                highBtn.style.background = "lightGray";
                normalBtn.style.background = "lightGray";
            }
            _observers.notify();
        },
        "clearView": function (viewId) {
            // this will clear the schedule view
            viewDiv = document.getElementById(viewId);
            if (viewDiv != null) {
                viewDiv.innerHTML = "";
            }
            _observers.notify();
        },
        "clearText": function (titleId, hourId, detailId) {
            // this will clear all text input and detail views
            var title = document.getElementById(titleId);
            var hour = document.getElementById(hourId);
            var detail = document.getElementById(detailId);
            title.value = "";
            hour.value = "";
            detail.value = "";
            _items.length = 0;
            _detailContainer.innerHTML = "";
            _observers.notify();
        },
        "showHelp": function (helpID) {
            var helpDiv = document.getElementById(helpID);
            if ((helpDiv.style.display == "") || (helpDiv.style.display == "none")) {
                helpDiv.style.display = "inline-block";
            } else {
                helpDiv.style.display = "none";
            }
        },
        "add": function (title, hour, detail) {
            var newAppointment = {
                "title": title,
                "hour": parseInt(hour),
                "detail": detail,
                "priority": _priority
            }
            _items.push(newAppointment);
            _items.sort(function (a, b) { return a.hour - b.hour });
            _observers.notify();
        },
        "viewSchedule": function (viewDiv) {
            var isEmpty = true;
            for (var i = 0; i < _items.length; i++) {
                if (_items[i] != null) {
                    isEmpty = false;
                    break;
                }
            }

            if (isEmpty == true) {
                _items.length = 0;
                _detailContainer.innerHTML = "";
            }

            for (var i = 0; i < _items.length; i++) {
                if (_items[i] != null) {
                    var appointmentDiv = document.createElement("div");
                    appointmentDiv.id = i;
                    appointmentDiv.style.width = "600px";
                    appointmentDiv.style.padding = "5px";
                    appointmentDiv.style.marginLeft = "10px";
                    if (i % 2 != 0) {
                        appointmentDiv.style.background = "lightGray";
                    }

                    var hourTextSpan = document.createElement("span");
                    hourTextSpan.innerHTML = _items[i].hour + ": ";
                    hourTextSpan.style.fontWeight = "bold";
                    appointmentDiv.appendChild(hourTextSpan);
                    appointmentDiv.innerHTML += _items[i].title + " (" + _items[i].priority + ")";

                    viewDiv.appendChild(appointmentDiv);

                    var rmvBtn = document.createElement("button");
                    rmvBtn.id = "btn" + i;
                    rmvBtn.style.font = "10pt sans-serif";
                    rmvBtn.style.width = "70px";
                    rmvBtn.innerHTML = "Remove";
                    viewDiv.appendChild(rmvBtn);
                    viewDiv.innerHTML += "</ br>";
                }            
               
            }
            for (var i = 0; i < _items.length; i++) {
                if (_items[i] != null) {
                    var rmv = makeRemoveControl(i, "btn" + i, viewDiv);
                    var contler = makeController(this);
                    rmv.register(contler.dispatch);
                }
            }

            for (var i = 0; i < _items.length; i++) {
                if (_items[i] != null) {
                    var contler = makeController(this);
                    var newDetail = makeDetailView(this, i.toString());
                    newDetail.register(contler.dispatch);
                }
            }

            _observers.notify();
        },
        "setDetailContainer": function (containerId) {
            _detailContainer = document.getElementById(containerId);
            _detailContainer.style.marginLeft = "20px";
            _detailContainer.style.borderLeft = "5px solid lightGray";
            _observers.notify();
        },
        "viewDetail": function (id) {
            if (_detailContainer.innerHTML.length > 0) {
                var currentId = _detailContainer.innerHTML[44];
                _detailContainer.innerHTML = "";
                if (parseInt(currentId) == parseInt(id)) {
                    return;
                }
            }
            var idSpan = document.createElement("span");
            idSpan.innerHTML = "ID: ";
            idSpan.style.fontWeight = "bold";
            _detailContainer.appendChild(idSpan);
            _detailContainer.innerHTML += id + "<br />";

            var titleSpan = document.createElement("span");
            titleSpan.innerHTML = "Title: ";
            titleSpan.style.fontWeight = "bold";
            _detailContainer.appendChild(titleSpan);
            _detailContainer.innerHTML += _items[id].title + "<br />";

            var hourSpan = document.createElement("span");
            hourSpan.innerHTML = "Hour: ";
            hourSpan.style.fontWeight = "bold";
            _detailContainer.appendChild(hourSpan);
            _detailContainer.innerHTML += _items[id].hour + "<br />";

            var detailSpan = document.createElement("span");
            detailSpan.innerHTML = "Detail: ";
            detailSpan.style.fontWeight = "bold";
            _detailContainer.appendChild(detailSpan);
            _detailContainer.innerHTML += _items[id].detail + "<br />";

            var prioritySpan = document.createElement("span");
            prioritySpan.innerHTML = "Priority: ";
            prioritySpan.style.fontWeight = "bold";
            _detailContainer.appendChild(prioritySpan);
            _detailContainer.innerHTML += _items[id].priority + "<br />";

            _observers.notify();
        },

        "removeItem": function (idToRemove) {
            _items[idToRemove] = null;
            _observers.notify();
        }
    };
}



// Make a single priority control button. Clicking this button
// should change the priority for subsequent appointment additions
//
// btnId - the Id of the element of this button
// priority - the priority associated with this button
//
var makePriorityControl = function (btnId, priority) {
    // YOUR CODE HERE
    var _observers = makeSignaller();
    var _btn = document.getElementById(btnId);

    _btn.addEventListener("click", function () {
        _observers.notify({
            "type": ha2.signals.changePriority,
            "parameter": priority,
        });
    });

    return {
        "register": function (observer_function) {
            _observers.add(observer_function);
        }
    };
}

// make control for help button
var makeHelpControl = function (helpBtn, helpID) {
    var _observers = makeSignaller();
    var helpBtn = document.getElementById(helpBtn);

    helpBtn.addEventListener("click", function () {
        _observers.notify({
            "type": ha2.signals.help,
            "helpID": helpID
        });
    });

    return {
        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    };
}



// Make a single clear items button. Clicking this button should 
// delete all items in the day planner.
//
// btnId - the Id of the element of this button
//
var makeClearControl = function (btnId) {
    // YOUR CODE HERE
    var _observers = makeSignaller();
    var _btn = document.getElementById(btnId);

    _btn.addEventListener("click", function () {
        _observers.notify({
            "type": ha2.signals.clear
        })
    });

    return {
        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    };
}

// Make a set of controls to add items to the daily planner.
//
// model - a reference to the model
// titleId - the Id of the element that takes the appointment title
// hourId - the Id of the element that takes the hour of the event 
// detailId - the Id of the element that takes the item detaill
// btnId - the Id of the element that when clicked will add the appointmennt
//
var makeAddControls = function (model, titleId, hourId, detailId, btnId) {
    // YOUR CODE HERE
    var _observers = makeSignaller();
    var _btn = document.getElementById(btnId);
    var title = document.getElementById(titleId);
    var hour = document.getElementById(hourId);
    var detail = document.getElementById(detailId);

    _btn.addEventListener("click", function () {
        if ((title.value.length > 0) && (hour.value >= 0) && (hour.value <= 23)) {
            if ((parseFloat(hour.value) - parseInt(hour.value)) == 0) {
                _observers.notify({
                    "type": ha2.signals.add,
                    "title": title.value,
                    "hour": hour.value,
                    "detail": detail.value
                })
            }
        }
    });

    return {
        "dispatch": function (evt) {
            switch (evt.type) {
                case (ha2.signals.clear):
                    _observers.notify({
                        "type": ha2.signals.clearText,
                        "titleId": titleId,
                        "hourId": hourId,
                        "detailId": detailId
                    })
                default:
                    //console.log("Unrecognized event", evt);
            }
        },

        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    };

}

// Make a view showing all items in the appointment list and handling interactions
// directly with that list
//
// model - a reference to the model
// viewId - the Id of the element holding the daily schedule, expected to be a div
//
var makeScheduleView = function (model, viewId) {
    // YOUR CODE HERE
    var _observers = makeSignaller();
    var _model = model;
    var viewDiv = document.getElementById(viewId);
    var _controller = makeController(_model);

    return {
        "dispatch": function (evt) {
            switch (evt.type) {
                case (ha2.signals.add):
                    _model.clearView(viewId);
                    _model.viewSchedule(viewDiv);

            }
            switch (evt.type) {
                case (ha2.signals.clear):
                    _observers.notify({
                        "type": ha2.signals.clearView,
                        "viewId": viewId
                    })
                default:
                    //console.log("Unrecognized event", evt);
            }
        },

        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    };
}


// Make a view showing the details of a single appointment.
//
// model - a reference to the model
// detailDivId - Id of div where detail view should go
var makeDetailView = function (model, detailDivId) {
    // YOUR CODE HERE
    var _observers = makeSignaller();
    var _detailDiv = document.getElementById(detailDivId);

    if (_detailDiv != null) {
        _detailDiv.addEventListener("click", function () {
            _observers.notify({
                "type": ha2.signals.viewDetail,
                "id": detailDivId
            })
        });
    }

    return {
        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    };

}

 //control for remove buttons
 //id - id of the item
 //btnId - id of the remove button
var makeRemoveControl = function (id, btnId, viewDiv) {
    var _observers = makeSignaller();
    var _btn = document.getElementById(btnId);

    _btn.addEventListener("click", function () {
        _observers.notify({
            "type": ha2.signals.remove,
            "idToRemove": id,
            "viewDiv": viewDiv
        })
    });

    return {
        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    };

}


// the controller for the MVC setup
//
// model - a reference to the model
//
var makeController = function (model) {
    // YOUR CODE HERE
    var _model = model;
    var _observers = makeSignaller();

    return {
        "dispatch": function (evt) {
            switch (evt.type) {
                case (ha2.signals.changePriority):
                    _model.changePriority(evt.parameter);
                    break;
                case (ha2.signals.add):
                    _model.add(evt.title, evt.hour, evt.detail);
                    break;
                case (ha2.signals.clearText):
                    _model.clearText(evt.titleId, evt.hourId, evt.detailId);
                    break;
                case (ha2.signals.clearView):
                    _model.clearView(evt.viewId);
                    break;
                case (ha2.signals.viewDetail):
                    _model.viewDetail(evt.id);
                    break;
                case (ha2.signals.help):
                    _model.showHelp(evt.helpID);
                    break;
                case (ha2.signals.remove):
                    _model.removeItem(evt.idToRemove);
                    _model.clearView(evt.viewDiv.id);
                    _model.viewSchedule(viewDiv);
                    break;
                default:
                    //console.log("Unrecognized event", evt);
            }
        },

        "register": function (observer_function) {
            _observers.add(observer_function)
        }
    }
}

// Create your MVC system here once the DOM Content is loaded
//
document.addEventListener("DOMContentLoaded", function (event) {
    // YOUR CODE HERE
    var model = makeModel();
    model.setDetailContainer("viewDetail");
    var controller = makeController(model);

    var changePrty1 = makePriorityControl("highBtn", "High");
    var changePrty2 = makePriorityControl("normalBtn", "Normal");
    var changePrty3 = makePriorityControl("tentativeBtn", "Tentative");

    var clear = makeClearControl("clear");

    var help = makeHelpControl("help", "helpDetail");

    var add = makeAddControls(model, "title", "hour", "detail", "add");

    var viewSchedule = makeScheduleView(model, "schedule");

    changePrty1.register(controller.dispatch);
    changePrty2.register(controller.dispatch);
    changePrty3.register(controller.dispatch);

    help.register(controller.dispatch);

    clear.register(controller.dispatch);
    clear.register(add.dispatch);
    clear.register(viewSchedule.dispatch);

    add.register(controller.dispatch);
    add.register(viewSchedule.dispatch);

    viewSchedule.register(controller.dispatch);

    controller.register(model);
});