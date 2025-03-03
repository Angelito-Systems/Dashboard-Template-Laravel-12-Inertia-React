import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="/assets/img/circle-logo.png" alt="SOS 3ANGELES" {...props} />;
}
