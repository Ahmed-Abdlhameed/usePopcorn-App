import { useState } from "react";

function StarRating({
    length = 5,
    color = "#fcc419",
    size = 48,
    messages = [],
    defaultRating = 0,
    getRating = 0
}) {
    // States:
    const [rating, setRating] = useState(defaultRating);
    const [tempRating, setTempRating] = useState(0);

    // Creating arr elements:
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(i + 1);
    }

    // Return:
    return (
        <div className="container" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div className="stars" style={{ display: "flex" }}>
                {arr.map((star) => (
                    <Star
                        key={star}
                        star={star}
                        setRating={setRating}
                        filled={tempRating ? tempRating >= star : rating >= star}
                        tempRating={tempRating}
                        setTempRating={setTempRating}
                        color={color}
                        size={size}
                        getRating={getRating}
                    />
                ))}
            </div>
            <p
                className="rate"
                style={{ lineHeight: "1", margin: "0", fontSize: `${size / 2}px`, color }}>
                {
                    messages.length === length
                        ? messages[tempRating ? tempRating - 1 : rating - 1]
                        : tempRating || rating || ""
                }
            </p>
        </div>
    );
}

function Star({
    star, setRating, filled, setTempRating, color, size, getRating
}) {
    return (
        <span
            style={{ width: `${size}px`, height: `${size}px`, display: "block", cursor: "pointer" }}
            onClick={() => {
                setRating(star);
                getRating(star);
            }}
            onMouseEnter={() => setTempRating(star)}
            onMouseLeave={() => setTempRating(0)}
        >
            {
                filled ?
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={color}
                        stroke={color}
                    >
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                    </svg>
                    :
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={color}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="{2}"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
            }
        </span>
    )
}

export default StarRating;