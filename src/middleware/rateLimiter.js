import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {

    try {
        // here we just kept it simple
        // in a real-world-app you'd like to put the user id or ip address as your key
        const {success} = await rateLimit.limit("my-rate-limit");//사용자의 id 또는 ip 주소 설정 가능

        if (!success) {
            return res.status(429).json({
                message: "Too many requests"
            })
        }

        next();

    } catch (error) {
        console.log("rate limitter error", error);
    }
}

export default rateLimiter;
