// import "../../../APIs/flights_seat.js";
import { getListSeatOnFlight } from "../../../APIs/flights_seat.js";
import { setStatusSeat } from "../../../APIs/flights_seat.js";
let listCustomer = [];
let ListSeatOnFlight = [];
let dataFlight;
let isRoundTrip = false;
let currentDirection = 'departure'; // 'departure' hoặc 'return'
let currentPersonIndex = 0;
let currentFlightIndex = 0; // 0: chiều đi, 1: chiều về

// Khởi tạo session storage cho 2 chiều
// Chỉ khởi tạo session storage nếu chưa có dữ liệu
if (!sessionStorage.getItem("SeatOfPeopleDeparture")) {
    sessionStorage.setItem("SeatOfPeopleDeparture", JSON.stringify([]));
}
if (!sessionStorage.getItem("SeatOfPeopleReturn")) {
    sessionStorage.setItem("SeatOfPeopleReturn", JSON.stringify([]));
}
if (!sessionStorage.getItem("BaggageListDeparture")) {
    sessionStorage.setItem("BaggageListDeparture", JSON.stringify([]));
}
if (!sessionStorage.getItem("BaggageListReturn")) {
    sessionStorage.setItem("BaggageListReturn", JSON.stringify([]));
}
if (!sessionStorage.getItem("PriceListPerPerson")) {
    sessionStorage.setItem("PriceListPerPerson", JSON.stringify([]));
}

let countPeople = Number(getPeopleCount()); // Lấy số lượng người từ dữ liệu tìm kiếm
const BaggageList = [];
const defaultBaggage = {
    weight: 10,
    price: 0,
    displayText: "Hành lý 10kg (Miễn phí)"
};
for (let i = 0; i < countPeople; i++) { // Khởi tạo danh sách hành lý mặc định cho mỗi người
    BaggageList.push(defaultBaggage);
}
sessionStorage.setItem("BaggageListDeparture", JSON.stringify(BaggageList));
sessionStorage.setItem("BaggageListReturn", JSON.stringify(BaggageList));
function restoreSelectionState() {
    const departureSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleDeparture")) || [];
    const returnSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleReturn")) || [];

    // Khôi phục trạng thái chọn ghế
    if (departureSeats.length === countPeople && (!isRoundTrip || returnSeats.length === countPeople)) {
        // Đã hoàn thành chọn ghế
        currentDirection = 'departure';
        currentPersonIndex = 0;
    } else if (departureSeats.length === countPeople && isRoundTrip) {
        // Đã chọn xong chiều đi, đang chọn chiều về
        currentDirection = 'return';
        currentPersonIndex = returnSeats.length;
    } else {
        // Đang chọn chiều đi
        currentDirection = 'departure';
        currentPersonIndex = departureSeats.length;
    }
}
window.addEventListener('load', async () => {
    listCustomer = JSON.parse(sessionStorage.getItem('customerData')) || [];
    dataFlight = JSON.parse(sessionStorage.getItem("customerSelectedFlight"));
    const searchData = JSON.parse(sessionStorage.getItem('search-form-data'));
    isRoundTrip = searchData && searchData.isRoundTrip;

    await loadListSeatOnFlight();
    createViewFlights();
    createSeat();

    // Khôi phục trạng thái selection hiện tại
    restoreSelectionState();

    // Khởi tạo hành lý chỉ khi chưa có dữ liệu
    initializeBaggageForBothDirectionsIfNeeded();

    // Khôi phục và tính toán lại giá cho tất cả hành khách
    recalculateAllPersonPrices();

    updatePriceDisplay();
    updateAllSelectedServicesDisplay();
});
async function loadListSeatOnFlight() {
    ListSeatOnFlight = await getListSeatOnFlight(dataFlight.departureFlightASeat.flight.idFlight);
}
function initializeBaggageForBothDirectionsIfNeeded() {
    // Lấy dữ liệu hiện tại từ session
    let departureBaggage = JSON.parse(sessionStorage.getItem("BaggageListDeparture"));
    let returnBaggage = JSON.parse(sessionStorage.getItem("BaggageListReturn"));
    let priceList = JSON.parse(sessionStorage.getItem("PriceListPerPerson"));

    // Chỉ khởi tạo nếu chưa có dữ liệu hoặc dữ liệu không đủ
    if (!departureBaggage || departureBaggage.length !== countPeople) {
        const defaultDepartureBaggage = Array(countPeople).fill({ ...defaultBaggage });
        sessionStorage.setItem("BaggageListDeparture", JSON.stringify(defaultDepartureBaggage));
    }

    if (isRoundTrip && (!returnBaggage || returnBaggage.length !== countPeople)) {
        const defaultReturnBaggage = Array(countPeople).fill({ ...defaultBaggage });
        sessionStorage.setItem("BaggageListReturn", JSON.stringify(defaultReturnBaggage));
    }

    // Khởi tạo PriceListPerPerson nếu chưa có hoặc không đủ
    if (!priceList || priceList.length !== countPeople) {
        const defaultPersonPrice = {
            baseFare: 0,
            seatFee: 0,
            baggageFee: 0,
            totalPrice: 0
        };
        const defaultPriceList = Array(countPeople).fill({ ...defaultPersonPrice });
        sessionStorage.setItem("PriceListPerPerson", JSON.stringify(defaultPriceList));
    }
}
function recalculateAllPersonPrices() {
    // Tính toán lại giá cho tất cả hành khách dựa trên dữ liệu đã lưu
    for (let i = 0; i < countPeople; i++) {
        updatePersonPrice(i);
    }
}
function initializeBaggageForBothDirections() {
    const departureBaggage = Array(countPeople).fill(defaultBaggage);
    sessionStorage.setItem("BaggageListDeparture", JSON.stringify(departureBaggage));

    if (isRoundTrip) {
        const returnBaggage = Array(countPeople).fill(defaultBaggage);
        sessionStorage.setItem("BaggageListReturn", JSON.stringify(returnBaggage));
    }
    const defaultPersonPrice = {
        baseFare: 0,
        seatFee: 0,
        baggageFee: 0,
        totalPrice: 0
    };
    const priceList = Array(countPeople).fill(defaultPersonPrice);
    sessionStorage.setItem("PriceListPerPerson", JSON.stringify(priceList));
}
function createViewFlights() {
    const parentNode = document.body.querySelector('.section');
    // const customerSelectedFlight = JSON.parse(sessionStorage.getItem('customerSelectedFlight'));
    parentNode.appendChild(createViewFlight(dataFlight.departureFlightASeat.flight, dataFlight.departureFlightASeat.styleSeat));
    if (dataFlight.returnFlightASeat != null) {
        parentNode.appendChild(createViewFlight(dataFlight.returnFlightASeat.flight, dataFlight.returnFlightASeat.styleSeat));
    }
}
function createViewFlight(flight, styleSeat) {
    const viewFlistBox = document.createElement('div');
    viewFlistBox.className = 'section-content';

    // Tính thời gian bay
    const departure = new Date(`${flight.departureDate}T${flight.departureTime}`);
    const arrival = new Date(`${flight.arrivalDate}T${flight.estimatedArrivalTime}`);
    const diffMs = arrival - departure;
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    // Format ngày bay (ví dụ: Thứ Bảy, 10 tháng 5, 2025)
    const dayOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = departure.toLocaleDateString('vi-VN', dayOptions);


    return viewFlistBox;
}

