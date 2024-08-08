import "./DieSvg.css";

const TextSvgTag = ({
  text,
  width = 100,
  height = 100,
  color = "black",
}: {
  text: string | number;
  width?: number;
  height?: number;
  color?: string;
}) => (
  <text
    fontSize="60"
    textAnchor="middle"
    dominantBaseline="middle"
    fontFamily="monospace"
    fontWeight="bold"
    x={width}
    y={height}
    fill={color}
    stroke={color}
    strokeWidth="1"
  >
    {text}
  </text>
);

const MONOSPACE_CHAR_WIDTH = 16.5;
const TEXT_SVG_PADDING = 10;

export const TextSvg = ({
  text,
  width = text.toString().length * MONOSPACE_CHAR_WIDTH + TEXT_SVG_PADDING,
  height = 100,
  color = "black",
}: {
  text: string | number;
  width?: number;
  height?: number;
  color?: string;
}) => (
  <svg
    viewBox={`0 0 ${width * 2} ${height * 2}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ height }}
  >
    <TextSvgTag text={text} color={color} width={width} height={height} />
  </svg>
);

export const D4Svg = ({
  text,
  color = "black",
}: {
  text: string | number;
  color?: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <polyline
      points="20,160 100,20 180,160 20,160"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="100,20 185,130 180,160"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const D6Svg = ({
  text,
  color = "black",
}: {
  text: string | number;
  color?: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <polyline
      points="40,40 160,40 160,160 40,160 40,40"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="40,40 65,15 185,15 185,135 160,160"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <line
      x1="160"
      y1="40"
      x2="185"
      y2="15"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const D8Svg = ({
  text,
  color = "black",
}: {
  text: string | number;
  color?: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <polyline
      points="100,10 178,55 178,145 100,190 22,145 22,55 100,10"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="100,10 178,145 22,145 100,10"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const D10Svg = ({
  text,
  color = "black",
}: {
  text: string | number;
  color?: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <polyline
      points="100,10 178,75 178,125 100,190 22,125 22,75 100,10"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="22,125 42,125 100,155 158,125 178,125"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="42,125 100,10 158,125"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <line
      x1="100"
      y1="155"
      x2="100"
      y2="190"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const D12Svg = ({
  text,
  color = "black",
}: {
  text: string | number;
  color?: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <polyline
      points="100,10 47,27 14,72 14,128 47,173 100,190 153,173 186,128 186,72 153,27 100,10"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="100,30 33,78 59,157 141,157 167,78 100,30"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <line
      x1="100"
      y1="10"
      x2="100"
      y2="30"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <line
      x1="14"
      y1="72"
      x2="33"
      y2="78"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <line
      x1="47"
      y1="173"
      x2="59"
      y2="157"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <line
      x1="153"
      y1="173"
      x2="141"
      y2="157"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <line
      x1="186"
      y1="72"
      x2="167"
      y2="78"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const D20Svg = ({
  text,
  color,
}: {
  text: string | number;
  color: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <polyline
      points="32,58 168,58 100,180 32,58"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="32,58 100,5 168,58 182,148 100,180 18,148 32,58"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <polyline
      points="18,52 100,5 182,52 182,148 100,195 18,148 18,52"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    />
    <line
      x1="18"
      y1="52"
      x2="32"
      y2="58"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <line
      x1="182"
      y1="52"
      x2="168"
      y2="58"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <line
      x1="100"
      y1="195"
      x2="100"
      y2="180"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const CircleSvg = ({
  text,
  color = "black",
}: {
  text: string | number;
  color?: string;
}) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="dieSvg"
  >
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="5"
    />
    <TextSvgTag text={text} color={color} />
  </svg>
);

export const DieSvg = ({
  sides,
  text,
  color = "black",
}: {
  sides: number;
  text: number | string;
  color?: string;
}) => {
  switch (sides) {
    case 4:
      return <D4Svg text={text} color={color} />;
    case 6:
      return <D6Svg text={text} color={color} />;
    case 8:
      return <D8Svg text={text} color={color} />;
    case 10:
      return <D10Svg text={text} color={color} />;
    case 12:
      return <D12Svg text={text} color={color} />;
    case 20:
      return <D20Svg text={text} color={color} />;
    default:
      return <CircleSvg text={text} color={color} />;
  }
};

export default DieSvg;
