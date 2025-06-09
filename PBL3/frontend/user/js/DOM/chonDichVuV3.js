// import "../../../APIs/flights_seat.js";
import { getListSeatOnFlight } from "../../../APIs/flights_seat.js";
import { setStatusSeat } from "../../../APIs/flights_seat.js";

let listCustomer = [];
let ListSeatOnFlightDeparture = [];
let ListSeatOnFlightReturn = [];
let dataFlight;
let countPeople = 0;
let isRoundTrip = false;

// Baggage selection variables - UPDATED LOGIC
let currentPersonIndex = 0;
let currentTripType = 'departure'; // 'departure' or 'return'
let BaggageListDeparture = [];
let BaggageListReturn = [];

// Seat selection variables - UPDATED LOGIC
let SeatOfPeopleDeparture = [];
let SeatOfPeopleReturn = [];
let currentSeatTripType = 'departure';
let currentSeatPersonIndex = 0;
let ChooseSeat = [];
let tempSelectedSeats = []; // Temporary seats selected during current session

// Price calculation variables
let totalPrice = 0;
let flightPrice = 0;
let baggagePrice = 0;
let seatPrice = 0;

// Price constants (you can adjust these based on your system)
const BAGGAGE_PRICES = {
    'CARRY_ON_BA_7': 0,      // 7kg carry-on (free)
    'CARRY_ON_BA_10': 200000, // 10kg carry-on
    'CHECKED_BA_20': 500000,  // 20kg checked
    'CHECKED_BA_30': 800000   // 30kg checked
};

const SEAT_PRICES = {
    'VIP': 300000,     // VIP seat surcharge
    'COMMON': 0        // Regular seat (no extra charge)
};

// Initialize baggage lists
function initializeBaggageLists() {
    const defaultBaggage = {
        baggageType: 'CARRY_ON_BA',
        baggageWeight: 10
    };

    BaggageListDeparture = [];
    BaggageListReturn = [];

    for (let i = 0; i < countPeople; i++) {
        BaggageListDeparture.push({ ...defaultBaggage });
        if (isRoundTrip) {
            BaggageListReturn.push({ ...defaultBaggage });
        }
    }

    // Clear previous session data
    sessionStorage.setItem("SeatOfPeopleDeparture", JSON.stringify([]));
    sessionStorage.setItem("SeatOfPeopleReturn", JSON.stringify([]));
    sessionStorage.setItem("BaggageListDeparture", JSON.stringify(BaggageListDeparture));
    sessionStorage.setItem("BaggageListReturn", JSON.stringify(BaggageListReturn));
}

window.addEventListener('load', async () => {
    // Get search form data to check if round trip
    const searchFormData = JSON.parse(sessionStorage.getItem('search-form-data')) || {};
    isRoundTrip = searchFormData.isRoundTrip || false;
    countPeople = getPeopleCount();

    listCustomer = JSON.parse(sessionStorage.getItem('customerData')) || [];
    dataFlight = JSON.parse(sessionStorage.getItem("customerSelectedFlight"));

    // Initialize baggage lists
    initializeBaggageLists();

    // Calculate initial flight price
    calculateFlightPrice();
    updateTotalPrice();

    await loadListSeatOnFlight();
    createViewFlights();
    createSeat();
});

async function loadListSeatOnFlight() {
    // Load seats for departure flight
    ListSeatOnFlightDeparture = await getListSeatOnFlight(dataFlight.departureFlightASeat.flight.idFlight);

    // Load seats for return flight if round trip
    if (isRoundTrip && dataFlight.returnFlightASeat) {
        ListSeatOnFlightReturn = await getListSeatOnFlight(dataFlight.returnFlightASeat.flight.idFlight);
    }
}

function createViewFlights() {
    const parentNode = document.body.querySelector('.section');
    const customerSelectedFlight = JSON.parse(sessionStorage.getItem('customerSelectedFlight'));
    parentNode.appendChild(createViewFlight(customerSelectedFlight.departureFlightASeat.flight, customerSelectedFlight.departureFlightASeat.styleSeat));
    if (customerSelectedFlight.returnFlightASeat != null) {
        parentNode.appendChild(createViewFlight(customerSelectedFlight.returnFlightASeat.flight, customerSelectedFlight.returnFlightASeat.styleSeat));
    }
}

