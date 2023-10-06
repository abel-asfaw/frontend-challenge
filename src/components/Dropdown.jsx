import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Panel from './Panel';
import {
    AiOutlineCaretDown,
    AiOutlineCaretUp,
    AiOutlineCheck,
} from 'react-icons/ai';
import Button from './Button';
import { FixedSizeList as List } from 'react-window';

const DROPDOWN_SIZES = {
    sm: { width: 'w-40', height: 300 },
    md: { width: 'w-72', height: 600 },
    lg: { width: 'w-96', height: 900 },
};

export default function Dropdown({
    width = 'md',
    height = 'sm',
    options,
    multiSelect = false,
    onSelectionsChange,
}) {
    const [selections, setSelections] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const divElement = useRef();

    const computedWidthClass = DROPDOWN_SIZES[width].width;
    const reactWindowHeight = DROPDOWN_SIZES[height].height;

    // Handle clicks outside of the Dropdown component
    useEffect(() => {
        if (!divElement.current) {
            return;
        }

        const handler = (event) => {
            if (!divElement.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handler, true);
        return () => {
            document.removeEventListener('click', handler, true);
        };
    }, []);

    const selectAllItems = () => {
        if (selections.length !== options.length) {
            const newSelections = options;
            setSelections(newSelections);
            onSelectionsChange(newSelections);
        }
    };

    const deselectAllItems = () => {
        if (selections.length) {
            const newSelections = [];
            setSelections([]);
            onSelectionsChange(newSelections);
        }
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        let isOptionSelected = false;

        const newSelections = selections.reduce((acc, curr) => {
            if (curr.value === option.value) {
                isOptionSelected = true;
                return acc;
            }
            return [...acc, curr];
        }, []);

        if (isOptionSelected) {
            setSelections(newSelections);
        } else {
            if (multiSelect) {
                setSelections([...newSelections, option]);
            } else {
                setSelections([option]);
            }
        }
        onSelectionsChange(selections);
    };

    const renderedOptions = ({ index, style }) => {
        const option = options[index];
        const isSelected = selections.some(
            (selection) => selection.value === option.value
        );

        const classes = classNames(
            'flex cursor-pointer items-center justify-between p-2 rounded',
            'duration-200 hover:bg-sky-100',
            { 'bg-sky-100': isSelected }
        );

        return (
            <div
                key={option.value}
                className={classes}
                style={style}
                onClick={() => handleOptionClick(option)}
            >
                {option.label}
                {isSelected && <AiOutlineCheck className="shrink-0" />}
            </div>
        );
    };

    return (
        <div
            ref={divElement}
            className={classNames(computedWidthClass, 'relative select-none')}
        >
            <Panel
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={handleClick}
            >
                <div className="truncate">
                    {selections.length
                        ? selections
                              .slice(0, 100)
                              .map((selection) => selection.label)
                              .join(', ')
                        : 'Select...'}
                </div>
                <span className="shrink-0 text-gray-600">
                    {isOpen ? (
                        <AiOutlineCaretUp size={12} />
                    ) : (
                        <AiOutlineCaretDown size={12} />
                    )}
                </span>
            </Panel>
            {isOpen && (
                <Panel
                    className={classNames(
                        'absolute flex flex-col gap-2 overflow-scroll'
                    )}
                >
                    {multiSelect && (
                        <div className="flex justify-between">
                            <Button onClick={selectAllItems}>Select all</Button>
                            <Button onClick={deselectAllItems}>
                                De-select all
                            </Button>
                        </div>
                    )}
                    <List
                        height={reactWindowHeight}
                        itemSize={40}
                        itemCount={options.length}
                    >
                        {renderedOptions}
                    </List>
                </Panel>
            )}
        </div>
    );
}

Dropdown.propTypes = {
    width: PropTypes.string,
    multiSelect: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelectionsChange: PropTypes.func,
};

Dropdown.defaultProps = {
    width: 'md',
    height: 'sm',
    multiSelect: false,
    onSelectionsChange: () => {},
};
