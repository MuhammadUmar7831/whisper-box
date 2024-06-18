import { useState } from "react"
import { getUserApi, sendMessageApi } from "../api/messageApi";
import { useAppDispatch } from "../store/store";
import { setLoading } from "../store/slices/loading.slice";
import { setError } from "../store/slices/error.slice";
import { setSuccess } from "../store/slices/success.slice";
import { model } from "../lib/geminiSDK";
import { User } from "../types/user.type";


const useWhisper = () => {
    const [message, setMessage] = useState('');
    const [_success, _setSuccess] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [prompt, setPrompt] = useState('Generate a question to inqure someone');
    const [geminiResponse, setGeminiResponse] = useState(['Have you ever cheated in exams?', "You are the best person i've ever met", "You are so rude."]);
    const dispatch = useAppDispatch();

    const getUser = async (userId: string) => {
        dispatch(setLoading(true));
        const res = await getUserApi(userId);
        if (!res.success) {
            console.log(res);
            dispatch(setError(res.message));
            setSuccess(false);
        } else {
            setUser(res.user);
            setSuccess(true);
        }
        dispatch(setLoading(false));
    }

    const sendMessage = async (userId: string | undefined) => {
        if (message.length == 0) {
            dispatch(setError('please write in text field'));
        }
        dispatch(setLoading(true));
        if (userId) {
            const res = await sendMessageApi(userId, message);
            if (res.success) {
                dispatch(setSuccess(res.message));
            } else {
                dispatch(setError(res.message));
            }
        }
        dispatch(setLoading(false));
    }

    const getAiSuggestion = async () => {
        dispatch(setLoading(true));

        try {
            const responses = [];
            const callGemini = async () => {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            };
            for (let i = 0; i < 3; i++) {
                const text = await callGemini();
                responses.push(text);
                console.log(text);
            }
            setGeminiResponse(responses);
        } catch (error) {
            console.error('Error fetching AI suggestions:', error);
        } finally {
            dispatch(setLoading(false));
        }
    };


    return {
        message,
        setMessage,
        getUser,
        _success,
        _setSuccess,
        user,
        sendMessage,
        getAiSuggestion,
        prompt,
        setPrompt,
        geminiResponse
    }
}

export default useWhisper