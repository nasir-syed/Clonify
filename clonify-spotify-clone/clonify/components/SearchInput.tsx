"use client";

import useDelay from "@/hooks/useDelay";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";
import Input from "./Input";

const SearchInput = () => {

    const router = useRouter();
    const [value, setValue] = useState<string>("")
    const delayedValue = useDelay<string>(value, 500)

    useEffect(() => {
        const query = {
            title: delayedValue,
        };

        const url = qs.stringifyUrl({
            url: "/search",
            query: query
        })

        router.push(url)
    }, [delayedValue, router])

    return (
        <Input placeholder="what song is on your mind?" value={value} onChange={(e) => setValue(e.target.value)}/>
    );
}

export default SearchInput;