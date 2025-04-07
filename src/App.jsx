import { SettingsProvider, SettingsDialogOpener } from "./SettingsContext";
import Resizer from "./ResizerContext";

function SymbolButton(props) {
  return (
    <button className="symbol" {...props}>
      {props.children}
    </button>
  );
}

function App() {
  return (
    <>
      <SettingsProvider>
        <header className="container-fluid">
          <div className="title">
            <img src="media/icons/icon.svg" />
            <b>imgResizer</b>
          </div>
          <div>
            <a target="_blank" href="https://github.com/xbvuno/imgResizer">
              <SymbolButton>
                <img src="media/github.svg" />
              </SymbolButton>
            </a>
            <SymbolButton>info</SymbolButton>
            <SettingsDialogOpener>
              <SymbolButton>settings</SymbolButton>
            </SettingsDialogOpener>
          </div>
        </header>

        <main className="container">
          <Resizer />
          <p>
            ‼️ all the images provided are not stored anywhere but your browser
            ‼️
          </p>
        </main>
      </SettingsProvider>
    </>
  );
}

export default App;
