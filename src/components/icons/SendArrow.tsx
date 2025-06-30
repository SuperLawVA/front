import IconOptions from "@/app/types/IconOptions";

const SendArrowIcon = ({
  width = 2,
  height = 2,
  color = "#6000FF",
}: IconOptions) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    width={typeof width == "number" ? width + "rem" : width}
    height={typeof height == "number" ? height + "rem" : height}
    color={color}
    fill="none"
  >
    <circle cx="10" cy="10" r="10" fill={color} />
    <path
      d="M9 16.1543C9 16.7066 9.44772 17.1543 10 17.1543C10.5523 17.1543 11 16.7066 11 16.1543H9ZM10.7071 3.1395C10.3166 2.74897 9.68342 2.74897 9.29289 3.1395L2.92893 9.50346C2.53841 9.89398 2.53841 10.5271 2.92893 10.9177C3.31946 11.3082 3.95262 11.3082 4.34315 10.9177L10 5.26082L15.6569 10.9177C16.0474 11.3082 16.6805 11.3082 17.0711 10.9177C17.4616 10.5271 17.4616 9.89398 17.0711 9.50346L10.7071 3.1395ZM10 16.1543H11V3.8466H10H9V16.1543H10Z"
      fill="white"
    />
  </svg>
);

export default SendArrowIcon;
