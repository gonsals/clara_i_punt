import Marquee from "react-fast-marquee";

const TextMarquee = ({
    text,
    backgroundColor = "clara-pink-dark",
    speed = 50,
    fontColor = "#96CADE",
    rotate = false,
}) => {
    return (
        <Marquee
            speed={speed}
            autoFill={true}
            style={{
                transform: rotate ? "rotate(-0.6deg)" : "rotate(0.6deg)",
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

export default TextMarquee;
