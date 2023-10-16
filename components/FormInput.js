import { UserRole } from "../models/User";

function FormInput(props) {
  const { label, onChange, isEditable = true, role, ...inputProps } = props;

  if (
    (role === UserRole.Admin || role === UserRole.Faculty) &&
    (props.name === "dateOfJoining" || props.name === "dateOfPassOut")
  ) {
    return null;
  }

  return (
    <div className="w-full">
      <label htmlFor={props.name} className="label">
        {label}:{" "}
      </label>
      <input
        className={`input ${!isEditable && "cursor-not-allowed bg-slate-200"}`}
        {...inputProps}
        onChange={onChange}
        readOnly={!isEditable}
      />
    </div>
  );
}

export default FormInput;
