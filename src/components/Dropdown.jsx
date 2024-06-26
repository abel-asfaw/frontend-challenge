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

/**
 * Dropdown Component.
 *
 * Provides a dropdown selection menu. Supports single and multi-select options.
 *
 * @component
 *
 * @param {string} width - The width of the dropdown. Values: 'sm', 'md', 'lg'. Defaults to 'md'.
 * @param {string} height - The height of the dropdown panel. Values: 'sm', 'md', 'lg'. Defaults to 'sm'.
 * @param {boolean} multiSelect - Enables multi-selection mode. Defaults to false.
 * @param {Array<{ label: string, value: string }>} options - The options available for selection in the dropdown.
 * @param {Function} onSelectionsChange - Callback function that is called when selections change.
 *
 * @example
 * // Single-select dropdown
 * <Dropdown
 *      options={[{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}]}
 *      onSelectionsChange={handleDropdownChange} />
 *
 * // Multi-select dropdown
 * <Dropdown
 *      multiSelect
 *      options={[{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}]}
 *      onSelectionsChange={handleDropdownChange} />
 *
 * @returns {ReactElement} The Dropdown component.
 */

const DROPDOWN_WIDTHS = {
    sm: 'w-40',
    md: 'w-72',
    lg: 'w-96',
};

const DROPDOWN_HEIGHTS = {
    sm: 300,
    md: 600,
    lg: 900,
};

export default function Dropdown({
    width = 'md',
    height = 'sm',
    multiSelect = false,
    options,
    onSelectionsChange,
}) {
    const [selections, setSelections] = useState(new Set());
    const [isOpen, setIsOpen] = useState(false);

    const divElement = useRef();

    const dropdownWidth = DROPDOWN_WIDTHS[width];
    const dropdownHeight = DROPDOWN_HEIGHTS[height];

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

    const displayCaretIcon = () => {
        const Icon = isOpen ? AiOutlineCaretUp : AiOutlineCaretDown;

        return <Icon size={12} />;
    };

    const displaySelectedOptions = () => {
        return [...selections]
            .slice(0, 50)
            .map((selection) => selection.label)
            .join(', ');
    };

    const toggleSelectAll = () => {
        const selectAll = selections.size !== options.length;
        const newSelections = new Set(selectAll ? options : null);

        setSelections(newSelections);
        onSelectionsChange([...newSelections]);
    };

    const handleOptionClick = (option) => {
        let newSelections;
        const isOptionSelected = selections.has(option);

        if (multiSelect) {
            newSelections = new Set(selections);
            if (isOptionSelected) {
                newSelections.delete(option);
            } else {
                newSelections.add(option);
            }
        } else {
            newSelections = new Set(isOptionSelected ? null : [option]);
        }
        setSelections(newSelections);
        onSelectionsChange([...newSelections]);
    };

    const renderedOptions = ({ index, style }) => {
        const option = options[index];
        const isSelected = selections.has(option);

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
            className={classNames(dropdownWidth, 'relative select-none')}
        >
            <Panel
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="truncate">
                    {selections.size ? displaySelectedOptions() : 'Select...'}
                </div>
                <span className="shrink-0 text-gray-600">
                    {displayCaretIcon()}
                </span>
            </Panel>
            {isOpen && (
                <Panel className="absolute flex flex-col gap-2">
                    {multiSelect && (
                        <div className="flex justify-between">
                            <Button onClick={toggleSelectAll}>
                                {selections.size === options.length
                                    ? 'Deselect all'
                                    : 'Select all'}
                            </Button>
                        </div>
                    )}
                    <List
                        height={dropdownHeight}
                        itemSize={35}
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
    height: PropTypes.string,
    multiSelect: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelectionsChange: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
    width: 'md',
    height: 'sm',
    multiSelect: false,
};
