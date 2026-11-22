type IconProps = {
  name: string;
  className?: string;
  size?: number;
};

/** Material Symbols Outlined icon, as used in the Stitch designs. */
export function Icon({ name, className = "", size = 18 }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}