function createViewFlight(flight, styleSeat) {
    const viewFlistBox = document.createElement('div');
    viewFlistBox.className = 'section-content';
    return viewFlistBox;
}

function payment() {
    window.location.href = 'thongTinThanhToan.html';
}

window.onload = function () {
    // Display customer information
    const customer = JSON.parse(sessionStorage.getItem("customerData") || "{}");
    const contact = JSON.parse(sessionStorage.getItem("contactInfo") || "{}");

    if (customer == null || contact == null) {
        alert("Bạn chưa nhập thông tin hành khách");
        window.location.href = 'nhapThongTin.html';
        return;
    }

    const showAboutCustomer = customer.map(person => {
        return `
        <div class="flight-section">
            <h3>🧍‍♂️ Hành khách</h3>
            <p><strong>👤 Họ Tên:</strong> ${person.fullName || "?"}</p>
            <p><strong>📅 Ngày Sinh:</strong> ${person.birthDate || "?"}</p>
        </div>
    `;
    }).join("");

    document.querySelector(".customerInfo").innerHTML = showAboutCustomer;

    const showContact = `
        <div class="flight-section">
            <p><strong>📧 Email:</strong> ${contact.email || "?"}</p>
            <p><strong>📞 Số điện thoại:</strong> ${contact.phone || "?"}</p>
        </div>
    `;
    document.querySelector(".bookingInfo").innerHTML = showContact;

    // Display flight information
    const dataFlight = sessionStorage.getItem("customerSelectedFlight");
    if (!dataFlight) {
        document.querySelector(".SelectedFlightInfo").textContent = "Không có thông tin chuyến bay.";
        return;
    }

    const flightInfo = JSON.parse(dataFlight);
    const goFlight = `
    <div class="flight-section">
        <h3>🛫 Chuyến đi</h3>
        <p><strong>📍 Điểm đi:</strong> ${flightInfo.departureFlightASeat.flight.fromLocation.name || "?"}</p>
        <p><strong>📍 Điểm đến:</strong> ${flightInfo.departureFlightASeat.flight.toLocation.name || "?"}</p>
        <p><strong>📅 Ngày đi:</strong> ${flightInfo.departureFlightASeat.flight.departureDate || "?"}</p>
        <p><strong>🕗 Giờ đi:</strong> ${flightInfo.departureFlightASeat.flight.departureTime || "?"}</p>
    </div>
  `;

    let returnFlight = "";
    if (flightInfo.returnFlightASeat) {
        returnFlight = `
      <div class="flight-section">
        <h3>🛫 Chuyến về</h3>
        <p><strong>📍 Điểm đi:</strong> ${flightInfo.returnFlightASeat.flight.fromLocation.name || "?"}</p>
        <p><strong>📍 Điểm đến:</strong> ${flightInfo.returnFlightASeat.flight.toLocation.name || "?"}</p>
        <p><strong>📅 Ngày đi:</strong> ${flightInfo.returnFlightASeat.flight.departureDate || "?"}</p>
        <p><strong>🕗 Giờ đi:</strong> ${flightInfo.returnFlightASeat.flight.departureTime || "?"}</p>
      </div>
    `;
    }
    document.querySelector(".SelectedFlightInfo").innerHTML = goFlight + returnFlight;
};

// UPDATED BAGGAGE SELECTION - Choose all departure then all return
document.querySelector(".showBaggageInfo").addEventListener("click", showBaggagePopup);

function showBaggagePopup() {
    currentPersonIndex = 0;
    currentTripType = 'departure';

    const popup = document.getElementById("popup");
    popup.style.display = "block";
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    popup.style.display = "grid";
    popup.style.gridTemplateRows = "10% 10% 70% 10%";
    popup.style.left = `calc(50% - ${width / 2}px)`;
    popup.style.top = `calc(50% - ${height / 2}px)`;

    updateBaggageSelection();

    document.addEventListener("click", function (event) {
        const b = document.querySelector(".showBaggageInfo");
        if (!popup.contains(event.target) && !b.contains(event.target)) {
            popup.style.display = "none";
        }
    });
}

