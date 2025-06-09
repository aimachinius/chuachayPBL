import { BASE_URL } from "./init.js";

const API_BASE = BASE_URL + '/account';

export async function addAccount(account) {
    console.log("call addAccount");
    return await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account)
    });
}