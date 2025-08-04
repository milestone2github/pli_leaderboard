import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCircleInfo } from "react-icons/fa6";

function Toast({ err }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (err) {
			setVisible(true);
		} else {
			setVisible(false);
		}
	}, [err]);

	const colorStyle = {
		text: "text-red-800",
		border: "border-red-300",
		bg: "bg-red-50",
		hover: "hover:bg-red-200",
	};

	const dismissAlert = () => {
		setVisible(false);
	};

	if (!visible || !err) return null;

	return (
		<div
			id="alert-1"
			className={`fixed top-12 shadow-md left-1/2 -translate-x-1/2 z-[1001] flex items-center p-4 mb-4 ${
				colorStyle.text
			} rounded-lg border ${colorStyle.border} ${
				colorStyle.bg
			} transition-opacity duration-300 ${
				visible ? "opacity-100" : "opacity-0"
			}`}
			role="alert"
		>
			<FaCircleInfo />
			<span className="sr-only">Info</span>
			<div className="ms-3 text-sm font-medium">
				<strong className="">Error:</strong> {err}.
			</div>
			<button
				type="button"
				onClick={dismissAlert}
				className={`ms-auto text-xl -mx-1.5 -my-1.5 ${colorStyle.bg} ${colorStyle.text} rounded-lg focus:ring-2 p-1.5 ${colorStyle.hover} inline-flex items-center justify-center h-8 w-8`}
				data-dismiss-target="#alert-1"
				aria-label="Close"
			>
				<span className="sr-only">Close</span>
				<IoMdClose />
			</button>
		</div>
	);
}

export default Toast;
