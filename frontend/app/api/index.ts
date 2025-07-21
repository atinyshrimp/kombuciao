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
				const response = await fetch(`${apiURL}${path}`, {
					mode: "cors",
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

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
					mode: "cors",
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
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
					mode: "cors",
					credentials: "include",
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
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
					mode: "cors",
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
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
