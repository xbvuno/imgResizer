import { useEffect, useState, useRef } from "react";
import { useSettingsContext } from "../../contexts/SettingsContext";
import { useResizerContext } from "../../contexts/ResizerContext";

import { ScaledBlobFromUrl, copyImageToClipboard, saveImage } from "../../lib/get_source";

export default function ImageCardUpscale() {
	const [blob, setBlob] = useState(null);
	const { settingsDict } = useSettingsContext();
	const { sourceImg, imgName, popupAlert } = useResizerContext();
	const [isDisabled, setDisabled] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [img, setImg] = useState(null);
	const [imgSize, setImgSize] = useState(null);
	const imgRef = useRef();

	useEffect(() => {
		if (!blob) return;

		if (img) URL.revokeObjectURL(img);

		setImg(URL.createObjectURL(blob));
		setLoading(false);
		setDisabled(false);
	}, [blob]);

	useEffect(() => {
		if (!settingsDict.enable_upscale) return
		if (!sourceImg) return;

		setLoading(true);

		ScaledBlobFromUrl(sourceImg, settingsDict.scale, settingsDict.smoothing).then((_blob) => {
			setBlob(_blob);
		});
	}, [sourceImg, settingsDict.scale, settingsDict.smoothing, settingsDict.enable_upscale]);

	function renderSize() {
		if (!imgSize || isLoading) return;
		return (
			<p className='size'>
				{imgSize.width} x {imgSize.height}
			</p>
		);
	}

	function onImgLoad() {
		setImgSize(
			(({ naturalWidth, naturalHeight }) => ({
				width: naturalWidth,
				height: naturalHeight,
			}))(imgRef.current)
		);
	}

	function renderImg() {
		if (isLoading) return null;
		if (!settingsDict.enable_upscale) return <p>Disabled by settings</p>;
		if (isDisabled) return <p>Here will be the result upscaled</p>;
		if (img) return <img ref={imgRef} src={img} onLoad={onImgLoad} />;
	}

	function save() {
		saveImage(img, imgName + `_upscaled_x${settingsDict.scale}`)
	}

	function copy() {
		copyImageToClipboard(blob, popupAlert)
	}

	return (
		<article className={!settingsDict.enable_upscale ? 'disabled' : undefined}>
			<header>
				<button disabled={isDisabled} onClick={copy} className='symbol' data-tooltip="Copy to clipboard" data-placement="bottom">
					content_copy
				</button>
				<button disabled={isDisabled} onClick={save} className='symbol' data-tooltip="Save..." data-placement="bottomleft">
					save
				</button>
			</header>
			<div className='img-holder' aria-busy={isLoading}>
				{renderImg()}
				{renderSize()}
			</div>
			<footer>
				<p>
					Upscaled {`[x${settingsDict.scale}${settingsDict.smoothing ? ', smoothed' : ''}]`}
				</p>
			</footer>
		</article>
	);
}