function payment() {
    window.location.href = 'thongTinThanhToan.html';
}

window.onload = function () {// Hiện ra một số thông tin 
    // Hiện ra thông tin hành khách 
    // -customerData:
    // 	+fullName
    // 	+birthdate
    // -contactInfo
    // list các hành khác 
    const customer = JSON.parse(sessionStorage.getItem("customerData") || "{}");
    const contact = JSON.parse(sessionStorage.getItem("contactInfo") || "{}");

    if (customer == null || contact == null) {
        alert("Bạn chưa nhập thông tin hành khách");
        window.location.href = 'nhapThongTin.html';
    }


    const showAboutCustomer = customer.map((person, index) => {
        if (person.type === "infant") {
            // Trẻ sơ sinh chỉ cần họ tên và ngày sinh
            return `
        <div class="flight-section">
            <h3>👶 Trẻ sơ sinh ${index + 1}</h3>
            <p><strong>👤 Họ Tên:</strong> ${person.fullName || "?"}</p>
            <p><strong>📅 Ngày Sinh:</strong> ${person.birthDate || "?"}</p>
        </div>
        `;
        } else {
            // Người lớn và trẻ em cần đủ thông tin
            return `
        <div class="flight-section">
            <h3>🧍‍♂️ Hành khách ${index + 1}</h3>
            <p><strong>👤 Họ Tên:</strong> ${person.fullName || "?"}</p>
            <p><strong>📅 Ngày Sinh:</strong> ${person.birthDate || "?"}</p>
            <p><strong>🪪 CCCD / Hộ Chiếu:</strong> ${person.cardNumber || "?"}</p>
            <p><strong>⚧️ Giới tính:</strong> ${person.sex || "?"}</p>
        </div>
        `;
        }
    }).join("");


    document.querySelector(".customerInfo").innerHTML = showAboutCustomer;

    //Thông tin liên lạc người đặt vé 
    const showContact = `
        <div class="flight-section">
            <p><strong>📧 Email:</strong> ${contact.email || "?"}</p>
            <p><strong>📞 Số điện thoạiNgày Sinh:</strong> ${contact.phone || "?"}</p>
        </div>
    `;
    document.querySelector(".bookingInfo").innerHTML = showContact;
    // Thông tin điểm đi - đến 
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

//click để hiện ra chọn dịch vụ hành lí 
function resetBaggageSelection() {
    currentPersonIndex = 0; // Luôn bắt đầu từ người đầu tiên
    currentDirection = 'departure'; // Luôn bắt đầu từ chiều đi
}
document.querySelector(".showBaggageInfo").addEventListener("click", showPopup);
function showPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "block";
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    popup.style.display = "grid";
    popup.style.gridTemplateRows = "10% 10% 70% 10%";
    popup.style.left = `calc(50% - ${width / 2}px)`;
    popup.style.top = `calc(50% - ${height / 2}px)`;

    // THÊM: Reset về trạng thái ban đầu khi mở popup
    resetBaggageSelection();

    // Hiển thị thông tin người và chiều hiện tại
    updateBaggagePopupInfo();

    document.addEventListener("click", function (event) {
        const b = document.querySelector(".showBaggageInfo");
        if (!popup.contains(event.target) && !b.contains(event.target)) {
            popup.style.display = "none";
        }
    });
}

