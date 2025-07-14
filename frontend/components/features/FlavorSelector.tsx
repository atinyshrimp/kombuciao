import React from "react";
import MultipleSelector, { Option } from "../ui/multiselect";
import { FLAVORS } from "@/constants";

const FlavorSelector = ({
	selectedFlavors,
	setSelectedFlavors,
}: {
	selectedFlavors: Option[];
	setSelectedFlavors: (flavors: Option[]) => void;
}) => {
	return (
		<div className="flex flex-wrap gap-2 mt-2">
			<MultipleSelector
				options={Object.entries(FLAVORS).map(([key, label]) => ({
					value: key,
					label,
				}))}
				value={selectedFlavors}
				onChange={setSelectedFlavors}
				placeholder="Sélectionner des saveurs"
				className="w-full"
				hidePlaceholderWhenSelected
			/>
		</div>
	);
};

export default FlavorSelector;
