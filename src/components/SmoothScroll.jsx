
import { useEffect } from "react";
import { animate } from "motion/react";

export default function SmoothScroll() {
    useEffect(() => {
        let animation = null;
        let targetScroll = window.scrollY;

        const getMaxScroll = () =>
            document.documentElement.scrollHeight - window.innerHeight;

        const handleWheel = (e) => {
            // Não interfere em scroll horizontal ou em elementos internos
            if (
                e.ctrlKey ||
                Math.abs(e.deltaX) > Math.abs(e.deltaY)
            ) {
                return;
            }

            e.preventDefault();

            targetScroll += e.deltaY;

            targetScroll = Math.max(
                0,
                Math.min(targetScroll, getMaxScroll())
            );

            animation?.stop();

            animation = animate(
                window.scrollY,
                targetScroll,
                {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],

                    onUpdate: (value) => {
                        window.scrollTo(0, value);
                    },

                    onComplete: () => {
                        animation = null;
                    },
                }
            );
        };

        const handleScroll = () => {
            if (!animation) {
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
