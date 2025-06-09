import { BASE_URL } from "./init.js"
const API_BASE = BASE_URL + '/flights_seat';


export async function getListSeatOnFlight(Id_Flight) {
    const idFlight = Id_Flight;
    try {
        const response = await fetch(`${API_BASE}?idFlight=${idFlight}`);
        if (!response.ok) {
            alert("ERROR");
            throw new Error('Lỗi khi fetch danh sách ghế');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert("ERROR2");
        console.error('Fetch thất bại:', error);
        return null;
    }
}

export async function setStatusSeat(flight, seat, status) {
    await fetch(`${API_BASE}/updateSeatStatus`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Flight: flight,
            Seat: seat,
            status: status
        })
    })
        .then(response => {
            if (!response.ok) {
                alert("ERROR");
                throw new Error('Lỗi khi cập nhật trạng thái ghế');
            }
            return response.json();
        })
        .then(data => {
            console.log('Cập nhật thành công:', data);
        })
        .catch(error => {
            alert("ERROR2");
            console.error('Cập nhật thất bại:', error);
        });
}