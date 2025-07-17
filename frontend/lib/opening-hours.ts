import OpeningHours from "opening_hours";

interface TimeRange {
	open: string;
	close: string;
}

export interface ParsedHours {
	day: string;
	isOpen: boolean;
	timeRanges: TimeRange[];
}

export interface OpeningStatus {
	isOpen: boolean;
	status: string;
}

// French day names
const FRENCH_DAYS: Record<string, string> = {
	Mon: "Lundi",
	Tue: "Mardi",
	Wed: "Mercredi",
	Thu: "Jeudi",
	Fri: "Vendredi",
	Sat: "Samedi",
	Sun: "Dimanche",
};

export function parseOpeningHours(openingHours: string): ParsedHours[] {
	if (!openingHours || openingHours.trim() === "") return [];

	try {
		const parsed = [];
		for (const dayFrench of Object.values(FRENCH_DAYS)) {
			parsed.push({
				day: dayFrench,
				isOpen: false,
				timeRanges: [] as TimeRange[],
			});
		}

		const oh = new OpeningHours(openingHours);

		const thisMonday = new Date();
		thisMonday.setDate(thisMonday.getDate() - thisMonday.getDay() + 1);
		thisMonday.setHours(0, 0, 0, 0);

		const thisSunday = new Date();
		thisSunday.setDate(thisSunday.getDate() - thisSunday.getDay() + 7);
		thisSunday.setHours(23, 59, 59, 999);

		const openedIntervals = oh.getOpenIntervals(thisMonday, thisSunday);

		for (const interval of openedIntervals) {
			let index = new Date(interval[0]).getDay();
			if (index === 0) index = 6;
			else index--;

			const day = parsed[index];
			if (!day) continue;

			day.isOpen = true;
			day.timeRanges.push({
				open: new Date(interval[0]).toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				close: new Date(interval[1]).toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			});
		}

		return parsed;
	} catch (error) {
		console.warn("Failed to parse opening hours:", openingHours, error);
		return [];
	}
}

export function getOpeningStatus(openingHours: string): OpeningStatus {
	if (!openingHours || openingHours.trim() === "") {
		return {
			isOpen: false,
			status: "Horaires inconnus",
		};
	}

	try {
		const oh = new OpeningHours(openingHours);
		const now = new Date();

		// Check if currently open
		const isOpen = oh.getState(now);

		if (isOpen) {
			// Get next closing time
			const nextChange = oh.getNextChange(now);
			if (nextChange) {
				const closeTime = nextChange.toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
				});

				return {
					isOpen: true,
					status: `Ouvert jusqu'à ${closeTime}`,
				};
			} else {
				return {
					isOpen: true,
					status: "Ouvert",
				};
			}
		} else {
			// Get next opening time
			const nextChange = oh.getNextChange(now);
			if (nextChange) {
				const openTime = nextChange.toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
				});

				// Get the day name for the next opening
				const dayNames = [
					"Dimanche",
					"Lundi",
					"Mardi",
					"Mercredi",
					"Jeudi",
					"Vendredi",
					"Samedi",
				];

				const tomorrow = new Date(now);
				tomorrow.setDate(tomorrow.getDate() + 1);

				// Check if it's today or another day
				const isToday = nextChange.toDateString() === now.toDateString();
				const isTomorrow =
					nextChange.toDateString() === tomorrow.toDateString();
				let nextDayName = dayNames[nextChange.getDay()].toLowerCase();
				if (isToday) nextDayName = "";
				if (isTomorrow) nextDayName = "demain";

				return {
					isOpen: false,
					status: `Ouvre ${nextDayName} à ${openTime}`,
				};
			} else {
				return {
					isOpen: false,
					status: "Fermé",
				};
			}
		}
	} catch (error) {
		console.warn("Failed to parse opening hours:", openingHours, error);
		return {
			isOpen: false,
			status: "Horaires inconnus",
		};
	}
}
