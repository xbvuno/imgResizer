import { SettingsProvider, SettingsDialogOpener } from "./SettingsContext";
import Resizer from "./ResizerContext";

function SymbolButton(props) {
	return (
		<button className='symbol' {...props}>
			{props.children}
		</button>
	);
}

function App() {
	return (
		<>
			<SettingsProvider>
				<header className='container-fluid'>
					<div className='title'>
						<img src='media/icons/icon.svg'/>
						<hgroup>
							<p>BVUNO'S</p>
							<h2>imgResizer</h2>
							<p>v 1.1</p>
						</hgroup>
					</div>
					<div>
						<SettingsDialogOpener>
							<SymbolButton>settings</SymbolButton>
						</SettingsDialogOpener>
						<a href="https://github.com/xbvuno/imgResizer"><SymbolButton ><img src="media/github.svg"/></SymbolButton></a>
					</div>
				</header>

				<main className='container'>
					<Resizer />
					<p>all the information provided are not stored anywhere but your browser.</p>
				</main>
			</SettingsProvider>
		</>
	);
}

export default App;