function updateBaggagePopupInfo() {
    const directionText = currentDirection === 'departure' ? 'Chiều đi' : 'Chiều về';
    const personName = listCustomer[currentPersonIndex]?.fullName || `Người ${currentPersonIndex + 1}`;

    document.querySelector(".CardName").innerHTML = `
        <h3>${directionText} - ${personName}</h3>
        <p>Chọn hành lý cho: ${personName}</p>
    `;
}
document.getElementById("closeShowPopup").addEventListener("click", closePopup);
function closePopup() {
    document.getElementById("popup").style.display = "none";
}
//  sessionStorage.setItem('customerSelectedFlight', JSON.stringify({ departureFlightASeat, returnFlightASeat }))


document.getElementsByClassName("BaggageCard_3")[0].addEventListener('click', () => {
    SelectBaggage(3);
});
document.getElementsByClassName("BaggageCard_2")[0].addEventListener('click', () => {
    SelectBaggage(2);
});
document.getElementsByClassName("BaggageCard_1")[0].addEventListener('click', () => {
    SelectBaggage(1);
});
let baggageIndex = 0;
function SelectBaggage(option) {
    let baggage = {};

    switch (option) {
        case 1: // 10kg miễn phí
            baggage = {
                weight: 10,
                price: 0,
                displayText: "Hành lý 10kg (Miễn phí)"
            };
            break;
        case 2: // 20kg - 300k
            baggage = {
                weight: 20,
                price: 300000,
                displayText: "Hành lý 20kg (300,000 VNĐ)"
            };
            break;
        case 3: // 30kg - 400k
            baggage = {
                weight: 30,
                price: 400000,
                displayText: "Hành lý 30kg (400,000 VNĐ)"
            };
            break;
    }

    // Lưu hành lý đã chọn
    const sessionKey = currentDirection === 'departure' ? "BaggageListDeparture" : "BaggageListReturn";
    let baggageList = JSON.parse(sessionStorage.getItem(sessionKey)) || [];
    baggageList[currentPersonIndex] = baggage;
    sessionStorage.setItem(sessionKey, JSON.stringify(baggageList));
    updatePersonPrice(currentPersonIndex);
    // Chuyển sang người/chiều tiếp theo
    moveToNextBaggageSelection();
    updatePriceDisplay();
}

let SeatOfPeple = []; // Lưu số ghế của người đã chọn

