import { useSettingsContext } from "../contexts/SettingsContext";

export default function SettingsInput({ name, type, ...rest }) {
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