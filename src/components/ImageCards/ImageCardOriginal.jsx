import { useEffect, useState, useRef } from "react";
import { useSettingsContext } from "../../contexts/SettingsContext";
import { useResizerContext } from "../../contexts/ResizerContext";

import { getSquareSizeFromUrl, tryRemoveCheckGridFromElem } from "../../lib/square_size";
import { ScaledBlobFromUrl, copyImageToClipboard, saveImage } from "../../lib/get_source";

export default function ImageCardOriginal() {
	const [blob, setBlob] = useState(null);
	const { settingsDict } = useSettingsContext();
	const { sourceImg, imgName, popupAlert, sourceBlob } = useResizerContext();
	const [isDisabled, setDisabled] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [img, setImg] = useState(null);
	const [imgSize, setImgSize] = useState(null);
	const [squareSize, setSquareSize] = useState(null);
	const imgRef = useRef();

	useEffect(() => {
		if (!blob) return;

		if (img) URL.revokeObjectURL(img);

		setImg(URL.createObjectURL(blob));

		setLoading(false);
		setDisabled(false);
	}, [blob]);

	useEffect(() => {
		if (!squareSize) return;

		if (squareSize == 1) {
			setBlob(sourceBlob);
			return;
		}
		ScaledBlobFromUrl(sourceImg, 1 / squareSize).then((_blob) => {
			setBlob(_blob);
		});
	}, [squareSize]);

	useEffect(() => {
		if (!settingsDict.enable_scale_to_original) return;
		if (!sourceImg) return;
		setLoading(true);
		setSquareSize(null);
		getSquareSizeFromUrl(sourceImg, setSquareSize);
	}, [sourceImg, settingsDict.enable_scale_to_original]);

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
		if (!settingsDict.enable_scale_to_original)
			return <p>Disabled by settings</p>;
		if (isDisabled)
			return <p>Here will be the result to its original size</p>;
		if (img) return <img ref={imgRef} src={img} onLoad={onImgLoad} />;
	}

	function save() {
		saveImage(img, imgName + `_original`);
	}

	function copy() {
		copyImageToClipboard(blob, popupAlert);
	}

	function tryToRemoveCG() {
		tryRemoveCheckGridFromElem(img).then((_blob) => {
			setBlob(_blob);
		});
	}

	return (
		<article
			className={
				!settingsDict.enable_scale_to_original ? "disabled" : undefined
			}
		>
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
				<p>Original {squareSize ? `[x${1 / squareSize}]` : ""}</p>
				<button
					disabled={isDisabled}
					onClick={tryToRemoveCG}
					className='symbol'
					data-tooltip="Try to remove Asesprite checkergrid" data-placement="topleft"
				>
					bid_landscape_disabled
				</button>
			</footer>
		</article>
	);
}
