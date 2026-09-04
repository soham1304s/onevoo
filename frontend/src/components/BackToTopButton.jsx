import React, { useState, useEffect, useCallback } from "react";

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = useCallback(() => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    // Scroll to top smoothly
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <button className={`back-to-top-btn ${isVisible ? "show" : ""}`} onClick={scrollToTop} title="Go to top">
            ↑
        </button>
    );
}