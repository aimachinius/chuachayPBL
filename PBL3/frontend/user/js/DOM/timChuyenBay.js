// import { getAllLocation } from "../../../../APIs/shared/location.js"
import { getAllLocation } from "../../../../APIs/location.js"


let checkisKhuHoi = document.getElementById("la-khu-hoi")
let ngayVeInputBox = document.getElementById("ngayve");

checkisKhuHoi.addEventListener('change', function () {
    if (this.checked) {
        ngayVeInputBox.disabled = false;
    } else {
        ngayVeInputBox.disabled = true;
    }
});
// cap nhật cái mà chọn tỉnh á
// window.addEventListener('load', (async () => {
//     const data = await getAllLocation()
//     document.querySelectorAll('.chon-diem').forEach(element => {
//         data.forEach(item => {
//             const newOption = document.createElement('option');
//             newOption.value = item.id;
//             newOption.text = item.name;
//             newOption.dataset.obj = JSON.stringify(item)
//             element.appendChild(newOption)
//         })
//     });
// }))
window.addEventListener('load', (async () => {
    const data = await getAllLocation();

    const diemKhoiHanh = document.getElementById("diemkhoihanh");
    const diemDen = document.getElementById("diemden");

    let originalOptions = data.map(item => ({
        id: item.id,
        name: item.name,
        obj: item
    }));

    function renderOptions(selectElement, excludeId = null) {
        selectElement.innerHTML = '';
        // Thêm lại option mới, trừ cái bị loại
        originalOptions.forEach(item => {
            if (item.id != excludeId) {
                const newOption = document.createElement('option');
                newOption.value = item.id;
                newOption.text = item.name;
                newOption.dataset.obj = JSON.stringify(item.obj);
                selectElement.appendChild(newOption);
            }
        });
    }

    renderOptions(diemKhoiHanh);
    renderOptions(diemDen);

    diemKhoiHanh.addEventListener("change", () => {
        const selectedId = diemKhoiHanh.value;
        renderOptions(diemDen, selectedId);
    });

    diemDen.addEventListener("change", () => {
        const selectedId = diemDen.value;
        renderOptions(diemKhoiHanh, selectedId);
    });
}));

const ngaydiInput = document.getElementById('ngaydi');
const ngayveInput = document.getElementById('ngayve');
ngayveInput.addEventListener('change', function () {
    if (ngayveInput.value < ngaydiInput.value) {
        alert('Ngày về phải lớn hơn hoặc bằng ngày đi.');
        ngayveInput.value = '';
    }
});

//sumitform tìm kiếm rồi chuyển trang.
document.getElementById('form-find-chuyen-bay').addEventListener('submit', function (e) {
    e.preventDefault();
    let f = e.target.elements;
    sessionStorage.setItem('search-form-data', JSON.stringify({
        isRoundTrip: f['la-khu-hoi'].checked,
        beginLocation: JSON.parse(f['diemkhoihanh'].selectedOptions[0].dataset.obj),
        endLocation: JSON.parse(f['diemden'].selectedOptions[0].dataset.obj),
        departureDate: f['ngaydi'].value,
        returnDate: f['ngayve'].value,
        adultNumber: f['nguoilon'].value,
        childNumber: f['treemtuhaituoi'].value,
        infantNumber: f['treemduoihaituoi'].value
    }));
    window.location.href = 'danhSachChuyenBay.html';
});
/*
sessionStorage search-form-data : {
is RoundTrip:
beginLocation: 
endLocation:
departureDate:
returnDate: fall/true ?
adultNumber:
childNumber:
infantNumber:
}
*/
