import classNames from 'classnames';

export default function Button({ children, className, ...rest }) {
    const classes = classNames(
        'rounded bg-gray-200 px-2 hover:bg-gray-300',
        'duration-200',
        className
    );

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
}
