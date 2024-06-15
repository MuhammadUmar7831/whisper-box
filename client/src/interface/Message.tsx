import { useEffect } from "react";
import { motion } from "framer-motion";
import { setError } from "../store/slices/error.slice";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";

export default function Message() {
    const { success } = useAppSelector((state: RootState) => state.success);
    const { error } = useAppSelector((state: RootState) => state.error);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => {
                dispatch(setError(false));
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success) {
            const timeoutId = setTimeout(() => {
                dispatch(setError(false));
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [success, dispatch]);

    return (
        (success || error) && (
            <motion.div
                className={`${success ? "success" : "error"
                    } fixed top-2 left-2 border-l-4 p-4 rounded-md`}
                role="alert"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
            >
                <p className="font-bold">{success ? "Success" : "Error"}</p>
                {success && <p>{success}</p>}
                {error && <p>{error}</p>}
            </motion.div>
        )
    );
}