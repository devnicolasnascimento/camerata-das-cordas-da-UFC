import { useEffect } from "react";
import { animate } from "motion/react";

export default function SmoothScroll() {
    useEffect(() => {
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let animation = null;

        const handleWheel = (e) => {
            e.preventDefault();

            targetScroll += e.deltaY;

            targetScroll = Math.max(
                0,
                Math.min(
                    targetScroll,
                    document.documentElement.scrollHeight - window.innerHeight
                )
            );

            animation?.stop();

            animation = animate(currentScroll, targetScroll, {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],

                onUpdate: (value) => {
                    currentScroll = value;
                    window.scrollTo(0, value);
                },
            });
        };

        const handleScroll = () => {
            if (!animation) {
                currentScroll = window.scrollY;
                targetScroll = window.scrollY;
            }
        };

        window.addEventListener("wheel", handleWheel, {
            passive: false,
        });

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("scroll", handleScroll);

            animation?.stop();
        };
    }, []);

    return null;
}