let flag = false;
// nên lưu vào session , khi nào người dùng thanh toán thì mới add vào csdl 
// Chuyển màu sang đang chọn , lưu vào session (nếu người dùng thành toán thì mới lưu vào csdl)
let ChooseSeat = [];
document.getElementsByClassName("btn_showSeat")[0].addEventListener('click', showSeatTable);
function showSeatTable() {
    const seatTable = document.getElementById("showSeatOfFlightTable");
    seatTable.style.display = "block";
    seatTable.style.display = "grid";
    seatTable.style.gridTemplateRows = "5% 5% 10% 10% 60% 10%"; // Thêm 1 hàng cho tabs
    const width = seatTable.offsetWidth;
    const height = seatTable.offsetHeight;

    // Kiểm tra trạng thái hiện tại
    checkCurrentSeatSelectionStatus();

    // Hiển thị/ẩn tab chiều về
    setupDirectionTabs();

    createCardToChooseSeat(currentPersonIndex);
    updateSeatSelectionInfo();

    seatTable.style.left = `calc(50% - ${width / 2}px)`;
    seatTable.style.top = `calc(50% - ${height / 2}px)`;

    // Load lại ghế cho chuyến bay hiện tại
    loadSeatsForCurrentFlight();

    document.addEventListener("click", function (event) {
        const b = document.querySelector(".btn_showSeat");
        if (!seatTable.contains(event.target) && !b.contains(event.target)) {
            seatTable.style.display = "none";
        }
    });
}
function setupDirectionTabs() {
    const departureTab = document.querySelector('[data-direction="departure"]');
    const returnTab = document.querySelector('[data-direction="return"]');

    // Hiển thị tab chiều về nếu là vé khứ hồi
    if (isRoundTrip) {
        returnTab.style.display = 'block';
    } else {
        returnTab.style.display = 'none';
    }

    // Cập nhật trạng thái active
    updateTabActiveStatus();

    // Thêm event listeners
    departureTab.addEventListener('click', () => switchDirection('departure'));
    returnTab.addEventListener('click', () => switchDirection('return'));
}
function switchDirection(direction) {
    if (currentDirection === direction) return; // Không làm gì nếu đã ở direction đó

    // Lưu trạng thái ghế đang chọn hiện tại (nếu có)
    if (ChooseSeat.length > 0) {
        ChooseSeat[0].classList.remove("SeatSquare_Choose");
        ChooseSeat = [];
    }

    // Chuyển direction
    currentDirection = direction;

    // Cập nhật index người chọn ghế
    const sessionKey = direction === 'departure' ? "SeatOfPeopleDeparture" : "SeatOfPeopleReturn";
    const selectedSeats = JSON.parse(sessionStorage.getItem(sessionKey)) || [];
    currentPersonIndex = selectedSeats.length;

    // Cập nhật giao diện
    updateTabActiveStatus();
    updateSeatSelectionInfo();
    loadSeatsForCurrentFlight();

    // Cập nhật card chọn ghế
    if (currentPersonIndex < countPeople) {
        createCardToChooseSeat(currentPersonIndex);
        btn_submitSeatTable.textContent = "Xác nhận";
    } else {
        const seatContainer = document.querySelector('.NameOfCustomer');
        seatContainer.innerHTML = '<h3>✅ Đã hoàn thành chọn ghế</h3>';
        btn_submitSeatTable.textContent = "Hủy bỏ";
    }
}
function updateTabActiveStatus() {
    const departureTab = document.querySelector('[data-direction="departure"]');
    const returnTab = document.querySelector('[data-direction="return"]');

    // Xóa active class
    departureTab.classList.remove('active');
    returnTab.classList.remove('active');

    // Thêm active class cho tab hiện tại
    if (currentDirection === 'departure') {
        departureTab.classList.add('active');
    } else {
        returnTab.classList.add('active');
    }
}
function updateSeatSelectionInfo() {
    const directionText = currentDirection === 'departure' ? 'Chiều đi' : 'Chiều về';
    const titleElement = document.querySelector(".SeatTableTitle");
    titleElement.textContent = `Chọn vị trí yêu thích - ${directionText}`;
}//12 
async function loadSeatsForCurrentFlight() {
    const flightId = currentDirection === 'departure'
        ? dataFlight.departureFlightASeat.flight.idFlight
        : dataFlight.returnFlightASeat.flight.idFlight;

    ListSeatOnFlight = await getListSeatOnFlight(flightId);

    // Kiểm tra xem ghế đã được tạo chưa
    const seatContainer = document.getElementsByClassName("SeatTable")[0];
    const existingSeats = seatContainer.querySelectorAll('.SeatSquare');

    if (existingSeats.length === 0) {
        // Chỉ tạo ghế nếu chưa có
        createSeat();
    } else {
        // Cập nhật trạng thái ghế hiện có
        updateExistingSeats();
    }

    // Hiển thị ghế đã chọn trước đó
    displayPreviouslySelectedSeats();
}
function updateExistingSeats() {
    const seatContainer = document.getElementsByClassName("SeatTable")[0];
    const existingSeats = seatContainer.querySelectorAll('.SeatSquare');

    existingSeats.forEach((seat, index) => {
        // Reset classes
        seat.classList.remove("SeatSquare_Choose", "SeatSquare_Choosen", "SeatSquare_VIP", "SeatSquare_Common", "no-hover");

        // Xóa event listeners cũ
        const newSeat = seat.cloneNode(true);
        seat.parentNode.replaceChild(newSeat, seat);

        // Cập nhật trạng thái mới
        if (ListSeatOnFlight[index].status === "BOOKED") {
            newSeat.classList.add("SeatSquare_Choosen");
            newSeat.classList.add("no-hover");
        } else {
            if (ListSeatOnFlight[index].seat.seatType === "VIP") {
                newSeat.classList.add("SeatSquare_VIP");
            } else {
                newSeat.classList.add("SeatSquare_Common");
            }

            // Thêm event listener cho ghế có thể chọn
            const sessionKey = currentDirection === 'departure' ? "SeatOfPeopleDeparture" : "SeatOfPeopleReturn";
            const selectedSeats = JSON.parse(sessionStorage.getItem(sessionKey)) || [];

            if (!selectedSeats.includes((index + 1).toString())) {
                newSeat.addEventListener("click", () => {
                    bookedSeat(newSeat);
                });
            }
        }
    });
}
// 1 
function displayPreviouslySelectedSeats() {
    const sessionKey = currentDirection === 'departure' ? "SeatOfPeopleDeparture" : "SeatOfPeopleReturn";
    const selectedSeats = JSON.parse(sessionStorage.getItem(sessionKey)) || [];

    // Đánh dấu tất cả ghế đã chọn trước đó
    selectedSeats.forEach(seatNumber => {
        const seatElement = document.querySelector(`[data-seat-number="${seatNumber}"]`);
        if (seatElement) {
            seatElement.classList.remove("SeatSquare_Common", "SeatSquare_VIP");
            seatElement.classList.add("SeatSquare_Choose");
            seatElement.classList.add("no-hover");
            // Xóa tất cả event listener của ghế này
            seatElement.replaceWith(seatElement.cloneNode(true));
        }
    });

    // Nếu đang trong quá trình chọn (chưa hoàn thành), hiển thị người hiện tại
    if (btn_submitSeatTable.textContent === "Xác nhận") {
        createCardToChooseSeat(currentPersonIndex);
    }
}
function checkCurrentSeatSelectionStatus() {
    const departureSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleDeparture")) || [];
    const returnSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleReturn")) || [];

    // Kiểm tra xem đã hoàn thành chọn ghế chưa
    const isDepartureComplete = departureSeats.length === countPeople;
    const isReturnComplete = !isRoundTrip || returnSeats.length === countPeople;

    if (isDepartureComplete && isReturnComplete) {
        // Đã chọn xong tất cả ghế
        btn_submitSeatTable.textContent = "Hủy bỏ";
        currentDirection = 'departure';
        currentPersonIndex = 0;
    } else if (isDepartureComplete && isRoundTrip) {
        // Chọn xong chiều đi, đang chọn chiều về
        currentDirection = 'return';
        currentPersonIndex = returnSeats.length;
        btn_submitSeatTable.textContent = "Xác nhận";
    } else {
        // Đang chọn chiều đi
        currentDirection = 'departure';
        currentPersonIndex = departureSeats.length;
        btn_submitSeatTable.textContent = "Xác nhận";
    }
}
function getPeopleCount() {
    const searchFormData = JSON.parse(sessionStorage.getItem('search-form-data'));
    if (!searchFormData) {
        return 0; // Không có dữ liệu tìm kiếm
    }
    const { adultNumber, childNumber, infantNumber } = searchFormData;
    return adultNumber + childNumber + infantNumber;
}
let index = 0;
/////
const btn_submitSeatTable = document.querySelector(".btn_submitSeatTable");
btn_submitSeatTable.addEventListener("click", () => {
    if (btn_submitSeatTable.textContent === "Hủy bỏ") {
        // Reset tất cả khi nhấn Hủy bỏ
        sessionStorage.setItem("SeatOfPeopleDeparture", JSON.stringify([]));
        if (isRoundTrip) {
            sessionStorage.setItem("SeatOfPeopleReturn", JSON.stringify([]));
        }
        currentPersonIndex = 0;
        currentFlightIndex = 0;
        currentDirection = 'departure';
        btn_submitSeatTable.textContent = "Xác nhận";

        // Reset hiển thị và load lại ghế
        resetSeat();
        loadSeatsForCurrentFlight();
        createCardToChooseSeat(currentPersonIndex);
        updateAllSelectedServicesDisplay();
        return;
    }

    // Logic chọn ghế bình thường
    const sessionKey = currentDirection === 'departure' ? "SeatOfPeopleDeparture" : "SeatOfPeopleReturn";
    let currentSeatList = JSON.parse(sessionStorage.getItem(sessionKey)) || [];

    // Kiểm tra và lưu ghế đã chọn
    if (ChooseSeat.length > 0) {
        const seatNumber = ChooseSeat[0].textContent;
        if (!currentSeatList.includes(seatNumber)) {
            currentSeatList.push(seatNumber);
            sessionStorage.setItem(sessionKey, JSON.stringify(currentSeatList));

            // Đánh dấu ghế đã chọn vĩnh viễn
            ChooseSeat[0].classList.remove("SeatSquare_Choose", "SeatSquare_Common", "SeatSquare_VIP");
            ChooseSeat[0].classList.add("SeatSquare_Choose", "no-hover");
            ChooseSeat[0].removeEventListener("click", () => bookedSeat(ChooseSeat[0]));
        } else {
            alert("Ghế đã được chọn, vui lòng chọn ghế khác.");
            return;
        }
    } else {
        alert("Vui lòng chọn một ghế trước khi xác nhận.");
        return;
    }

    // Reset ghế đang chọn
    ChooseSeat = [];

    // Chuyển sang người tiếp theo
    moveToNextSeatSelection();
});
function moveToNextBaggageSelection() {
    currentPersonIndex++;

    // Nếu đã chọn xong tất cả người trong chiều hiện tại
    if (currentPersonIndex >= countPeople) {
        if (isRoundTrip && currentDirection === 'departure') {
            // Chuyển sang chiều về
            currentDirection = 'return';
            currentPersonIndex = 0;
            updateBaggagePopupInfo();
        } else {
            // Hoàn thành - đóng popup
            closePopup();
        }
    } else {
        // Chuyển sang người tiếp theo trong cùng chiều
        updateBaggagePopupInfo();
    }

    updateAllSelectedServicesDisplay();
}
function moveToNextSeatSelection() {
    updatePersonPrice(currentPersonIndex);
    currentPersonIndex++;

    if (currentPersonIndex >= countPeople) {
        if (isRoundTrip && currentDirection === 'departure') {
            // Chuyển sang chiều về
            currentDirection = 'return';
            currentFlightIndex = 1;
            currentPersonIndex = 0;
            updateSeatSelectionInfo();
            loadSeatsForCurrentFlight();
        } else {
            // Hoàn thành chọn ghế - đổi nút thành "Hủy bỏ"
            btn_submitSeatTable.textContent = "Hủy bỏ";

            // Ẩn card chọn ghế cho người
            const seatContainer = document.querySelector('.NameOfCustomer');
            seatContainer.innerHTML = '<h3>✅ Đã hoàn thành chọn ghế</h3>';

            // Có thể tự động đóng popup sau vài giây
            setTimeout(() => {
                document.getElementById("showSeatOfFlightTable").style.display = "none";
            }, 1500);
        }
    } else {
        createCardToChooseSeat(currentPersonIndex);
        // updatePersonPrice(currentPersonIndex - 1);

    }
    updateAllSelectedServicesDisplay();
}
const btn_closeSeatTable = document.querySelector(".btn_closeSeatTable");
btn_closeSeatTable.addEventListener("click", () => {
    const a = document.getElementById("showSeatOfFlightTable");
    a.style.display = "none";
    SeatOfPeple = [];
    ChooseSeat = [];
    index = 0;
});
function createCardToChooseSeat(index) {
    // const seatCount = getPeopleCount();
    const seatContainer = document.querySelector('.NameOfCustomer');
    seatContainer.innerHTML = '';
    seatContainer.classList.add('CardToChooseSeat');
    // if (listCustomer.length === 0) {
    //     alert("Dell co du lieu")
    // }
    seatContainer.textContent = "Chọn ghế cho " + listCustomer[index].fullName;
    // seatContainer.appendChild(seatCard);
}
function bookedSeat(element) {
    // nếu chưa có 
    // chuyển màu trong choose -> cho chóose rỗng 
    // chuyển màu elemtn -> add vào chooose 
    // nếu có rồi thì không làm gì  
    // nếu xác nhận được nhấn thì thêm element vao SeatOfPeople 
    if (index === countPeople) {
        return;
    }
    if (!ChooseSeat.includes(element)) {
        if (ChooseSeat.length !== 0) {
            if (!SeatOfPeple.includes(ChooseSeat[0].textContent)) {
                ChooseSeat[0].classList.remove("SeatSquare_Choose");
            }
            ChooseSeat = [];

        } element.classList.add("SeatSquare_Choose");
        ChooseSeat.push(element);
    }
}
function resetSeat() {
    const seatTable = document.getElementsByClassName("SeatTable")[0];
    const allSeats = seatTable.getElementsByClassName("SeatSquare");

    for (let seat of allSeats) {
        seat.classList.remove("SeatSquare_Choose");
    }
}
function createSeat() {
    const seatContainer = document.getElementsByClassName("SeatTable")[0];
    const currentFlightData = currentDirection === 'departure'
        ? dataFlight.departureFlightASeat.flight
        : dataFlight.returnFlightASeat.flight;
    const seatCount = currentFlightData.plane.seatCount;

    for (let i = 0; i < seatCount; i++) {
        const seat = document.createElement("div");
        seat.classList.add("SeatSquare");
        seat.classList.add("SeatOnFlight");
        seat.setAttribute("data-seat-number", i + 1);

        if (ListSeatOnFlight[i].status === "BOOKED") {
            seat.classList.add("SeatSquare_Choosen");
            seat.classList.add("no-hover");
        } else {
            if (ListSeatOnFlight[i].seat.seatType === "VIP") {
                seat.classList.add("SeatSquare_VIP");
            } else {
                seat.classList.add("SeatSquare_Common");
            }

            // Chỉ thêm event listener nếu không phải ghế đã chọn
            const sessionKey = currentDirection === 'departure' ? "SeatOfPeopleDeparture" : "SeatOfPeopleReturn";
            const selectedSeats = JSON.parse(sessionStorage.getItem(sessionKey)) || [];

            if (!selectedSeats.includes((i + 1).toString())) {
                seat.addEventListener("click", () => {
                    bookedSeat(seat);
                });
            }
        }
        seat.textContent = `${i + 1}`;
        seatContainer.appendChild(seat);
    }
}