function updateBaggageSelection() {
    const cardName = document.querySelector('.CardName');
    const tabDR = document.querySelector('.tabDR');

    if (currentPersonIndex < listCustomer.length) {
        const personName = listCustomer[currentPersonIndex].fullName;
        const tripText = currentTripType === 'departure' ? 'chuyến đi' : 'chuyến về';

        cardName.textContent = `Chọn hành lý cho ${personName} - ${tripText}`;

        // Show progress indicator
        const totalSteps = isRoundTrip ? countPeople * 2 : countPeople;
        const currentStep = currentTripType === 'departure' ?
            currentPersonIndex + 1 :
            countPeople + currentPersonIndex + 1;

        tabDR.innerHTML = `
            <div style="text-align: center; padding: 10px;">
                <p>Bước ${currentStep}/${totalSteps}</p>
                ${isRoundTrip ? `<p style="color: #666; font-size: 0.9em;">
                    ${currentTripType === 'departure' ?
                    'Đang chọn cho chuyến đi' :
                    'Đang chọn cho chuyến về'}</p>` : ''}
            </div>
        `;
    }
}

document.getElementById("closeShowPopup").addEventListener("click", closeBaggagePopup);

function closeBaggagePopup() {
    document.getElementById("popup").style.display = "none";
    currentPersonIndex = 0;
    currentTripType = 'departure';
}

// Baggage selection handlers
document.getElementsByClassName("BaggageCard_1")[0].addEventListener('click', () => {
    SelectBaggage(1);
});
document.getElementsByClassName("BaggageCard_2")[0].addEventListener('click', () => {
    SelectBaggage(2);
});
document.getElementsByClassName("BaggageCard_3")[0].addEventListener('click', () => {
    SelectBaggage(3);
});

function SelectBaggage(option) {
    let selectedBaggage;

    switch (option) {
        case 1:
            selectedBaggage = {
                baggageType: 'CARRY_ON_BA',
                baggageWeight: 10
            };
            break;
        case 2:
            selectedBaggage = {
                baggageType: 'CHECKED_BA',
                baggageWeight: 20
            };
            break;
        case 3:
            selectedBaggage = {
                baggageType: 'CHECKED_BA',
                baggageWeight: 30
            };
            break;
        default:
            return;
    }

    // Update the appropriate baggage list
    if (currentTripType === 'departure') {
        BaggageListDeparture[currentPersonIndex] = selectedBaggage;
    } else {
        BaggageListReturn[currentPersonIndex] = selectedBaggage;
    }

    // Recalculate price immediately
    calculateBaggagePrice();
    updateTotalPrice();

    // UPDATED LOGIC: Choose all departure first, then all return
    moveToNextBaggageSelection();
}

function moveToNextBaggageSelection() {
    if (currentTripType === 'departure') {
        // Move to next person in departure
        currentPersonIndex++;

        if (currentPersonIndex >= countPeople) {
            // All departure selections done
            if (isRoundTrip) {
                // Switch to return trip, start from first person
                currentTripType = 'return';
                currentPersonIndex = 0;
                updateBaggageSelection();
            } else {
                // Single trip, finish
                finalizeBaggageSelection();
                return;
            }
        } else {
            updateBaggageSelection();
        }
    } else {
        // Return trip
        currentPersonIndex++;

        if (currentPersonIndex >= countPeople) {
            // All return selections done
            finalizeBaggageSelection();
        } else {
            updateBaggageSelection();
        }
    }
}

function finalizeBaggageSelection() {
    // Save to session storage
    sessionStorage.setItem("BaggageListDeparture", JSON.stringify(BaggageListDeparture));
    sessionStorage.setItem("BaggageListReturn", JSON.stringify(BaggageListReturn));

    // Calculate baggage price
    calculateBaggagePrice();
    updateTotalPrice();

    // Close popup
    closeBaggagePopup();

    // Show confirmation message
    alert("Đã chọn hành lý cho tất cả hành khách!");
}

// Price calculation functions
function calculateFlightPrice() {
    if (!dataFlight) return;

    // Lấy giá từ styleSeat và commonFare/vipFare
    let departurePricePerPerson = 0;
    if (dataFlight.departureFlightASeat.styleSeat === 'vip') {
        departurePricePerPerson = dataFlight.departureFlightASeat.flight.vipFare;
    } else {
        departurePricePerPerson = dataFlight.departureFlightASeat.flight.commonFare;
    }

    flightPrice = departurePricePerPerson * countPeople;

    // Add return flight price if round trip
    if (isRoundTrip && dataFlight.returnFlightASeat) {
        let returnPricePerPerson = 0;
        if (dataFlight.returnFlightASeat.styleSeat === 'vip') {
            returnPricePerPerson = dataFlight.returnFlightASeat.flight.vipFare;
        } else {
            returnPricePerPerson = dataFlight.returnFlightASeat.flight.commonFare;
        }
        flightPrice += returnPricePerPerson * countPeople;
    }
}

