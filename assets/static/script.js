document.addEventListener("DOMContentLoaded", function() {
    let ui = new UI(document.body);
    ui.Render();
});

class UI {
    constructor(container) {
        this.container = container;
    }

    Render() {
        let passengerManager = new PassengerManager(this.container);

        var passengerTerminalDiv = document.createElement("div");
        passengerTerminalDiv.className = "passenger-terminal";
        let passengerTerminal = new PassengerTerminal(passengerTerminalDiv, passengerManager);

        let carManager = new CarManager(passengerManager);

        var carTerminalDiv = document.createElement("div");
        carTerminalDiv.className = "car-terminal";
        let carTerminal = new CarTerminal(carTerminalDiv, carManager);

        var controlPanelDiv = document.createElement("div");
        controlPanelDiv.className = "control-panel";

        let controlPanel = new ControlPanel(controlPanelDiv, passengerTerminal, carTerminal);
        controlPanel.Render();
        this.container.appendChild(controlPanelDiv);

        passengerTerminal.Render();
        carTerminal.Render();

        let terminals = document.createElement("div");
        terminals.className = "terminals";
        terminals.appendChild(carTerminalDiv);
        terminals.appendChild(passengerTerminalDiv);

        this.container.appendChild(terminals);
    }
}

class ControlPanel {
    constructor(container, passengerTerminal, carTerminal) {
        this.container = container;
        this.passengerTerminal = passengerTerminal;
        this.carTerminal = carTerminal;
    }

    Render() {
        // Create options for the select element
        var capacitySelect = document.createElement("select");
        for (var i = 1; i <= 12; i++) {
            var option = document.createElement("option");
            option.value = i; // Set the value attribute of the option
            option.textContent = i; // Set the display text of the option
            capacitySelect.appendChild(option); // Append the option to the select element
        }

        var carName = document.createElement("input");
        carName.type = "text";
        carName.placeholder = "Car Name";

        var addCarButton = document.createElement("button");
        addCarButton.id = "add-car";
        addCarButton.textContent = "Add Car";
        // Optionally, you can set other attributes or event listeners
        addCarButton.setAttribute("type", "button"); // Set type attribute to "button"
        let carTerminal = this.carTerminal;
        addCarButton.addEventListener("click", function() {
            carTerminal.InsertCar(carName.value.trim(), parseInt(capacitySelect.value, 10));
        });

        this.container.appendChild(carName);
        this.container.appendChild(capacitySelect);
        this.container.appendChild(addCarButton);

        var passengerName = document.createElement("input");
        passengerName.type = "text";
        passengerName.placeholder = "Passenger Name";

        var addPassengerButton = document.createElement("button");
        addPassengerButton.id = "add-passenger";
        addPassengerButton.textContent = "Add Passenger";
        // Optionally, you can set other attributes or event listeners
        addPassengerButton.setAttribute("type", "button"); // Set type attribute to "button"
        let passengerTerminal = this.passengerTerminal;
        addPassengerButton.addEventListener("click", function() {
            passengerTerminal.InsertPassenger(passengerName.value.trim());
        });

        this.container.appendChild(passengerName);
        this.container.appendChild(addPassengerButton);
    }
}

class CarManager {
    constructor(passengerManager) {
        this.passengerManager = passengerManager;
    }
    InsertCar(parentDiv, car) {
        var carDiv = document.createElement("div");
        carDiv.className = "car";
        carDiv.textContent = car.Name;
        for (var i = 1; i <= car.Capacity; i++) {
            carDiv.appendChild(this.passengerManager.RenderPassengerSeat());
        }
        parentDiv.appendChild(carDiv);
    }
}

class CarTerminal {
    constructor(container, carManager) {
        this.container = container;
        this.carManager = carManager;
    }

    Render() { 
        var nameDisplay = document.createElement("div");
        nameDisplay.className = "terminal-head";
        nameDisplay.textContent = "Cars";
        this.container.appendChild(nameDisplay);
    }

    InsertCar(carName, carCapacity) {
        this.carManager.InsertCar(this.container, {Name: carName, Capacity: carCapacity});
    }
}

class PassengerTerminal {
    constructor(container, passengerManager) {
        this.container = container;
        this.passengerManager = passengerManager;
    }

    Render() {
        var nameDisplay = document.createElement("div");
        nameDisplay.className = "terminal-head";
        nameDisplay.textContent = "Standby Passengers";
        this.container.appendChild(nameDisplay);
    }

    InsertPassenger(passengerName) {
        this.container.appendChild(this.passengerManager.RenderPassenger(passengerName));
    }
}

class PassengerManager {
    constructor(container) { 
        this.container = container;
        this.draggingPassenger = null;

        container.addEventListener('dragover', (event) => {
            let parentContainer = this.draggingPassenger.parentElement;
            event.preventDefault();
            const targetContainer = event.target.closest('.passenger-seat, .passenger-terminal');
            if (
                targetContainer && 
                targetContainer !== this.draggingPassenger &&
                !this.isFilledSeat(targetContainer)
            ) {
                const rect = targetContainer.getBoundingClientRect();
                const next = (event.clientY - rect.top) > (rect.bottom - event.clientY);
                targetContainer.appendChild(this.draggingPassenger);
                if (this.isFilledSeat(targetContainer)) {
                    targetContainer.style.padding = "0px";
                }
                if (this.isSeat(parentContainer)) {
                    parentContainer.style.padding = "10px";
                }
            }
        });
    }

    isFilledSeat(seat) {
        if (seat.classList.contains("passenger-seat")) {
            if (seat.getElementsByClassName("passenger").length > 0) {
                return true
            }
        }
        return false
    }

    isSeat(seat) {
        if (seat.classList.contains("passenger-seat")) {
            return true
        }
        return false
    }

    RenderPassenger(passengerName) {
        var passengerDiv = document.createElement("div");
        passengerDiv.className = "passenger";
        passengerDiv.textContent = passengerName;

        passengerDiv.setAttribute('draggable', 'true');
        passengerDiv.addEventListener('dragstart', (event) => {
            this.draggingPassenger = event.target;
            event.target.classList.add('dragging');
        });
        passengerDiv.addEventListener('dragend', () => {
            this.draggingPassenger.classList.remove('dragging');
            this.draggingPassenger = null;
        });
        return passengerDiv
    }

    RenderPassengerSeat() {
        var passengerSeat = document.createElement("div");
        passengerSeat.className = "passenger-seat";
        return passengerSeat
    }
}
