import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/Form";
import styles from "./Analysis.module.css";

interface AnalysisFilterProps {
    onDateRangeChange: (startDate: string, endDate: string) => void;
}

interface FilterButtonProps {
    label: string;
    value: string;
    selectedFilter: string;
    applyFilter: (filter: string) => void;
}

const FilterButton = ({ label, value, selectedFilter, applyFilter }: FilterButtonProps) => {
    const isActive = selectedFilter === value;
    return (
        <button
            className={`${styles.filter_button} ${isActive ? styles.active : ""}`}
            onClick={() => applyFilter(value)}
        >
            {label}
        </button>
    );
};

export default function AnalysisFilter({ onDateRangeChange }: AnalysisFilterProps) {
    const [selectedFilter, setSelectedFilter] = useState("Este Mes");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const applyFilter = (filter: string) => {
        setSelectedFilter(filter);
        const today = new Date();
        let start = new Date();
        let end = new Date();

        if (filter === "Este Mes") {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (filter === "Este Trimestre") {
            const currentQuarter = Math.floor(today.getMonth() / 3);
            start = new Date(today.getFullYear(), currentQuarter * 3, 1);
            end = new Date(today.getFullYear(), currentQuarter * 3 + 3, 0);
        } else if (filter === "Este Ano") {
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
        } else if (filter === "Selecionar Periodo") {
            return;
        }

        const startStr = start.toISOString().split("T")[0];
        const endStr = end.toISOString().split("T")[0];

        if (filter !== "Selecionar Periodo") {
            setCustomStart("");
            setCustomEnd("");
        }

        onDateRangeChange(startStr, endStr);
    };

    useEffect(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        onDateRangeChange(
            start.toISOString().split("T")[0],
            end.toISOString().split("T")[0]
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCustomDateChange = (start: string, end: string) => {
        setCustomStart(start);
        setCustomEnd(end);
        if (start && end) {
            onDateRangeChange(start, end);
        }
    };

    return (
        <div className={styles.filter_wrapper}>
            <div className={styles.filter_buttons}>
                <FilterButton label="Este Mês" value="Este Mes" selectedFilter={selectedFilter} applyFilter={applyFilter} />
                <FilterButton label="Este Trimestre" value="Este Trimestre" selectedFilter={selectedFilter} applyFilter={applyFilter} />
                <FilterButton label="Este Ano" value="Este Ano" selectedFilter={selectedFilter} applyFilter={applyFilter} />

                <button
                    className={`${styles.filter_button} ${selectedFilter === "Selecionar Período" ? styles.active : ""}`}
                    onClick={() => {
                        if (selectedFilter === "Selecionar Período") {
                            applyFilter("Este Mes");
                        } else {
                            applyFilter("Selecionar Período");
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCalendarDays} className={styles.icon_margin} />
                    Selecionar Período
                </button>
            </div>

            {selectedFilter === "Selecionar Período" && (
                <div className={styles.custom_date_inputs}>
                    <Input
                        type="date"
                        value={customStart}
                        onChange={(e) => handleCustomDateChange(e.target.value, customEnd)}
                    />
                    <span className={styles.date_separator}>até</span>
                    <Input
                        type="date"
                        value={customEnd}
                        onChange={(e) => handleCustomDateChange(customStart, e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}
