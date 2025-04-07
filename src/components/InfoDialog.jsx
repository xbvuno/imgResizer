import { useDialogContext } from "../contexts/DialogContext";

import "./InfoDialog.css";

import text from "../lib/info_text.txt?raw";	

export default function InfoDialog() {
	const { isDialogOpen, closeDialog } = useDialogContext();
	return (
		<dialog open={isDialogOpen} id='info-dialog'>
			<article>
				<header>
					<button
						aria-label='Close'
						rel='prev'
						onClick={closeDialog}
					></button>
					<h4>ℹ️ More info</h4>
				</header><p className="highlight">
					all the images provided are not stored anywhere but your
					browser
                    </p>
                <p>Build for the <a href="https://discord.com/invite/pixelart">Pixel Art Discord (PAD)</a></p>
                <p> made with 💛 by </p>
				<pre>{text}</pre>
                <p>Check out my other projects <a href="https://github.com/xbvuno">here</a></p>
				
				<footer>
					<button onClick={closeDialog}>Close</button>
				</footer>
			</article>
		</dialog>
	);
}
