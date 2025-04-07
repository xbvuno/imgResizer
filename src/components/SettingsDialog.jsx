import { useDialogContext } from "../contexts/DialogContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import SettingsInput from "./SettingsInput";



export default function InfoDialog() {
	const { isDialogOpen, closeDialog } = useDialogContext();
    const { saveSettings } = useSettingsContext();
	return (
		<dialog open={isDialogOpen} id='settings-dialog'>
			<article>
				<header>
					<button
						aria-label='Close'
						rel='prev'
						onClick={closeDialog}
					></button>
					<h4>⚙️ Settings</h4>
				</header>
				<SettingsInput
					name='scale'
					type='number'
					max='1024'
					min='1'
					step='1'
				/>
				<SettingsInput name='smoothing' type='checkbox' />
				<SettingsInput name='enable_upscale' type='checkbox' />
				<SettingsInput name='enable_scale_to_original' type='checkbox' />
				<footer>
					<a onClick={closeDialog}>Cancel</a>
					<button onClick={() => {saveSettings() && closeDialog()}}>Save</button>
				</footer>
			</article>
		</dialog>
	);
}
