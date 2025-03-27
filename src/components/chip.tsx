const Chip = (props: {
  label: string;
  variant: "danger" | "warning" | "success" | "default";
  block?: boolean;
}) => {
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
  };

  return <div className={classname[props.variant]}>{props.label}</div>;
};

export default Chip;
