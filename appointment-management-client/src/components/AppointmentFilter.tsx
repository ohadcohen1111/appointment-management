import { useState } from 'react';
import './AppointmentFilter.css';

interface AppointmentFilterProps {
    onFilter: (startDate: string, endDate: string, searchTerm: string) => void;
}

const AppointmentFilter = ({ onFilter }: AppointmentFilterProps) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        onFilter(newStartDate, endDate, searchTerm);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        onFilter(startDate, newEndDate, searchTerm);
    };

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        onFilter(startDate, endDate, newSearchTerm);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
        onFilter('', '', '');
    };


    return (
        <div className="filter-container">
            <div className="filter-inputs">
                <div className="input-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="date-input"
                    />
                </div>

                <div className="input-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="date-input"
                    />
                </div>

                <div className="input-group">
                    <label>Search</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        placeholder="Search customer name..."
                        className="search-input"
                    />
                </div>
            </div>

            <button onClick={handleReset} className="reset-button">
                Reset Filters
            </button>
        </div>
    );
};

export default AppointmentFilter;
