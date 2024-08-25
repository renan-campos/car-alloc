document.addEventListener("DOMContentLoaded", function() {
    let ui = new UI(document.body);
    ui.Render();
});

const ClassNames = {
    passengerTerminal: "passenger-terminal",
    carTerminal: "car-terminal",
    controlPanel: "control-panel",
    terminals: "terminals",
    terminalHead: "terminal-head",
    car: "car",
    passenger: "passenger",
    passengerSeat: "passenger-seat"
}

class UI {
    constructor(container) {
        this.container = container;

        let uxManager = new UxManager(this.container);
        let passengerManager = new PassengerManager(uxManager);

        let passengerTerminalDiv = document.createElement("div");
        passengerTerminalDiv.className = `${ClassNames.passengerTerminal}`;
        this.passengerTerminal = new PassengerTerminal(passengerTerminalDiv, passengerManager);

        let carManager = new CarManager(passengerManager);

        let carTerminalDiv = document.createElement("div");
        carTerminalDiv.className = `${ClassNames.carTerminal}`;
        this.carTerminal = new CarTerminal(carTerminalDiv, carManager);

        let controlPanelDiv = document.createElement("div");
        controlPanelDiv.className = `${ClassNames.controlPanel}`;
        this.controlPanel = new ControlPanel(controlPanelDiv, this.passengerTerminal, this.carTerminal);
    }

    Render() {
        this.controlPanel.Render(this.container);
        let terminalsDiv = document.createElement("div");
        terminalsDiv.className = `${ClassNames.terminals}`;
        this.carTerminal.Render(terminalsDiv);
        this.passengerTerminal.Render(terminalsDiv);
        this.container.appendChild(terminalsDiv);
    }
}

class ControlPanel {
    constructor(container, passengerTerminal, carTerminal) {
        this.container = container;
        this.passengerTerminal = passengerTerminal;
        this.carTerminal = carTerminal;
    }

    Render(parentElement) {
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

        parentElement.appendChild(this.container);
    }
}

class CarManager {
    constructor(passengerManager) {
        this.passengerManager = passengerManager;
    }
    InsertCar(parentDiv, car) {
        var carDiv = document.createElement("div");
        carDiv.className = `${ClassNames.car}`;
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

    Render(parentElement) { 
        var nameDisplay = document.createElement("div");
        nameDisplay.className = `${ClassNames.terminalHead}`;
        nameDisplay.textContent = "Cars";
        this.container.appendChild(nameDisplay);
        parentElement.appendChild(this.container);
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

    Render(parentElement) {
        var nameDisplay = document.createElement("div");
        nameDisplay.className = `${ClassNames.terminalHead}`;
        nameDisplay.textContent = "Standby Passengers";
        this.container.appendChild(nameDisplay);
        parentElement.appendChild(this.container);
    }

    InsertPassenger(passengerName) {
        this.container.appendChild(this.passengerManager.RenderPassenger(passengerName));
    }
}

class PassengerManager {
    constructor(uxManager) { 
        this.uxManager = uxManager;
    }

    RenderPassenger(passengerName) {
        var passengerDiv = document.createElement("div");
        passengerDiv.className = `${ClassNames.passenger}`;
        passengerDiv.textContent = passengerName;

        this.uxManager.AddDragProperties(passengerDiv);
        return passengerDiv
    }

    RenderPassengerSeat() {
        var passengerSeat = document.createElement("div");
        passengerSeat.className = `${ClassNames.passengerSeat}`;
        return passengerSeat
    }
}

class UxManager {
    constructor(parentElement) {
        this.draggingPassenger = null;

        parentElement.addEventListener('dragover', (event) => {
            let parentContainer = this.draggingPassenger.parentElement;
            event.preventDefault();
            const targetContainer = event.target.closest(`.${ClassNames.passengerSeat}, .${ClassNames.passengerTerminal}`);
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

    AddDragProperties(element) {
        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart', (event) => {
            this.draggingPassenger = event.target;
            event.target.classList.add('dragging');
        });
        element.addEventListener('dragend', () => {
            this.draggingPassenger.classList.remove('dragging');
            this.draggingPassenger = null;
        });
    }

    isFilledSeat(seat) {
        if (seat.classList.contains(`${ClassNames.passengerSeat}`)) {
            if (seat.getElementsByClassName("passenger").length > 0) {
                return true
            }
        }
        return false
    }

    isSeat(seat) {
        if (seat.classList.contains(`${ClassNames.passengerSeat}`)) {
            return true
        }
        return false
    }
}
