import {
	createContext,
	useContext,
	useReducer,
	cloneElement,
	useEffect,
	useState,
} from "react";

const initialSettings = {
	scale: 10,
	smoothing: false,
	enable_upscale: true,
	enable_scale_to_original: true,
};

function settingsReducer(settingsDict, action) {
	return { ...settingsDict, ...action };
}

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
	const [tempSettingsDict, setTempSettingsDict] = useReducer(
		settingsReducer,
		initialSettings
	);
	const [settingsDict, setSettingsDict] = useState(initialSettings);

	function handleChange(e) {
		const { name, type, checked, value } = e.target;
		setTempSettingsDict({ [name]: type === "checkbox" ? checked : value });
	}

	function saveSettings() {
		setSettingsDict(tempSettingsDict);
		for (const [key, value] of Object.entries(tempSettingsDict)) {
			localStorage.setItem(key, value);
		}
		return true;
	}

	useEffect(() => {
		const loadedSettings = {
			scale: parseInt(localStorage.getItem("scale")) || 10,
			smoothing: localStorage.getItem("smoothing") === "true",
			enable_upscale: localStorage.getItem("enable_upscale") !== "false",
			enable_scale_to_original:
				localStorage.getItem("enable_scale_to_original") !== "false",
		};
		setSettingsDict(loadedSettings);
		setTempSettingsDict(loadedSettings);
	}, []);

	return (
		<SettingsContext.Provider
			value={{
				settingsDict,
				tempSettingsDict,
				handleChange,
				saveSettings
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const SettingsDialogOpener = ({ children }) => (
	<SettingsContext.Consumer>
		{({ openSettingsDialog }) =>
			cloneElement(children, { onClick: openSettingsDialog })
		}
	</SettingsContext.Consumer>
);

export const useSettingsContext = () => useContext(SettingsContext);
