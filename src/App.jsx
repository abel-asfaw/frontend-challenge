import Dropdown from './components/Dropdown';

export default function App() {
    const defaultOptions = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Orange', value: 'orange' },
        {
            label: 'Really really long label',
            value: 'long-label',
        },
    ];

    const generatedOptions = [];
    for (let i = 0; i < 10000; i++) {
        const label = `Option ${i + 1}`;
        const value = `option${i + 1}`;
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
                    width="lg"
                    options={defaultOptions}
                    onSelectionsChange={handleDropdownChange}
                />
                <Dropdown
                    multiSelect={true}
                    options={generatedOptions}
                    onSelectionsChange={handleDropdownChange}
                />
            </div>
        </div>
    );
}
