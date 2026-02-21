import { useState, useRef } from "react";
import { faClock, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { EventContentArg } from "@fullcalendar/core";
import "./EventPopover.css";

interface PopoverCoords {
    top: number;
    left: number;
}

interface EventPopoverProps {
    eventInfo: EventContentArg;
    disabled?: boolean;
}

export default function EventPopover({ eventInfo, disabled = false }: EventPopoverProps) {
    const { title } = eventInfo.event;
    const { type, description, time } = eventInfo.event.extendedProps || {};

    const [coords, setCoords] = useState<PopoverCoords | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (disabled) return;
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + rect.width / 2 + window.scrollX,
            });
        }
    };

    const handleMouseLeave = () => {
        setCoords(null);
    };

    return (
        <div
            ref={wrapperRef}
            className="event-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="event-label">{title}</span>

            {coords && !disabled && (
                <div
                    className={`event-popover event-popover--${type ?? "NOTE"}`}
                    style={{
                        position: "fixed",
                        top: coords.top - 8,
                        left: coords.left,
                        transform: "translateX(-50%) translateY(-100%)",
                    }}
                >
                    <p className="popover-title">{title}</p>

                    {time && (
                        <div className="popover-row">
                            <span className="popover-icon">
                                <FontAwesomeIcon icon={faClock} />
                            </span>
                            <span>{time}</span>
                        </div>
                    )}

                    {description && (
                        <div className="popover-row">
                            <span className="popover-icon">
                                <FontAwesomeIcon icon={faClipboard} />
                            </span>
                            <span>{description}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
