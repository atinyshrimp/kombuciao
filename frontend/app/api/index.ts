"use server";

import { getUserId } from "@/lib/utils";
import dotenv from "dotenv";

dotenv.config();

const apiURL = "/api";

interface ApiResponse {
	ok: boolean;
	error?: string;
	data?: unknown;
	total?: number;
}

class api {
	constructor() {}

	get(path: string): Promise<ApiResponse> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(`${apiURL}${path}`, { method: "GET" });

				const res = await response.json();
				resolve(res);
			} catch (e) {
				reject(e);
			}
		});
	}

	put(path: string, body: object): Promise<ApiResponse> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(`${apiURL}${path}`, {
					method: "PUT",
					headers: {
						"Kombuciao-Voter-Id": getUserId() || "",
						"Content-Type": "application/json",
					},
					body: typeof body === "string" ? body : JSON.stringify(body),
				});

				const res = await response.json();
				resolve(res);
			} catch (e) {
				reject(e);
			}
		});
	}

	delete(path: string): Promise<ApiResponse> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(`${apiURL}${path}`, {
					method: "DELETE",
					headers: { "Kombuciao-Voter-Id": getUserId() || "" },
				});
				const res = await response.json();
				resolve(res);
			} catch (e) {
				reject(e);
			}
		});
	}

	post(path: string, body: object): Promise<ApiResponse> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(`${apiURL}${path}`, {
					method: "POST",
					headers: {
						"Kombuciao-Voter-Id": getUserId() || "",
						"Content-Type": "application/json",
					},
					body: typeof body === "string" ? body : JSON.stringify(body),
				});
				const res = await response.json();
				resolve(res);
			} catch (e) {
				reject(e);
			}
		});
	}
}

const API = new api();
export default API;
