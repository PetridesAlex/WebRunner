export const Button = ({
  href,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}) => {
  const cls = `btn btn--${variant} ${className}`.trim()
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}
