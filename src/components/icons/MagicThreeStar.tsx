import IconOptions from "@/app/types/IconOptions";

// color="#5046E5" (단색) or "#5046E5 #9134EB" (그라디언트)
const MagicIcon = ({
  width = 13,
  height = 12,
  color = "#5046E5 #9134EB",
}: IconOptions) => {
  const isGradient = color.includes(" ");
  const [startColor, endColor] = color.split(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline" }}
    >
      {/* 메인 별 */}
      <path
        d="M5.29838 7.75012C5.25002 7.57709 5.15232 7.41918 5.01543 7.29282C4.87853 7.16646 4.70746 7.07626 4.52001 7.03162L1.19688 6.24062C1.14019 6.22577 1.09029 6.19425 1.05476 6.15085C1.01922 6.10744 1 6.05453 1 6.00012C1 5.94572 1.01922 5.89281 1.05476 5.8494C1.09029 5.806 1.14019 5.77448 1.19688 5.75962L4.52001 4.96812C4.7074 4.92353 4.87842 4.83341 5.01531 4.70714C5.15219 4.58088 5.24994 4.42307 5.29838 4.25012L6.1553 1.18262C6.17123 1.13008 6.20534 1.0838 6.25243 1.05082C6.29952 1.01785 6.35701 1 6.41611 1C6.47522 1 6.5327 1.01785 6.57979 1.05082C6.62688 1.0838 6.661 1.13008 6.67692 1.18262L7.5333 4.25012C7.58166 4.42316 7.67937 4.58107 7.81626 4.70743C7.95315 4.83379 8.12422 4.92399 8.31167 4.96862L11.6348 5.75912C11.6919 5.77367 11.7423 5.80513 11.7783 5.84866C11.8142 5.8922 11.8336 5.94541 11.8336 6.00012C11.8336 6.05484 11.8142 6.10805 11.7783 6.15159C11.7423 6.19512 11.6919 6.22657 11.6348 6.24112L8.31167 7.03162C8.12422 7.07626 7.95315 7.16646 7.81626 7.29282C7.67937 7.41918 7.58166 7.57709 7.5333 7.75012L6.67638 10.8176C6.66045 10.8702 6.62634 10.9165 6.57925 10.9494C6.53216 10.9824 6.47468 11.0002 6.41557 11.0002C6.35646 11.0002 6.29898 10.9824 6.25189 10.9494C6.2048 10.9165 6.17069 10.8702 6.15476 10.8176L5.29838 7.75012Z"
        fill={isGradient ? "url(#paint0_linear_1297_9874)" : startColor}
        stroke={isGradient ? "url(#paint1_linear_1297_9874)" : startColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 오른쪽 위 작은 별 */}
      <path
        d="M10.7495 1.5V3.5"
        stroke={isGradient ? "url(#paint2_linear_1297_9874)" : startColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.8327 2.5H9.66602"
        stroke={isGradient ? "url(#paint4_linear_1297_9874)" : startColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 왼쪽 아래 작은 별 */}
      <path
        d="M2.08252 8.5V9.5"
        stroke={isGradient ? "url(#paint5_linear_1297_9874)" : startColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.62435 9H1.54102"
        stroke={isGradient ? "url(#paint7_linear_1297_9874)" : startColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* === Gradient 정의 === */}
      {isGradient && (
        <defs>
          <linearGradient id="paint0_linear_1297_9874" x1="7.61128" y1="6.00012" x2="7.6113" y2="15.3754" gradientUnits="userSpaceOnUse">
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
          <linearGradient id="paint1_linear_1297_9874" x1="7.61128" y1="6.00012" x2="7.6113" y2="15.3754" gradientUnits="userSpaceOnUse">
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
          <linearGradient id="paint2_linear_1297_9874" x1="11.3598" y1="2.5" x2="11.3598" y2="4.375" gradientUnits="userSpaceOnUse">
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
          {/* paint3은 사용 X */}
          <linearGradient id="paint4_linear_1297_9874" x1="10.9882" y1="3" x2="10.9882" y2="3.9375" gradientUnits="userSpaceOnUse">
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
          <linearGradient id="paint5_linear_1297_9874" x1="2.69278" y1="9" x2="2.69278" y2="9.9375" gradientUnits="userSpaceOnUse">
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
          {/* paint6은 사용 X */}
          <linearGradient id="paint7_linear_1297_9874" x1="2.20213" y1="9.5" x2="2.20213" y2="10.4375" gradientUnits="userSpaceOnUse">
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};

export default MagicIcon;