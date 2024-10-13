import { useEffect, useState } from "react";


function useDelay<T>(value:T, delay?: number): T {
    const [val, setVal] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVal(value)
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);


    return val;
}

export default useDelay;