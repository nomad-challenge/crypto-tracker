import { Link } from "react-router-dom";
import { styled } from "styled-components";

const Button = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: gray;
  &:hover {
    svg {
      color: #c5bfbf;
    }
  }
  svg {
    transition: color 0.2s ease-in;
  }
`;

const Svg = styled.svg`
  width: 40px;
  height: 40px;
`;

const BackButton = () => {
  return (
    <Button to={"/"}>
      <Svg
        fill="currentColor"
        viewBox="0 0 20 20"
        className="w-8 h-8 text-gray-300 cursor-pointer"
      >
        <path
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
          clip-rule="evenodd"
          fill-rule="evenodd"
        ></path>
      </Svg>
    </Button>
  );
};

export default BackButton;
