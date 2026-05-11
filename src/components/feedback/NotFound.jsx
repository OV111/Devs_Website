import React from "react";
import FuzzyText from "../effects/FuzzyText";

const NotFound = () => {
  return (
    <div className="min-h-screen lg:pt-30 lg:pb-80 bg-gray-950 grid justify-center gap-2 sm:gap-4 py-10 text-center px-4">
      <div className="flex justify-center items-center text-center">
        <FuzzyText
          fontSize="clamp(6rem,14vw,14rem)"
          baseIntensity={0.3}
          hoverIntensity={0.5}
          enableHover={true}
        >
          404
        </FuzzyText>
      </div>
      <div>
        <FuzzyText baseIntensity={0.3} hoverIntensity={0.5} enableHover={true}>
          Not found!
        </FuzzyText>
      </div>
    </div>
  );
};
export default NotFound;
