import { SettingsProvider } from "./contexts/SettingsContext";
import {Resizer} from "./contexts/ResizerContext";
import { DialogOpener, DialogProvider } from "./contexts/DialogContext";
import InfoDialog from "./components/InfoDialog";
import SettingsDialog from "./components/SettingsDialog";
import SymbolButton from "./components/SymbolButton";

function App() {
	return (
		<>
			<SettingsProvider>

        <header className='container-fluid'>
					<div className='title'>
						<img src='media/icons/icon.svg' />
						<b>imgResizer</b>
					</div>
          <div id='buttons'>
						<a
							target='_blank'
							href='https://github.com/xbvuno/imgResizer'
						>
							<SymbolButton data-tooltip="Open on Github" data-placement="bottomleft">
								<img src='media/github.svg' />
							</SymbolButton>
						</a>
						<DialogProvider>
							<InfoDialog />
							<DialogOpener>
								<SymbolButton data-tooltip="More info" data-placement="bottomleft">info</SymbolButton>
							</DialogOpener>
						</DialogProvider>
						<DialogProvider>
							<SettingsDialog />
							<DialogOpener>
								<SymbolButton data-tooltip="Settings" data-placement="bottomleft">settings</SymbolButton>
							</DialogOpener>
						</DialogProvider>
					</div>
				</header>
				<main className='container'>
					<Resizer />
				</main>

			</SettingsProvider>
		</>
	);
}

export default App;
