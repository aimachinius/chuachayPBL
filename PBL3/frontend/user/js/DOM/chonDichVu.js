// import "../../../APIs/flights_seat.js";
import { getListSeatOnFlight } from "../../../APIs/flights_seat.js";
import { setStatusSeat } from "../../../APIs/flights_seat.js";
let listCustomer = [];
let ListSeatOnFlight = [];
let dataFlight;
sessionStorage.setItem("SeatOfPeple", JSON.stringify([]));
sessionStorage.setItem("BaggageList", JSON.stringify([]));
let countPeople = Number(getPeopleCount()); // Lấy số lượng người từ dữ liệu tìm kiếm
const BaggageList = [];
const defaultBaggage = {
    baggageType: 'CARRY_ON_BA',
    baggageWeight: 7
};
for (let i = 0; i < countPeople; i++) { // Khởi tạo danh sách hành lý mặc định cho mỗi người
    BaggageList.push(defaultBaggage);
}
sessionStorage.setItem("BaggageListDeparture", JSON.stringify(BaggageList));
sessionStorage.setItem("BaggageListReturn", JSON.stringify(BaggageList));
window.addEventListener('load', async () => {
    listCustomer = JSON.parse(sessionStorage.getItem('customerData')) || [];
    dataFlight = JSON.parse(sessionStorage.getItem("customerSelectedFlight"));
    await loadListSeatOnFlight();
    createViewFlights();
    // createViewCustomers();
    createSeat();
});
async function loadListSeatOnFlight() {
    ListSeatOnFlight = await getListSeatOnFlight(dataFlight.departureFlightASeat.flight.idFlight);
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

    document.addEventListener("click", function (event) {
        const b = document.querySelector(".showBaggageInfo");
        if (!popup.contains(event.target) && !b.contains(event.target)) {
            popup.style.display = "none";
        }
    });
};
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
function SelectBaggage(i) {
    // @Column(name = "Baggage_Type")
    // private String baggageType;

    // @Column(name = "Baggage_Weight")
    // private float baggageWeight;

    //     public enum TypeBaggage {
    //     CARRY_ON_BA,
    //     CHECKED_BA
    // }
    const Baggage = {
    };
    if (i == 1) {
        BaggageList.push({
            baggageType: 'CARRY_ON_BA',
            baggageWeight: 10
        });
    } else if (i == 2) {

        BaggageList.push({
            baggageType: 'CHECKED_BA',
            baggageWeight: 20
        });
    }
    else {
        BaggageList.push({
            baggageType: 'CHECKED_BA',
            baggageWeight: 30
        });
    }
    TODO: // session BaggageLisst 
    sessionStorage.setItem("BaggageList", JSON.stringify(BaggageList));
    // closePopup();
}


let SeatOfPeple = []; // Lưu số ghế của người đã chọn

let flag = false;
// nên lưu vào session , khi nào người dùng thanh toán thì mới add vào csdl 
// Chuyển màu sang đang chọn , lưu vào session (nếu người dùng thành toán thì mới lưu vào csdl)
let ChooseSeat = [];
document.getElementsByClassName("btn_showSeat")[0].addEventListener('click', showSeatTable);
function showSeatTable() {
    const a = document.getElementById("showSeatOfFlightTable");
    a.style.display = "block";
    a.style.display = "grid";
    a.style.gridTemplateRows = "10% 10% 10% 60% 10%";
    const width = a.offsetWidth;
    const height = a.offsetHeight;
    createCardToChooseSeat(0);
    a.style.left = `calc(50% - ${width / 2}px)`;
    a.style.top = `calc(50% - ${height / 2}px)`;
    // createSeat();
    document.addEventListener("click", function (event) {
        const b = document.querySelector(".btn_showSeat")
        if (!a.contains(event.target) && !b.contains(event.target)) {
            a.style.display = "none";
        }
    });
}

// Mục đích là gì ? 
// Lấy sẵn danh sách để đó 
// nếu ấn vào std -> ghế 
function getPeopleCount() {
    const searchFormData = JSON.parse(sessionStorage.getItem('search-form-data'));
    if (!searchFormData) {
        return 0; // Không có dữ liệu tìm kiếm
    }
    const { adultNumber, childNumber, infantNumber } = searchFormData;
    return adultNumber + childNumber + infantNumber;
}

function findSeatByIndex(index) {
    const a = document.getElementsByClassName("SeatTable")[0];
    a.forEach(seat => {
        if (seat.textContent === index.toString()) {
            return seat;
        }
    });
}
// index = 0 
// nếu được nhấn -> Vẻ ra 0 -> tăng in dex 
// nếu index == max -> tắt , set tên lại thành Hủy bỏ

// nếu được nhấn lúc hủy bỏ(tức index == max ), xóa hết trong SeatOfPeople
// set index thành 0 -> set tên thành xác nhận  

let index = 0;
// Lấy số lượng người từ dữ liệu tìm kiếm
let listSeatChoose = []; // Lưu danh sách ghế đã chọn
const btn_submitSeatTable = document.querySelector(".btn_submitSeatTable");
btn_submitSeatTable.addEventListener("click", () => {
    if (index === countPeople) {
        alert(SeatOfPeple);
        SeatOfPeple = [];
        index = 0;
        btn_submitSeatTable.textContent = "Xác nhận";
        resetSeat(); // Xóa màu đã chọn
    }
    else {
        if (!SeatOfPeple.includes(ChooseSeat[0].textContent)) {
            SeatOfPeple.push(ChooseSeat[0].textContent);
        } else {
            alert("Ghế đã được chọn, vui lòng chọn ghế khác.");
            i--;
        }
        index++;
        if (index === countPeople) {
            btn_submitSeatTable.textContent = "Hủy bỏ";
            const a = document.getElementById("showSeatOfFlightTable");
            TODO: // Lưu vào session
            sessionStorage.setItem("SeatOfPeple", JSON.stringify(SeatOfPeple));
            a.style.display = "none";
        }
        else {
            createCardToChooseSeat(index);
        }
    }
    // alert(SeatOfPeple);//
});
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
    const a = document.getElementsByClassName("SeatTable")[0];
    const seatCount = dataFlight.departureFlightASeat.flight.plane.seatCount;
    for (let i = 0; i < seatCount; i++) {
        const seat = document.createElement("div");
        seat.classList.add("SeatSquare");
        seat.classList.add("SeatOnFlight");
        if (ListSeatOnFlight[i].status === "BOOKED") {
            seat.classList.add("SeatSquare_Choosen");
            seat.classList.add("no-hover");
        }
        else {
            if (ListSeatOnFlight[i].seat.seatType === "VIP") {
                seat.classList.add("SeatSquare_VIP");
            } else {
                seat.classList.add("SeatSquare_Common");
            }
            seat.addEventListener("click", () => {
                bookedSeat(seat);
            });
        }
        seat.textContent = `${i + 1}`;

        a.appendChild(seat);
    }
}
document.querySelector(".btn_continue").addEventListener("click", () => {
    window.location.href = 'ThanhToan.html';
});