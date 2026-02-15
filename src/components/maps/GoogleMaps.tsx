interface GoogleMapsProps {
    address: string;
}

export default function GoogleMaps({ address }: GoogleMapsProps) {
    return (
        <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            allowFullScreen
        />
    );
}