import { useEffect } from "react";
import { motion } from "framer-motion";
import { setError } from "../store/slices/error.slice";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { setSuccess } from "../store/slices/success.slice";

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
                dispatch(setSuccess(false));
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [success, dispatch]);

    return (
        (success || error) && (
            <motion.div
                className={`${success ? "success" : "error"
                    } fixed bottom-2 left-2 border-l-4 p-4 rounded-md z-10`}
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