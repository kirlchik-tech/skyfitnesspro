'use client';

import React from "react";
import { Button } from "./Button";

export const ScrollToTop = () => {
    return (
        <Button
            className="w-[127px] h-[52px] text-[#000000]"
            variant="primary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            Наверх ↑
        </Button>
    );
};