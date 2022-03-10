import { useEffect, useState } from "react";
import { compareByName } from "./helpers";

const useApiGet = ({ getFn, constantResult, cmpFn = compareByName, params = null }: any) => {

    const [result, setResult] = useState<any[]>(constantResult || []);
    const [loading, setLoading] = useState<boolean>(!constantResult);
    const [error, setError] = useState<string | undefined>();
    const [refreshCounter, setRefreshCounter] = useState<number>(0);

    const refresh = () => {
        setRefreshCounter((i) => i + 1);
    };

    useEffect(() => {
        if (!constantResult) {
            const f = async () => {
                if (refreshCounter === 0) {
                    setLoading(true);
                }
                const res = (params) ? await getFn(params) : await getFn();
                if (res.result) {
                    if (cmpFn) {
                        setResult(res.result.sort(cmpFn));
                    } else {
                        setResult(res.result);
                    }
                } else {
                    setError(res.error);
                }
                if (refreshCounter === 0) {
                    setLoading(false);
                }
            };
            f();
        }
    }, [refreshCounter, getFn, cmpFn, constantResult]);

    return { result, error, loading, refresh };
};

export default useApiGet;
