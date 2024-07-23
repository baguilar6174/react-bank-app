import React, { ImgHTMLAttributes } from 'react';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string;
	fallbackSrc?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fallbackComponent?: React.ComponentType<any>;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props: ImageWithFallbackProps): JSX.Element => {
	const { src, alt, fallbackSrc, fallbackComponent: FallbackComponent, ...rest } = props;

	const [imgSrc, setImgSrc] = React.useState<string>(src);
	const [hasError, setHasError] = React.useState<boolean>(false);

	const onError = (): void => {
		if (imgSrc !== fallbackSrc && fallbackSrc) {
			setImgSrc(fallbackSrc);
		} else {
			setHasError(true);
		}
	};

	if (hasError && FallbackComponent) return <FallbackComponent {...rest} />;

	return <img src={imgSrc} alt={alt} onError={onError} {...rest} />;
};
