import Marquee from "react-fast-marquee";

const TextMarqueeSolitaire = ({
    text,
    backgroundColor = "#007CC6",
    speed = 50,
    fontColor = "#96CADE",
    direction = "left",
}) => {
    return (
        <Marquee
            speed={speed}
            autoFill={true}
            direction={direction}
            style={{
                backgroundColor: backgroundColor,
            }}
            className={`border lg:py-5 md:py-4 py-2 border-none`}
        >
            {text.split(",").map((segment, index) => (
                <span
                    key={index}
                    className={`mr-20 text-${fontColor} font-bold text-sm md:text-xl lg:text-2xl`}
                >
                    {segment.trim()}
                </span>
            ))}
        </Marquee>
    );
};

export default TextMarqueeSolitaire;
