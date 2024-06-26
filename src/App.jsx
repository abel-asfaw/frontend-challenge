import Dropdown from './components/Dropdown';

export default function App() {
    const defaultOptions = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Orange', value: 'orange' },
        {
            label: 'Really really really really really really really really really long label',
            value: 'long-label',
        },
    ];

    const generatedOptions = [];
    for (let i = 0; i < 100_000; i++) {
        const label = `Option ${i + 1}`;
        const value = `option-${i + 1}`;
        generatedOptions.push({ label, value });
    }

    const handleDropdownChange = (newSelections) => {
        // other operations here...
        console.log('Selections', newSelections);
    };

    return (
        <div className="flex flex-col">
            <div className="flex">
                <Dropdown
                    multiSelect
                    options={generatedOptions}
                    onSelectionsChange={handleDropdownChange}
                />
                <Dropdown
                    options={generatedOptions}
                    onSelectionsChange={handleDropdownChange}
                />
            </div>
        </div>
    );
}
