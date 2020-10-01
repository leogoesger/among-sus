
import React, { useEffect } from "react";

export const AdBanner = ({ slotId, width, height }: any) => {
    useEffect(() => {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }, []);

    return (
        <ins
            className='adsbygoogle'
            style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
            data-ad-client='ca-pub-2968396275140425'
            data-ad-slot={slotId} />
    );
};

export default AdBanner;