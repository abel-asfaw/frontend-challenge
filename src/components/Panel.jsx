import classNames from 'classnames';

export default function Panel({ children, className, ...rest }) {
    const classes = classNames(className, 'border rounded bg-white w-full p-3');

    return (
        <div className={classes} {...rest}>
            {children}
        </div>
    );
}
