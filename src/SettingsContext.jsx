import {
	createContext,
	useContext,
	useReducer,
	cloneElement,
	useEffect,
	useState,
} from "react";

export const SettingsContext = createContext();

const initialSettings = {
	scale: 10,
	smoothing: false,
	enable_upscale: true,
	enable_scale_to_original: true,
};

function settingsReducer(settingsDict, action) {
	return { ...settingsDict, ...action };
}

function SettingInput({ name, type, ...rest }) {
	const { tempSettingsDict, handleChange } = useSettingsContext();

	function formatLabel() {
		const formatted = name.replace(/_/g, " ");
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	}

	return (
		<div>
			<label htmlFor={name}>{formatLabel()}</label>
			<input
				id={name}
				name={name}
				type={type}
				checked={type === "checkbox" ? tempSettingsDict[name] : undefined}
				value={type !== "checkbox" ? tempSettingsDict[name] : undefined}
				onChange={handleChange}
				{...rest}
			/>
		</div>
	);
}

export const SettingsProvider = ({ children }) => {
	const [tempSettingsDict, setTempSettingsDict] = useReducer(
		settingsReducer,
		initialSettings
	);
	const [settingsDict, setSettingsDict] = useState(initialSettings);
	const [isDialogOpen, setDialogOpen] = useState(false);

	const openDialog = () => setDialogOpen(true);
	const closeDialog = () => setDialogOpen(false);

	function handleChange(e) {
		const { name, type, checked, value } = e.target;
		setTempSettingsDict({ [name]: type === "checkbox" ? checked : value });
	}

	function saveSettings() {
		setSettingsDict(tempSettingsDict)
		for (const [key, value] of Object.entries(tempSettingsDict)) {
			localStorage.setItem(key, value);
		}
		closeDialog();
	}

	useEffect(() => {
		const loadedSettings = {
			scale: parseInt(localStorage.getItem("scale")) || 10,
			smoothing: localStorage.getItem("smoothing") === "true",
			enable_upscale: localStorage.getItem("enable_upscale") === "true",
			enable_scale_to_original: localStorage.getItem("enable_scale_to_original") === "true",
		};
		setSettingsDict(loadedSettings);
		setTempSettingsDict(loadedSettings);
	}, []);

	return (
		<SettingsContext.Provider
			value={{ openDialog, settingsDict, handleChange, tempSettingsDict }}
		>
			<dialog className='settings' open={isDialogOpen}>
				<article>
					<header>
						<button
							aria-label='Close'
							rel='prev'
							onClick={closeDialog}
						></button>
						<h4>Settings</h4>
					</header>
					<SettingInput name='scale' type='number' max='1024' min='1' step='1' />
					<SettingInput name='smoothing' type='checkbox' />
					<SettingInput name='enable_upscale' type='checkbox' />
					<SettingInput name='enable_scale_to_original' type='checkbox' />
					<footer>
						<a onClick={closeDialog}>Cancel</a>
						<button onClick={saveSettings}>Save</button>
					</footer>
				</article>
			</dialog>
			{children}
		</SettingsContext.Provider>
	);
};

export const SettingsDialogOpener = ({ children }) => (
	<SettingsContext.Consumer>
		{({ openDialog }) => cloneElement(children, { onClick: openDialog })}
	</SettingsContext.Consumer>
);

export const useSettingsContext = () => useContext(SettingsContext);