// Hàm tính toán tổng giá vé
function calculateTotalPrice() {
    const priceList = JSON.parse(sessionStorage.getItem("PriceListPerPerson")) || [];
    let totalPrice = 0;

    priceList.forEach(personPrice => {
        totalPrice += personPrice.totalPrice || 0;
    });

    return totalPrice;
}

// Tính giá vé cơ bản
function calculateBaseFare(flightData, peopleCount) {
    let baseFare = 0;

    // Giá vé chiều đi
    const departureStyleSeat = flightData.departureFlightASeat.styleSeat;
    const departureFlight = flightData.departureFlightASeat.flight;

    if (departureStyleSeat === "vip") {
        baseFare += departureFlight.vipFare * peopleCount;
    } else {
        baseFare += departureFlight.commonFare * peopleCount;
    }

    // Giá vé chiều về (nếu có)
    if (flightData.returnFlightASeat) {
        const returnStyleSeat = flightData.returnFlightASeat.styleSeat;
        const returnFlight = flightData.returnFlightASeat.flight;

        if (returnStyleSeat === "vip") {
            baseFare += returnFlight.vipFare * peopleCount;
        } else {
            baseFare += returnFlight.commonFare * peopleCount;
        }
    }

    return baseFare;
}

// Tính phí chọn ghế
function calculateSeatFee(flightData, peopleCount) {
    let seatFee = 0;
    const departureStyleSeat = flightData.departureFlightASeat.styleSeat;
    const returnStyleSeat = flightData.returnFlightASeat?.styleSeat;

    // Lấy danh sách ghế đã chọn
    const departureSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleDeparture")) || [];
    const returnSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleReturn")) || [];

    // Tính phí ghế chiều đi
    if (departureSeats.length > 0) {
        seatFee += calculateDirectionSeatFee(departureSeats, departureStyleSeat, 'departure');
    }

    // Tính phí ghế chiều về
    if (returnSeats.length > 0 && returnStyleSeat) {
        seatFee += calculateDirectionSeatFee(returnSeats, returnStyleSeat, 'return');
    }

    return seatFee;
}

