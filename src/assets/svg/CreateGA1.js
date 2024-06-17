import * as React from 'react';
const CreateGA1 = (props) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width={1181}
        height={888}
        fill='none'
        {...props}
    >
        <g filter='url(#a)'>
            <path
                fill='#E76309'
                fillOpacity={0.12}
                d='M493.416 234.507c208.078-60.417 701.174 80.467 761.804 289.274 60.63 208.807-58.9 427.056-266.979 487.469-208.079 60.42-596.129-83.329-656.758-292.136-60.628-208.807-46.146-424.19 161.933-484.607Z'
            />
        </g>
        <defs>
            <filter
                id='a'
                width={1570.76}
                height={1404.73}
                x={0.235}
                y={-79.581}
                colorInterpolationFilters='sRGB'
                filterUnits='userSpaceOnUse'
            >
                <feFlood floodOpacity={0} result='BackgroundImageFix' />
                <feBlend
                    in='SourceGraphic'
                    in2='BackgroundImageFix'
                    result='shape'
                />
                <feGaussianBlur
                    result='effect1_foregroundBlur_966_121839'
                    stdDeviation={150}
                />
            </filter>
        </defs>
    </svg>
);
export default CreateGA1;