function calculateSeatPrice() {
    seatPrice = 0;

    // Calculate departure seat price
    SeatOfPeopleDeparture.forEach(seatNumber => {
        if (currentSeatTripType === 'departure' || SeatOfPeopleDeparture.includes(seatNumber)) {
            const seatIndex = seatNumber - 1;
            if (ListSeatOnFlightDeparture[seatIndex] &&
                ListSeatOnFlightDeparture[seatIndex].seat.seatType === 'VIP') {
                seatPrice += SEAT_PRICES.VIP;
            }
        }
    });

    // Calculate return seat price if round trip
    if (isRoundTrip) {
        SeatOfPeopleReturn.forEach(seatNumber => {
            const seatIndex = seatNumber - 1;
            if (ListSeatOnFlightReturn[seatIndex] &&
                ListSeatOnFlightReturn[seatIndex].seat.seatType === 'VIP') {
                seatPrice += SEAT_PRICES.VIP;
            }
        });
    }
}

function updateTotalPrice() {
    totalPrice = flightPrice + baggagePrice + seatPrice;

    // Update price display
    const priceElement = document.querySelector('.price-value');
    if (priceElement) {
        priceElement.textContent = formatPrice(totalPrice) + ' VND';
    }

    // Also update detailed price breakdown if element exists
    updatePriceBreakdown();
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function updatePriceBreakdown() {
    const priceBreakdownElement = document.querySelector('.price-breakdown');
    if (priceBreakdownElement) {
        priceBreakdownElement.innerHTML = `
            <div class="price-item">
                <span>Giá vé máy bay:</span>
                <span>${formatPrice(flightPrice)} VND</span>
            </div>
            <div class="price-item">
                <span>Phí hành lý:</span>
                <span>${formatPrice(baggagePrice)} VND</span>
            </div>
            <div class="price-item">
                <span>Phí ghế VIP:</span>
                <span>${formatPrice(seatPrice)} VND</span>
            </div>
            <div class="price-total">
                <span><strong>Tổng cộng:</strong></span>
                <span><strong>${formatPrice(totalPrice)} VND</strong></span>
            </div>
        `;
    }
}

// UPDATED SEAT SELECTION with marking
document.getElementsByClassName("btn_showSeat")[0].addEventListener('click', showSeatTable);

function showSeatTable() {
    // Initialize seat selection
    currentSeatPersonIndex = 0;
    currentSeatTripType = 'departure';
    SeatOfPeopleDeparture = [];
    SeatOfPeopleReturn = [];
    ChooseSeat = [];
    tempSelectedSeats = []; // Reset temporary selections

    const seatTable = document.getElementById("showSeatOfFlightTable");
    seatTable.style.display = "block";
    const width = seatTable.offsetWidth;
    const height = seatTable.offsetHeight;
    seatTable.style.display = "grid";
    seatTable.style.gridTemplateRows = "10% 10% 10% 60% 10%";

    updateSeatSelection();
    seatTable.style.left = `calc(50% - ${width / 2}px)`;
    seatTable.style.top = `calc(50% - ${height / 2}px)`;
    createSeat();

    document.addEventListener("click", function (event) {
        const btn = document.querySelector(".btn_showSeat");
        if (!seatTable.contains(event.target) && !btn.contains(event.target)) {
            seatTable.style.display = "none";
        }
    });
}

function updateSeatSelection() {
    const seatContainer = document.querySelector('.NameOfCustomer');

    seatContainer.innerHTML = '';
    seatContainer.classList.add('CardToChooseSeat');

    if (listCustomer.length > 0 && currentSeatPersonIndex < listCustomer.length) {
        const personName = listCustomer[currentSeatPersonIndex].fullName;
        const tripText = currentSeatTripType === 'departure' ? 'chuyến đi' : 'chuyến về';

        // Show progress and current selection
        const totalSteps = isRoundTrip ? countPeople * 2 : countPeople;
        const currentStep = currentSeatTripType === 'departure' ?
            currentSeatPersonIndex + 1 :
            countPeople + currentSeatPersonIndex + 1;

        seatContainer.innerHTML = `
            <div style="text-align: center;">
                <h3>Chọn ghế cho ${personName}</h3>
                <p>${tripText} - Bước ${currentStep}/${totalSteps}</p>
                <div style="font-size: 0.9em; color: #666; margin-top: 10px;">
                    <span style="display: inline-block; width: 15px; height: 15px; background: #95a5a6; margin-right: 5px; border-radius: 3px;"></span> Trống
                        <span style="display: inline-block; width: 15px; height: 15px; background: #e74c3c; margin: 0 5px; border-radius: 3px;"></span> Đã đặt
                        <span style="display: inline-block; width: 15px; height: 15px; background: #4ecdc4; margin: 0 5px; border-radius: 3px;"></span> Đang chọn
                        <span style="display: inline-block; width: 15px; height: 15px; background: #f39c12; margin: 0 5px; border-radius: 3px;"></span> Đã chọn
                </div>
            </div>
        `;
    }
}

function getPeopleCount() {
    const searchFormData = JSON.parse(sessionStorage.getItem('search-form-data'));
    if (!searchFormData) {
        return 0;
    }
    const { adultNumber, childNumber, infantNumber } = searchFormData;
    return adultNumber + childNumber + infantNumber;
}

const btn_submitSeatTable = document.querySelector(".btn_submitSeatTable");
btn_submitSeatTable.addEventListener("click", () => {
    const totalSelections = isRoundTrip ? countPeople * 2 : countPeople;
    const currentSelections = SeatOfPeopleDeparture.length + SeatOfPeopleReturn.length;

    if (currentSelections === totalSelections) {
        // Reset selection
        SeatOfPeopleDeparture = [];
        SeatOfPeopleReturn = [];
        tempSelectedSeats = [];
        currentSeatPersonIndex = 0;
        currentSeatTripType = 'departure';
        btn_submitSeatTable.textContent = "Xác nhận";
        resetSeat();
        updateSeatSelection();
        createSeat();
    } else {
        // Confirm seat selection for current person and trip
        if (ChooseSeat.length > 0) {
            const selectedSeatNumber = parseInt(ChooseSeat[0].textContent);
            const seatKey = `${currentSeatTripType}_${selectedSeatNumber}`;

            // Check if seat is already selected by someone else in this session
            if (tempSelectedSeats.includes(seatKey)) {
                alert("Ghế này đã được chọn bởi hành khách khác, vui lòng chọn ghế khác.");
                return;
            }

            // Add to temporary selections
            tempSelectedSeats.push(seatKey);

            // Add seat to appropriate list
            if (currentSeatTripType === 'departure') {
                SeatOfPeopleDeparture.push(selectedSeatNumber);
            } else {
                SeatOfPeopleReturn.push(selectedSeatNumber);
            }

            // Recalculate seat price immediately
            calculateSeatPrice();
            updateTotalPrice();

            // Move to next selection
            moveToNextSeatSelection();
        } else {
            alert("Vui lòng chọn một ghế.");
        }
    }
});

function moveToNextSeatSelection() {
    // UPDATED LOGIC: Similar to baggage - all departure first, then all return
    if (currentSeatTripType === 'departure') {
        // Move to next person in departure
        currentSeatPersonIndex++;

        if (currentSeatPersonIndex >= countPeople) {
            // All departure selections done
            if (isRoundTrip) {
                // Switch to return trip, start from first person
                currentSeatTripType = 'return';
                currentSeatPersonIndex = 0;
                updateSeatSelection();
                createSeat();
                clearCurrentSelection();
            } else {
                // Single trip, finish
                finalizeSeatSelection();
                return;
            }
        } else {
            updateSeatSelection();
            createSeat();
            clearCurrentSelection();
        }
    } else {
        // Return trip
        currentSeatPersonIndex++;

        if (currentSeatPersonIndex >= countPeople) {
            // All return selections done
            finalizeSeatSelection();
        } else {
            updateSeatSelection();
            createSeat();
            clearCurrentSelection();
        }
    }
}

function finalizeSeatSelection() {
    btn_submitSeatTable.textContent = "Hủy bỏ";
    sessionStorage.setItem("SeatOfPeopleDeparture", JSON.stringify(SeatOfPeopleDeparture));
    sessionStorage.setItem("SeatOfPeopleReturn", JSON.stringify(SeatOfPeopleReturn));

    // Calculate seat price
    calculateSeatPrice();
    updateTotalPrice();

    document.getElementById("showSeatOfFlightTable").style.display = "none";

    // Show detailed confirmation
    let message = "Đã chọn ghế cho tất cả hành khách!\n\n";
    message += "Chuyến đi: " + SeatOfPeopleDeparture.join(", ");
    if (isRoundTrip && SeatOfPeopleReturn.length > 0) {
        message += "\nChuyến về: " + SeatOfPeopleReturn.join(", ");
    }
    alert(message);
}

function clearCurrentSelection() {
    if (ChooseSeat.length > 0) {
        ChooseSeat[0].classList.remove("SeatSquare_Choose");
        ChooseSeat = [];
    }
}

const btn_closeSeatTable = document.querySelector(".btn_closeSeatTable");
btn_closeSeatTable.addEventListener("click", () => {
    const seatTable = document.getElementById("showSeatOfFlightTable");
    seatTable.style.display = "none";
    SeatOfPeopleDeparture = [];
    SeatOfPeopleReturn = [];
    ChooseSeat = [];
    tempSelectedSeats = [];
    currentSeatPersonIndex = 0;
    currentSeatTripType = 'departure';
    btn_submitSeatTable.textContent = "Xác nhận";
});

function bookedSeat(element) {
    const totalSelections = isRoundTrip ? countPeople * 2 : countPeople;
    const currentSelections = SeatOfPeopleDeparture.length + SeatOfPeopleReturn.length;

    if (currentSelections === totalSelections) {
        return;
    }

    if (!ChooseSeat.includes(element)) {
        // Clear previous selection
        if (ChooseSeat.length !== 0) {
            ChooseSeat[0].classList.remove("SeatSquare_Choose");
            ChooseSeat = [];
        }

        // Select new seat
        element.classList.add("SeatSquare_Choose");
        ChooseSeat.push(element);
    }
}

function resetSeat() {
    const seatTable = document.getElementsByClassName("SeatTable")[0];
    const allSeats = seatTable.getElementsByClassName("SeatSquare");

    for (let seat of allSeats) {
        seat.classList.remove("SeatSquare_Choose", "SeatSquare_TempSelected");
    }
}

function createSeat() {
    const seatContainer = document.getElementsByClassName("SeatTable")[0];

    // Clear existing seats
    seatContainer.innerHTML = '';

    // Get the appropriate flight and seat list based on current trip type
    let currentFlight, currentSeatList, seatCount;

    if (currentSeatList[i].status === "BOOKED") {
        seat.classList.add("SeatSquare_Choosen");
        seat.classList.add("no-hover");
        seat.style.backgroundColor = "#e74c3c"; // Đỏ đậm hơn cho ghế đã book
        seat.style.color = "white";
    }
    else if (tempSelectedSeats.includes(seatKey)) {
        seat.classList.add("SeatSquare_TempSelected");
        seat.classList.add("no-hover");
        seat.style.backgroundColor = "#f39c12"; // Cam đậm thay vì vàng nhạt
        seat.style.color = "white";
        seat.style.fontWeight = "bold";
    }

    for (let i = 0; i < seatCount; i++) {
        const seat = document.createElement("div");
        seat.classList.add("SeatSquare");
        seat.classList.add("SeatOnFlight");

        const seatNumber = i + 1;
        const seatKey = `${currentSeatTripType}_${seatNumber}`;

        // Check if seat is booked in system
        if (currentSeatList[i].status === "BOOKED") {
            seat.classList.add("SeatSquare_Choosen");
            seat.classList.add("no-hover");
            seat.style.backgroundColor = "#ff6b6b"; // Red for booked
        }
        // Check if seat is temporarily selected by other passengers in current session
        else if (tempSelectedSeats.includes(seatKey)) {
            seat.classList.add("SeatSquare_TempSelected");
            seat.classList.add("no-hover");
            seat.style.backgroundColor = "#ffe66d"; // Yellow for temp selected
        }
        else {
            // Available seat
            if (currentSeatList[i].seat.seatType === "VIP") {
                seat.classList.add("SeatSquare_VIP");
            } else {
                seat.classList.add("SeatSquare_Common");
            }
            seat.addEventListener("click", () => {
                bookedSeat(seat);
            });
        }

        seat.textContent = seatNumber;
        seatContainer.appendChild(seat);
    }
}

document.querySelector(".btn_continue").addEventListener("click", () => {
    window.location.href = 'ThanhToan.html';
});