// Tính phí chọn ghế theo từng chiều
function calculateDirectionSeatFee(selectedSeats, passengerClass, direction) {
    let fee = 0;

    // Nếu hành khách đã chọn vé VIP thì miễn phí chọn ghế
    if (passengerClass === "vip") {
        return 0;
    }

    // Lấy thông tin ghế từ ListSeatOnFlight tương ứng
    const flightData = JSON.parse(sessionStorage.getItem('customerSelectedFlight'));
    const flightId = direction === 'departure'
        ? flightData.departureFlightASeat.flight.idFlight
        : flightData.returnFlightASeat.flight.idFlight;

    selectedSeats.forEach(seatNumber => {
        const seatIndex = parseInt(seatNumber) - 1;
        // Giả sử bạn có cách lấy thông tin ghế, hoặc có thể dựa vào pattern
        // Tạm thời dùng logic đơn giản: ghế VIP thường có số nhỏ hơn

        // Logic tạm thời: ghế 1-30 là VIP, còn lại là thường
        // Bạn có thể thay đổi logic này dựa trên dữ liệu thực tế
        if (seatIndex < 30) { // Ghế VIP
            fee += 100000; // 100k VND
        } else { // Ghế thường
            fee += 50000; // 50k VND
        }
    });

    return fee;
}
// Tính phí hành lý
function calculateBaggageFee(peopleCount) {
    let totalFee = 0;

    // Phí hành lý chiều đi
    const departureBaggage = JSON.parse(sessionStorage.getItem("BaggageListDeparture")) || [];
    departureBaggage.forEach(baggage => {
        totalFee += baggage.price || 0;
    });

    // Phí hành lý chiều về (nếu có)
    if (isRoundTrip) {
        const returnBaggage = JSON.parse(sessionStorage.getItem("BaggageListReturn")) || [];
        returnBaggage.forEach(baggage => {
            totalFee += baggage.price || 0;
        });
    }

    return totalFee;
}
function updatePersonPrice(personIndex) {
    const customerSelectedFlight = JSON.parse(sessionStorage.getItem('customerSelectedFlight'));
    let priceList = JSON.parse(sessionStorage.getItem("PriceListPerPerson")) || [];

    if (!priceList[personIndex]) {
        priceList[personIndex] = { baseFare: 0, seatFee: 0, baggageFee: 0, totalPrice: 0 };
    }

    let personPrice = { baseFare: 0, seatFee: 0, baggageFee: 0, totalPrice: 0 };

    // 1. Tính giá vé cơ bản (cả 2 chiều)
    const departureStyleSeat = customerSelectedFlight.departureFlightASeat.styleSeat;
    const departureFlight = customerSelectedFlight.departureFlightASeat.flight;

    if (departureStyleSeat === "vip") {
        personPrice.baseFare += departureFlight.vipFare;
    } else {
        personPrice.baseFare += departureFlight.commonFare;
    }

    // Thêm giá vé chiều về nếu có
    if (customerSelectedFlight.returnFlightASeat) {
        const returnStyleSeat = customerSelectedFlight.returnFlightASeat.styleSeat;
        const returnFlight = customerSelectedFlight.returnFlightASeat.flight;

        if (returnStyleSeat === "vip") {
            personPrice.baseFare += returnFlight.vipFare;
        } else {
            personPrice.baseFare += returnFlight.commonFare;
        }
    }

    // 2. Tính phí chọn ghế
    const departureSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleDeparture")) || [];
    const returnSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleReturn")) || [];

    // Phí ghế chiều đi
    if (departureSeats[personIndex] && departureStyleSeat !== "vip") {
        const seatNumber = parseInt(departureSeats[personIndex]);
        personPrice.seatFee += seatNumber <= 30 ? 100000 : 50000;
    }

    // Phí ghế chiều về
    if (returnSeats[personIndex] && customerSelectedFlight.returnFlightASeat) {
        const returnStyleSeat = customerSelectedFlight.returnFlightASeat.styleSeat;
        if (returnStyleSeat !== "vip") {
            const seatNumber = parseInt(returnSeats[personIndex]);
            personPrice.seatFee += seatNumber <= 30 ? 100000 : 50000;
        }
    }

    // 3. Tính phí hành lý
    const departureBaggage = JSON.parse(sessionStorage.getItem("BaggageListDeparture")) || [];
    const returnBaggage = JSON.parse(sessionStorage.getItem("BaggageListReturn")) || [];

    if (departureBaggage[personIndex]) {
        personPrice.baggageFee += departureBaggage[personIndex].price || 0;
    }

    if (returnBaggage[personIndex]) {
        personPrice.baggageFee += returnBaggage[personIndex].price || 0;
    }

    // Tính tổng
    personPrice.totalPrice = personPrice.baseFare + personPrice.seatFee + personPrice.baggageFee;

    // Cập nhật vào session
    priceList[personIndex] = personPrice;
    sessionStorage.setItem("PriceListPerPerson", JSON.stringify(priceList));
}
// Cập nhật giá hiển thị
function updatePriceDisplay() {
    const totalPrice = calculateTotalPrice();
    const priceElement = document.querySelector('.price-value');

    if (priceElement) {
        // Đảm bảo thay thế hoàn toàn, không cộng dồn
        priceElement.textContent = formatPrice(totalPrice) + ' VND';
    }

    // Cập nhật lại session với giá mới
    sessionStorage.setItem('totalPrice', totalPrice.toString());
}
// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}
// Thêm event listeners để cập nhật giá khi có thay đổi
document.addEventListener('DOMContentLoaded', function () {
    // Cập nhật giá ban đầu
    updatePriceDisplay();

    // Cập nhật khi đóng popup chọn ghế
    const seatPopup = document.getElementById("showSeatOfFlightTable");
    if (seatPopup) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (seatPopup.style.display === 'none') {
                        updatePriceDisplay();
                    }
                }
            });
        });
        observer.observe(seatPopup, { attributes: true });
    }

    // Cập nhật khi đóng popup chọn hành lý
    const baggagePopup = document.getElementById("popup");
    if (baggagePopup) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (baggagePopup.style.display === 'none') {
                        updatePriceDisplay();
                    }
                }
            });
        });
        observer.observe(baggagePopup, { attributes: true });
    }
});
document.querySelector(".btn_continue").addEventListener("click", () => {
    window.location.href = 'ThanhToan.html';
});

