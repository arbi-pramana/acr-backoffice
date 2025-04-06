type ChipProps = {
  label: string;
  variant:
    | "danger"
    | "warning"
    | "success"
    | "default"
    | "info"
    | "primary"
    | string;
  block?: boolean;
};

const Chip = (props: ChipProps) => {
  let baseClass = "font-semibold rounded-full p-2 px-3 text-center w-fit";
  if (props.block) {
    baseClass += " w-full";
  } else {
    baseClass += " w-fit";
  }
  const classname = {
    danger: baseClass + " bg-danger-100 text-danger-600",
    warning: baseClass + " bg-warning-100 text-warning-600",
    success: baseClass + " bg-success-100 text-success-600",
    default: baseClass + " bg-basic-100 text-basic-600",
    info: baseClass + " bg-info-100 text-info-600",
    primary: baseClass + " bg-primary-100 text-primary-600",
  };

  return (
    <div
      className={
        classname[props.variant as keyof typeof classname] || baseClass
      }
    >
      {props.label}
    </div>
  );
};

export default Chip;