// Hàm hiển thị thông tin ghế ngồi đã chọn
function displaySelectedSeats() {
    if (listCustomer.length === 0) {
        listCustomer = JSON.parse(sessionStorage.getItem('customerData')) || [];
    }
    // Tạo div để hiển thị thông tin ghế
    let seatInfoHTML = '<div class="selected-seats-info">';

    // Lấy danh sách ghế chiều đi
    const departureSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleDeparture")) || [];
    if (departureSeats.length > 0) {
        seatInfoHTML += '<div class="seat-direction"><h4>🛫 Ghế đã chọn - Chiều đi:</h4>';
        departureSeats.forEach((seatNumber, index) => {
            const customerName = (listCustomer[index] && listCustomer[index].fullName) ? listCustomer[index].fullName : `Người ${index + 1}`; seatInfoHTML += `<div class="seat-item">👤 ${customerName}: Ghế số ${seatNumber}</div>`;
        });
        seatInfoHTML += '</div>';
    }

    // Lấy danh sách ghế chiều về (nếu có)
    if (isRoundTrip) {
        const returnSeats = JSON.parse(sessionStorage.getItem("SeatOfPeopleReturn")) || [];
        if (returnSeats.length > 0) {
            seatInfoHTML += '<div class="seat-direction"><h4>🛬 Ghế đã chọn - Chiều về:</h4>';
            returnSeats.forEach((seatNumber, index) => {
                const customerName = (listCustomer[index] && listCustomer[index].fullName) ? listCustomer[index].fullName : `Người ${index + 1}`; seatInfoHTML += `<div class="seat-item">👤 ${customerName}: Ghế số ${seatNumber}</div>`;
            });
            seatInfoHTML += '</div>';
        }
    }

    seatInfoHTML += '</div>';

    // Tìm vị trí để chèn thông tin ghế (trong section chọn chỗ ngồi)
    const seatSection = document.querySelector('.section:has(.btn_showSeat)');
    if (seatSection) {
        let existingInfo = seatSection.querySelector('.selected-seats-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        const addServiceDiv = seatSection.querySelector('.add-service');
        if (addServiceDiv) {
            addServiceDiv.insertAdjacentHTML('afterend', seatInfoHTML);
        }
    }
}

// Hàm hiển thị thông tin hành lý đã chọn
function displaySelectedBaggage() {
    if (listCustomer.length === 0) {
        listCustomer = JSON.parse(sessionStorage.getItem('customerData')) || [];
    }
    let baggageInfoHTML = '<div class="selected-baggage-info">';

    // Hiển thị hành lý chiều đi
    const departureBaggage = JSON.parse(sessionStorage.getItem("BaggageListDeparture")) || [];
    if (departureBaggage.length > 0) {
        baggageInfoHTML += '<div class="baggage-direction"><h4>🛫 Hành lý đã chọn - Chiều đi:</h4>';
        departureBaggage.forEach((baggage, index) => {
            const customerName = listCustomer[index]?.fullName || `Người ${index + 1}`;
            baggageInfoHTML += `<div class="baggage-item">👤 ${customerName}: ${baggage.displayText}</div>`;
        });
        baggageInfoHTML += '</div>';
    }

    // Hiển thị hành lý chiều về (nếu có)
    if (isRoundTrip) {
        const returnBaggage = JSON.parse(sessionStorage.getItem("BaggageListReturn")) || [];
        if (returnBaggage.length > 0) {
            baggageInfoHTML += '<div class="baggage-direction"><h4>🛬 Hành lý đã chọn - Chiều về:</h4>';
            returnBaggage.forEach((baggage, index) => {
                const customerName = listCustomer[index]?.fullName || `Người ${index + 1}`;
                baggageInfoHTML += `<div class="baggage-item">👤 ${customerName}: ${baggage.displayText}</div>`;
            });
            baggageInfoHTML += '</div>';
        }
    }

    baggageInfoHTML += '</div>';

    // Chèn thông tin vào DOM
    const baggageSection = document.querySelector('.section:has(.showBaggageInfo)');
    if (baggageSection) {
        let existingInfo = baggageSection.querySelector('.selected-baggage-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        const luggageInfo = baggageSection.querySelector('.luggage-info');
        if (luggageInfo) {
            luggageInfo.insertAdjacentHTML('afterend', baggageInfoHTML);
        }
    }
}

// Hàm cập nhật tất cả thông tin đã chọn
function updateAllSelectedServicesDisplay() {
    // Đảm bảo listCustomer đã được load
    if (listCustomer.length === 0) {
        listCustomer = JSON.parse(sessionStorage.getItem('customerData')) || [];
    }

    displaySelectedSeats();
    displaySelectedBaggage();
    updatePriceDisplay();
}

// CSS cho styling (thêm vào file CSS hoặc trong thẻ style)
const selectedServicesCSS = `
<style>
.selected-seats-info, .selected-baggage-info {
    margin-top: 15px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.seat-direction, .baggage-direction {
    margin-bottom: 10px;
}

.seat-direction h4, .baggage-direction h4 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 14px;
}

.seat-item, .baggage-item {
    padding: 5px 0;
    font-size: 13px;
    color: #555;
    border-bottom: 1px solid #e9ecef;
}

.seat-item:last-child, .baggage-item:last-child {
    border-bottom: none;
}
</style>
`;

// Thêm CSS vào head
document.head.insertAdjacentHTML('beforeend', selectedServicesCSS);